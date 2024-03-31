import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/react";
import React from "react";
import { SessionActionsList } from "../session-actions/SessionActionsList";
import { WSClient } from "../../WSClient";

export type ShareCardProps = {
    wsClient: WSClient;
    sessionOwnerId?: string;
}

export const ShareCard: React.FC<ShareCardProps> = ({wsClient, sessionOwnerId}) => {
  return <IonCard>
    <IonCardHeader>
      <IonCardTitle>Share</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>
      <SessionActionsList
        wsClient={wsClient}
        userIsSessionOwner={
          sessionOwnerId === wsClient.getId()
        }
      ></SessionActionsList>
    </IonCardContent>
  </IonCard>;
};
