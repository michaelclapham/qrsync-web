import React from "react";
import { WSClient } from "../../WSClient";

export interface SessionActionModalProps {
    wsClient: WSClient;
    closeModal: () => any;
}

export class SessionActionModal<P = {}, S = {}> extends React.Component<SessionActionModalProps & P, S> {

}