export type SessionMessageType = "TEXT_MESSAGE" | "FILE" | "OPEN_WEBSITE";

export interface SessionMessage {
    type: SessionMessageType;
    senderId: string;
    senderName: string;
    text: string;
}

export interface OpenWebsiteSessionMessage extends SessionMessage {
    type: "OPEN_WEBSITE"
}