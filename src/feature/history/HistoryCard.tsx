import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem } from "@ionic/react";
import React from "react";
import { SessionMessage } from "../session/SessionMessage";

export type HistoryCardProps = {
    messages: SessionMessage[];
}

export const HistoryCard: React.FC<HistoryCardProps> = ({messages}) => {
  return <IonCard>
    <IonCardHeader>
      <IonCardTitle>History</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>
        { messages.length === 0 ? <NoMessages/> :
        messages.map(msg => <Message key={msg.uuid ?? "" + Math.random()} msg={msg} />) }
    </IonCardContent>
  </IonCard>;
};

type MessageProps = {
    msg: SessionMessage;
}

const Message: React.FC<MessageProps> = ({msg}) => {
    return <IonItem>
        <b>{msg.senderName}:</b>
        {msg.text}
    </IonItem>
}

const NoMessages: React.FC = () => {
    return <div>Shared content will show up here.</div>
}