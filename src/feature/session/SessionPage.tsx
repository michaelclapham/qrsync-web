import React from "react";
import { ServerTypes } from "../../ServerTypes";
import { IonButton, IonIcon, IonInput } from "@ionic/react";
import { WSClient } from "../../WSClient";
import { SessionMessage } from "./SessionMessage";
import { SessionActionsList } from "../session-actions/SessionActionsList";

export interface SessionPageProps {
    sessionId: string | null;
    sessionOwnerId: string | null;
    clientMap: Record<string, ServerTypes.Client>;
    wsClient: WSClient;
    onLeaveSession: () => any;
}

export interface SessionPageState {
    urlInput: string;
    sessionMessages: SessionMessage[];
}

export class SessionPage extends React.Component<SessionPageProps, SessionPageState> {

    constructor(props: SessionPageProps) {
        super(props);
        props.wsClient.addMessageHandler("session_page", this.onWebsocketMessage);
    }

    state = {
        urlInput: "",
        sessionMessages: []
    };

    

    render() {
        return <div>
            <IonButton onClick={this.props.onLeaveSession}>Leave Session</IonButton>
            <h1>Session Page</h1>
            <p>{this.props.sessionId}</p>
            <SessionActionsList
                wsClient={this.props.wsClient}
                userIsSessionOwner={this.props.sessionOwnerId === this.props.wsClient.getId()}
            ></SessionActionsList>
        </div>
    }

    renderOwnerActions = () => {
        if (this.props.ourClientId === this.props.sessionOwnerId) {
            return <div>
                {this.ownerActions.map((ownerAction) => this.renderOwnerAction(ownerAction))}
            </div>
        }
    }

    renderOwnerAction = (ownerAction: OwnerAction) => {
        return <div key={ownerAction.name} onClick={() => this.ownerActionClicked(ownerAction)}>
            <h2>{ownerAction.name}</h2>
            <IonIcon icon={ownerAction.ionicon} style={{width: 200, height: 200}}></IonIcon>
            {ownerAction.name === "Open Website" ? 
                <IonInput value={this.state.urlInput} placeholder="Enter URL to open on other computers"
                    onIonChange={e => this.setState({ urlInput: e.detail.value! })}></IonInput> : null}
        </div>
    }

    ownerActionClicked = (ownerAction: OwnerAction) => {
        if (ownerAction.name === "Open Website") {
            this.props.wsClient.sendMessage({
                type: "BroadcastToSession",
                payload: {
                    ownerActionName: "Open Website",
                    openURL: this.state.urlInput
                }
            });
        }
    }

    onWebsocketMessage = (msg: ServerTypes.Msg) => {
        if (msg.type === "BroadcastFromSession" && msg.senderId !== this.props.ourClientId) {
            if (msg.payload.ownerActionName === "Open Website") {
                if (msg.payload.openURL) {
                    console.log("Opening url??", msg.payload.openURL);
                    window.open(msg.payload.openURL, "_blank");
                }
            }
        }
    }

}