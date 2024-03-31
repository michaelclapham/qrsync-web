import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/react";
import React from "react";

export const HistoryCard: React.FC<{}> = () => {
  return <IonCard>
    <IonCardHeader>
      <IonCardTitle>History</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>
      <p>Shared content will show up here .</p>
    </IonCardContent>
  </IonCard>;
};
