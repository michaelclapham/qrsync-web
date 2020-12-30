import React from "react";

export interface SessionPageProps {
    sessionId: string;
}

export class SessionPage extends React.Component<SessionPageProps> {

    render() {
        return <div>
            <h1>Session Page</h1>
            <p>{this.props.sessionId}</p>
        </div>
    }

}