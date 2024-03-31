import React, { useEffect, useState } from "react";
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
import { SessionMessage } from "./SessionMessage";
import { ClientsCard } from "../clients/ClientsCard";
import { HistoryCard } from "../history/HistoryCard";
import { ShareCard } from "../share/ShareCard";

export interface SessionPageProps {
  sessionId: string | undefined;
  sessionOwnerId: string | undefined;
  clientMap: Record<string, ServerTypes.Client>;
  wsClient: WSClient;
  onLeaveSession: () => any;
}

export const SessionPage: React.FC<SessionPageProps> = ({
  sessionId,
  sessionOwnerId,
  clientMap,
  wsClient,
  onLeaveSession,
}) => {
  const [sessionMessages, setSessionMessages] = useState<SessionMessage[]>([]);

  useEffect(() => {
    wsClient.addMessageHandler('session_page', onWebsocketMessage);
  }, [wsClient]);

  const onWebsocketMessage = (msg: ServerTypes.Msg) => {
    if (msg.type === "BroadcastFromSession") {
      let payload: SessionMessage = msg.payload;
      if (payload.type && payload.text) {
        let sessionMsgs: SessionMessage[] = [];
        if (sessionMessages) {
          sessionMsgs = sessionMessages;
        }
        sessionMsgs.push(payload);
        setSessionMessages(sessionMsgs);
      }
      if (msg.senderId !== wsClient.getId()) {
        if (payload.type === "OPEN_WEBSITE") {
          console.log("Opening url ", payload.text);
          window.open(payload.text, "_blank");
        }
      }
    }
  };

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
        {/* TODO: Show received messages in history card */}
        <HistoryCard></HistoryCard>
        <ShareCard wsClient={wsClient} sessionOwnerId={sessionOwnerId} />
        <IonButton onClick={onLeaveSession}>Leave Session with id: {sessionId}</IonButton>
      </IonContent>
    </IonPage>
  );
};
