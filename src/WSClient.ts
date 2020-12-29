export class WSClient {

    ws: WebSocket;

    constructor(addr: string) {
        this.ws = new WebSocket(addr);
    }

}