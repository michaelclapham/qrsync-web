import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
} from "@ionic/react";
import React from "react";
import { ServerTypes } from "../../ServerTypes";

export type ClientsCardProps = {
  ownerId: string | undefined;
  clientMap: Record<string, ServerTypes.Client>;
  addClientClicked: () => void;
};

export const ClientsCard: React.FC<ClientsCardProps> = ({
  clientMap,
  ownerId,
  addClientClicked,
}) => {
  const allClients = Object.values(clientMap);
  const onlyOwner = ownerId && clientMap[ownerId] && allClients.length <= 1;

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Clients</IonCardTitle>
        <IonCardSubtitle>Devices connected to this session</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {onlyOwner ? (
            <p>You are the only client connected to this session.</p>
          ) : null}
          {allClients.map((client) => (
            <ClientCircle client={client}></ClientCircle>
          ))}
          <IonButton onClick={addClientClicked}>Add Client</IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

type ClientCircleProps = {
  client: ServerTypes.Client;
};

const ClientCircle: React.FC<ClientCircleProps> = ({ client }) => {
  return (
    <div
      style={{
        minWidth: 32,
        height: 32,
        backgroundColor: "skyblue",
        borderRadius: 32,
        color: "white",
        fontSize: 16,
      }}
    >
      {client.id} : {client.name}
    </div>
  );
};
