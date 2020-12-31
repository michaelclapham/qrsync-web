import { ServerTypes } from "./ServerTypes";

export type WSMessageHandler = (msg: ServerTypes.Msg) => any;

export class WSClient {
    ws: WebSocket;
    messageHandlerMap: {[id: string]: WSMessageHandler} = {};
    allMessages: ServerTypes.Msg[] = [];
    clientId: string | null = null;

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.ws.onmessage = (event) => {
            console.log("ws event", event);
            const msg: ServerTypes.Msg = JSON.parse(event.data);
            this.onReceiveWebsocketMsg(msg);
          }
    }

    public addMessageHandler(id: string, handler: WSMessageHandler) {
        this.messageHandlerMap[id] = handler;
    }

    public sendMessage(msg: ServerTypes.Msg) {
        if (this.ws && this.ws.readyState === this.ws.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }

    onReceiveWebsocketMsg = (msg: ServerTypes.Msg) => {
        this.allMessages.push(msg);
        if (msg.type === "ClientConnect") {
            this.clientId = msg.client.id;
        }
        for (let handlerId in this.messageHandlerMap) {
            let handler = this.messageHandlerMap[handlerId];
            handler(msg);
        }
    }

}