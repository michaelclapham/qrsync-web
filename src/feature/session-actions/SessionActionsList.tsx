import React from "react";
import { globeOutline } from 'ionicons/icons';
import { IonIcon, IonModal } from "@ionic/react";
import { OpenWebsiteModal } from "./OpenWebsiteModal";
import { WSClient } from "../../WSClient";
import { SessionActionModal } from "./SessionActionModal";

export interface SessionActionsListProps {
    wsClient: WSClient;
    userIsSessionOwner: boolean;
}

export interface SessionActionsListState {
    actionModalOpen: boolean;
    actionModalComponent?: typeof SessionActionModal;
}

export interface SessionActionSummary {
    name: string;
    ionicon: string;
    ownerOnly: boolean;
    modalComponent?: typeof SessionActionModal;
}

const sessionActions: SessionActionSummary[] = [
    {
        name: "Open Website",
        ionicon: globeOutline,
        ownerOnly: true,
        modalComponent: OpenWebsiteModal
    }
];

export class SessionActionsList extends React.Component<SessionActionsListProps, SessionActionsListState> {
    
    state: SessionActionsListState = {
        actionModalOpen: false
    };

    render() {
        
        return <div className="session-actions">
            {sessionActions.filter((action) => this.props.userIsSessionOwner || !action.ownerOnly)
            .map((action) => this.renderActionButton(action))
            }
            <IonModal isOpen={this.state.actionModalOpen}>
                {this.renderModal()}
            </IonModal>
        </div>
    }

    renderActionButton = (action: SessionActionSummary) => {
        <div key={action.name} onClick={() => this.onActionClicked(action)}>
            <h2>{action.name}</h2>
            <IonIcon icon={action.ionicon} style={{width: 200, height: 200}}></IonIcon>
        </div>
    }

    renderModal = () => {
        let ModalComponent = this.state.actionModalComponent;
        if (ModalComponent) {
            return <ModalComponent
                closeModal={this.closeModal}
                wsClient={this.props.wsClient}
            ></ModalComponent>
        }
    }

    closeModal = () => {
        this.setState({ actionModalOpen: false });
    }

    onActionClicked = (action: SessionActionSummary) => {
        if (action.name === "Open Website") {
            this.setState({ actionModalOpen: true, actionModalComponent: action.modalComponent })
        }
    }

}