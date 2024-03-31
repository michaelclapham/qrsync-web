import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonModal } from "@ionic/react";
import React, { useState } from "react";
import { SessionMessage, SessionMessageType } from "../session/SessionMessage";
import { ShareModal } from "./share-actions/ShareModal";

export type ShareCardProps = {
    onShare: (msg: SessionMessage) => void;
    userIsSessionOwner?: boolean;
}

export const ShareCard: React.FC<ShareCardProps> = ({onShare, userIsSessionOwner}) => {
    const [shareModalTypeOpen, setShareModalTypeOpen] = useState<SessionMessageType | null>(null);

    return <IonCard>
        <IonCardHeader>
            <IonCardTitle>Share</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
            {/* Send text message */}
            <IonButton
                onClick={() => setShareModalTypeOpen("TEXT_MESSAGE")}
            >Send Message</IonButton>
        </IonCardContent>
        <IonModal isOpen={shareModalTypeOpen != null} onDidDismiss={() => setShareModalTypeOpen(null)}>
            <ShareModal
                type={shareModalTypeOpen} 
                onShare={onShare} 
                closeModal={() => setShareModalTypeOpen(null)}
            />
        </IonModal>
    </IonCard>;
};