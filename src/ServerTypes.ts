export namespace ServerTypes {
    export type Msg = ClientConnectMsg | CreateSessionMsg | UpdateClientMsg | AddClientToSessionMsg | ClientJoinedSessionMsg | ClientLeftSessionMsg | BroadcastToSessionMsg | BroadcastFromSessionMsg | ErrorMsg | InfoMsg

    export type Time = string; // Go times are serialised to strings

    export interface Client {
        id: string;
        name: string;
        lastJoinTime: Time;
    }
    export interface Session {
        id: string;
        ownerId: string;
        clientIds: string[];
    }
    export interface ClientConnectMsg {
        type: "ClientConnect";
        client: Client;
    }
    export interface CreateSessionMsg {
        type: "CreateSession";
    }
    export interface UpdateClientMsg {
        type: "UpdateClient";
        name: string;
    }
    export interface AddClientToSessionMsg {
        type: "AddClientToSession";
        sessionId: string;
        addClientId: string;
    }
    export interface ClientJoinedSessionMsg {
        type: "ClientJoinedSession";
        clientId: string;
        sessionId: string;
        sessionOwnerId: string;
        clientMap: {[key: string]: Client};
    }
    export interface ClientLeftSessionMsg {
        type: "ClientLeftSession";
        clientId: string;
        sessionId: string;
        sessionOwnerId: string;
        clientMap: {[key: string]: Client};
    }
    export interface BroadcastToSessionMsg {
        type: "BroadcastToSession";
        payload: string;
    }
    export interface BroadcastFromSessionMsg {
        type: "BroadcastFromSession";
        fromSessionOwner: boolean;
        senderId: string;
        payload: string;
    }
    export interface ErrorMsg {
        type: "Error";
        message: string;
    }
    export interface InfoMsg {
        type: "Info";
        message: string;
    }
}