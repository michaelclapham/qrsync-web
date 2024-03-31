import React from "react";
import { ServerTypes } from "../../ServerTypes";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { WSClient } from "../../WSClient";
import { SessionMessage } from "./SessionMessage";
import { SessionActionsList } from "../session-actions/SessionActionsList";
import { ClientsCard } from "../clients/ClientsCard";

export interface SessionPageProps {
  sessionId: string | undefined;
  sessionOwnerId: string | undefined;
  clientMap: Record<string, ServerTypes.Client>;
  wsClient: WSClient;
  onLeaveSession: () => any;
}

export interface SessionPageState {
  urlInput: string;
  sessionMessages: SessionMessage[];
}

export class SessionPage extends React.Component<
  SessionPageProps,
  SessionPageState
> {
  state = {
    urlInput: "",
    sessionMessages: [],
  } as SessionPageState;

  constructor(props: SessionPageProps) {
    super(props);
    props.wsClient.addMessageHandler("session_page", this.onWebsocketMessage);
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>QR Sync - Session</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <ClientsCard
            clientMap={this.props.clientMap}
            ownerId={this.props.sessionOwnerId}
            addClientClicked={() => console.log("add client from clients card to be implemented")}
          ></ClientsCard>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>History</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Shared content will show up here .</p>
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Share</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <SessionActionsList
                wsClient={this.props.wsClient}
                userIsSessionOwner={
                  this.props.sessionOwnerId === this.props.wsClient.getId()
                }
              ></SessionActionsList>
            </IonCardContent>
          </IonCard>
          <IonButton onClick={this.props.onLeaveSession}>
            Leave Session
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  onWebsocketMessage = (msg: ServerTypes.Msg) => {
    if (msg.type === "BroadcastFromSession") {
      let payload: SessionMessage = msg.payload;
      if (payload.type && payload.text) {
        let sessionMsgs: SessionMessage[] = [];
        if (this.state.sessionMessages) {
          sessionMsgs = this.state.sessionMessages;
        }
        sessionMsgs.push(payload);
        this.setState({ sessionMessages: sessionMsgs });
      }
      if (msg.senderId !== this.props.wsClient.getId()) {
        if (payload.type === "OPEN_WEBSITE") {
          console.log("Opening url ", payload.text);
          window.open(payload.text, "_blank");
        }
      }
    }
  };
}
