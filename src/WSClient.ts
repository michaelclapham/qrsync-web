import { ServerTypes } from "./ServerTypes";

export type WSMessageHandler = (msg: ServerTypes.Msg) => any;

export class WSClient {
    ws: WebSocket;
    messageHandlerMap: { [id: string]: WSMessageHandler } = {};
    allMessages: ServerTypes.Msg[] = [];
    public clientId: string | null = null;
    clientName: string = "";

    constructor(private url: string) {
        console.log("WSClient being created");
        this.ws = this.connect(url);
    }

    private connect(url: string): WebSocket {
        let prevClientId = localStorage.getItem("prevClientId");
        if (prevClientId) {
            url += "?clientId=" + prevClientId;
        }
        this.ws = new WebSocket(url);
        this.ws.onmessage = (event) => {
            console.log("ws event", event);
            const msg: ServerTypes.Msg = JSON.parse(event.data);
            this.onReceiveWebsocketMsg(msg);
        }
        return this.ws;
    }

    public addMessageHandler(id: string, handler: WSMessageHandler) {
        this.messageHandlerMap[id] = handler;
    }

    public sendMessage(msg: ServerTypes.Msg) {
        if (this.ws && this.ws.readyState === this.ws.OPEN) {
            console.log("Sending message", msg);
            this.ws.send(JSON.stringify(msg));
        }
    }

    public getId(): string | null {
        return this.clientId;
    }

    public getName(): string {
        return this.clientName;
    }

    public setName(name: string) {
        this.sendMessage({
            type: "UpdateClient",
            name: name
        });
    }

    public leaveSession() {
        this.ws.close();
        localStorage.removeItem("prevSessionId");
        localStorage.removeItem("prevClientId");
        this.connect(this.url);
    }

    onReceiveWebsocketMsg = (msg: ServerTypes.Msg) => {
        console.log("Received msg ", msg);
        this.allMessages.push(msg);
        if (msg.type === "ClientConnect") {
            this.clientId = msg.client.id;
            this.clientName = msg.client.name;
            const prevSessionId = localStorage.getItem("prevSessionId");
            if (prevSessionId) {
                this.sendMessage({
                    type: "AddClientToSession",
                    sessionId: prevSessionId,
                    addClientId: this.clientId
                });
            }
        }
        if (msg.type === "ClientJoinedSession" && msg.clientId === this.clientId) {
            localStorage.setItem("prevSessionId", msg.sessionId);
            localStorage.setItem("prevClientId", msg.clientId);
        }
        for (let handlerId in this.messageHandlerMap) {
            let handler = this.messageHandlerMap[handlerId];
            handler(msg);
        }
    }

}