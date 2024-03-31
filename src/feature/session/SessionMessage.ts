import { ServerTypes } from "../../ServerTypes";

export const sessionMessageTypes = ["TEXT_MESSAGE", "FILE", "OPEN_WEBSITE"] as const;
export type SessionMessageType = typeof sessionMessageTypes[number];

export interface SessionMessage {
    uuid?: string;
    type?: SessionMessageType;
    senderId?: string;
    senderName?: string;
    text?: string;
}

export interface OpenWebsiteSessionMessage extends SessionMessage {
    type: "OPEN_WEBSITE"
}

export function mapSessionMsg(serverMsg: ServerTypes.BroadcastFromSessionMsg): SessionMessage {
    let sessionMsgType = serverMsg.payload["type"] as SessionMessageType | undefined;
    if (sessionMessageTypes.indexOf(sessionMsgType as SessionMessageType) < 0) {
        sessionMsgType = undefined;
    }
    return {
        uuid: ("" + Math.random() + "-" + Math.random()).replace(".", "0"),
        type: sessionMsgType,
        senderId: serverMsg.senderId,
        senderName: serverMsg.payload["senderName"] ?? "",
        text: serverMsg.payload["text"] ?? ""
    };
}