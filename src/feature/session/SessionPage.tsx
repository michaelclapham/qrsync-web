import React from "react";
import { ServerTypes } from "../../ServerTypes";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { ClientsCard } from "../clients/ClientsCard";
import { HistoryCard } from "../history/HistoryCard";
import { ShareCard } from "../share/ShareCard";
import { SessionMessage } from "./SessionMessage";

export interface SessionPageProps {
  sessionMessages: SessionMessage[];
  sessionId: string | undefined;
  sessionOwnerId: string | undefined;
  clientMap: Record<string, ServerTypes.Client>;
  userIsSessionOwner: boolean;
  onShare: (msg: SessionMessage) => void;
  onLeaveSession: () => any;
}

export const SessionPage: React.FC<SessionPageProps> = ({
  sessionMessages,
  sessionId,
  sessionOwnerId,
  clientMap,
  userIsSessionOwner,
  onShare,
  onLeaveSession,
}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>QR Sync - Session</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ClientsCard
          clientMap={clientMap}
          ownerId={sessionOwnerId}
          addClientClicked={() => {
            /* TODO: Implement opening add client modal */
          }}
        />
        <HistoryCard
          messages={sessionMessages}
        ></HistoryCard>
        <ShareCard onShare={onShare} userIsSessionOwner={userIsSessionOwner}/>
        <IonButton onClick={onLeaveSession}>Leave Session with id: {sessionId}</IonButton>
      </IonContent>
    </IonPage>
  );
};
