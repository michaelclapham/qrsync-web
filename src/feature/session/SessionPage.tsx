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
import { WSClient } from "../../WSClient";
import { ClientsCard } from "../clients/ClientsCard";
import { HistoryCard } from "../history/HistoryCard";
import { ShareCard } from "../share/ShareCard";
import { SessionMessage } from "./SessionMessage";

export interface SessionPageProps {
  sessionMessages: SessionMessage[];
  sessionId: string | undefined;
  sessionOwnerId: string | undefined;
  clientMap: Record<string, ServerTypes.Client>;
  wsClient: WSClient;
  onLeaveSession: () => any;
}

export const SessionPage: React.FC<SessionPageProps> = ({
  sessionMessages,
  sessionId,
  sessionOwnerId,
  clientMap,
  wsClient,
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
        <ShareCard wsClient={wsClient} sessionOwnerId={sessionOwnerId} />
        <IonButton onClick={onLeaveSession}>Leave Session with id: {sessionId}</IonButton>
      </IonContent>
    </IonPage>
  );
};
