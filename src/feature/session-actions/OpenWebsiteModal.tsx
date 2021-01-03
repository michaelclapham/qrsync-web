import { IonButton, IonInput } from "@ionic/react";
import React from "react";
import { SessionMessage } from "../session/SessionMessage";
import { SessionActionModal } from "./SessionActionModal";

export class OpenWebsiteModal extends SessionActionModal<{}, { urlInput: string }> {
    
    state = {
        urlInput: ""
    };

    onOpenWebsiteClick = () => {
        let id = this.props.wsClient.getId();
        if (this.props.wsClient && id != null) {
            let sessionMsg: SessionMessage = {
                type: "OPEN_WEBSITE",
                text: this.state.urlInput,
                senderId: id,
                senderName: this.props.wsClient.getName()
            };
            this.props.wsClient.sendMessage({
                type: "BroadcastToSession",
                payload: sessionMsg
            });
        }
        this.props.closeModal();
    }

    render() {
        return <><h1>Open Website</h1>
            <p>Open a website on devices controlled by this session</p>
            <IonInput value={this.state.urlInput} placeholder="Enter URL to open on other computers"
                    onIonChange={e => this.setState({ urlInput: e.detail.value! })}></IonInput>
            <IonButton onClick={this.onOpenWebsiteClick}>Open Website</IonButton>
        </>
    }

}