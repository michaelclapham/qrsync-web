import React from 'react';
import './App.css';
import { ServerTypes } from './ServerTypes';
import { Client } from './Client';
import { Header } from './feature/header/Header';
import { RouteComponentProps } from 'react-router-dom'
import { SessionPage } from './feature/session/SessionPage';
import { HomePage } from './feature/home/HomePage';

interface AppState {
  result: string;
  goToURL: string;
  clientMap: Record<string, Client>;
  scanModalOpen: boolean;
  ourClientId: string | null;
  sessionId: string | null;
}

class App extends React.Component<RouteComponentProps, AppState> {
  ws: WebSocket | undefined;
  clientIdsForUpcomingSession: string[] = [];

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      result: "",
      goToURL: "",
      clientMap: {},
      scanModalOpen: false,
      ourClientId: null,
      sessionId: null
    };
    this.connectToWebsocket();
  }

  handleUrlSubmit = () => {

  };

  connectToWebsocket = () => {
    this.ws = new WebSocket("wss://qrsync.org/api/v1/ws");
    this.ws.onmessage = (event) => {
      console.log("ws event", event);
      const msg: ServerTypes.Msg = JSON.parse(event.data);
      this.onReceiveWebsocketMsg(msg);
    }
  }

  sendWsMsg = (msg: ServerTypes.Msg) => {
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      const data = JSON.stringify(msg);
      this.ws.send(data);
    }
  }

  onReceiveWebsocketMsg = (msg: ServerTypes.Msg) => {
    if (msg.type) {
      switch (msg.type) {
        case "ClientConnect": return this.onClientConnectMsg(msg);
        case "ClientJoinedSession": return this.onClientJoinedSessionMsg(msg);
      }
    } else {
      console.warn("No message type ", msg);
    }
  }

  onClientJoinedSessionMsg = (msg: ServerTypes.ClientJoinedSessionMsg) => {
    if (msg.clientId === this.state.ourClientId) {
      this.setState({ sessionId: msg.sessionId });
      if (this.clientIdsForUpcomingSession) {
        this.clientIdsForUpcomingSession.forEach((clientId) => {
          this.sendWsMsg({
            type: "AddSessionClient",
            addClientId: clientId,
            sessionId: msg.sessionId
          });
        });
      }
      this.props.history.push("/session");
    }
  }

  onClientConnectMsg = (msg: ServerTypes.ClientConnectMsg) => {
    this.setState({ ourClientId: msg.client.id });
  }

  onScanClient = (clientId: string | null) => {
    this.setState({result: "" + clientId});
    if (clientId) {
      console.log("Client id scanned ", clientId);
      if (!this.state.sessionId) {
        this.clientIdsForUpcomingSession.push(clientId);
        this.sendWsMsg({
          type: "CreateSession"
        });
      } else {
        this.sendWsMsg({
          type: "AddSessionClient",
          addClientId: clientId,
          sessionId: this.state.sessionId
        });
      }
    }
  }


  render() {
    return <div className="App">
      <Header></Header>
      {this.state.sessionId ? 
        <SessionPage sessionId={this.state.sessionId}></SessionPage> :
        <HomePage
          ourClientId={this.state.ourClientId}
          onScanClient={this.onScanClient}
        ></HomePage>
      }
    </div>
  }
}

export default App;