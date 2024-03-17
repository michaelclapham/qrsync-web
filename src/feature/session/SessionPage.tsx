import React from "react";
import { ServerTypes } from "../../ServerTypes";
import { IonButton, IonPage } from "@ionic/react";
import { WSClient } from "../../WSClient";
import { SessionMessage } from "./SessionMessage";
import { SessionActionsList } from "../session-actions/SessionActionsList";

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
        <IonButton onClick={this.props.onLeaveSession}>Leave Session</IonButton>
        <h1>Session Page</h1>
        <p>{this.props.sessionId}</p>
        <h2>Session Messages</h2>
        <ul>
          {this.state.sessionMessages.map((sessionMsg) => (
            <li>{sessionMsg.text}</li>
          ))}
        </ul>
        <h2>Session Actions:</h2>
        <SessionActionsList
          wsClient={this.props.wsClient}
          userIsSessionOwner={
            this.props.sessionOwnerId === this.props.wsClient.getId()
          }
        ></SessionActionsList>
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
