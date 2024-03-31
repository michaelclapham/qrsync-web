import React from "react";
import { SessionMessage, SessionMessageType } from "../../session/SessionMessage";
import { SendMessageModal } from "./SendMessageModal";

export type ShareModalProps = {
    type: SessionMessageType | null;
    onShare: (msg: SessionMessage) => void;
    closeModal: () => any;
};

export const ShareModal: React.FC<ShareModalProps> = ({type, onShare, closeModal}) => {
    switch(type) {
        case "TEXT_MESSAGE": return <SendMessageModal
            type="TEXT_MESSAGE"
            onShare={onShare}
            closeModal={closeModal}
        />
        default: return null;
    }
}