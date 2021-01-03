import React from 'react';
import './App.css';
import { ServerTypes } from './ServerTypes';
import { Header } from './feature/header/Header';
import { SessionPage } from './feature/session/SessionPage';
import { HomePage } from './feature/home/HomePage';
import { WSClient } from './WSClient';

interface AppState {
  result: string;
  goToURL: string;
  clientMap: {[key: string]: ServerTypes.Client};
  scanModalOpen: boolean;
  ourClientId: string | null;
  sessionId: string | null;
  sessionOwnerId: string | null;
}

class App extends React.Component<{}, AppState> {
  wsClient: WSClient;

  constructor(props: {}) {
    super(props);
    this.state = {
      result: "",
      goToURL: "",
      clientMap: {},
      scanModalOpen: false,
      ourClientId: null,
      sessionId: null,
      sessionOwnerId: null
    };
    this.wsClient = new WSClient("wss://qrsync.org/api/v1/ws");
    this.wsClient.addMessageHandler("main", this.onReceiveWebsocketMsg);
  }

  onReceiveWebsocketMsg = (msg: ServerTypes.Msg) => {
    if (msg.type) {
      switch (msg.type) {
        case "ClientConnect": return this.onClientConnectMsg(msg);
        case "ClientJoinedSession": return this.onClientJoinedSessionMsg(msg);
        case "BroadcastFromSession": return this.onBroadcastFromSessionMsg(msg);
      }
    } else {
      console.warn("No message type ", msg);
    }
  }

  onClientJoinedSessionMsg = (msg: ServerTypes.ClientJoinedSessionMsg) => {
    if (msg.clientId === this.state.ourClientId) {
      this.setState({
        sessionId: msg.sessionId,
        sessionOwnerId: msg.sessionOwnerId,
        clientMap: msg.clientMap
      });
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
        this.wsClient.sendMessage({
          type: "CreateSession",
          addClientId: clientId
        });
      } else {
        this.wsClient.sendMessage({
          type: "AddSessionClient",
          addClientId: clientId,
          sessionId: this.state.sessionId
        });
      }
    }
  }

  onBroadcastFromSessionMsg = (msg: ServerTypes.BroadcastFromSessionMsg) => {

  }

  onLeaveSession = () => {
    this.wsClient.leaveSession();
    this.setState({ sessionId: null });
  }

  render() {
    return <div className="App">
      <Header></Header>
      {this.state.sessionId ? 
        <SessionPage
          wsClient={this.wsClient}
          sessionId={this.state.sessionId}
          clientMap={this.state.clientMap}
          sessionOwnerId={this.state.sessionOwnerId}
          onLeaveSession={this.onLeaveSession}
        ></SessionPage> :
        <HomePage
          ourClientId={this.wsClient.getId()}
          onScanClient={this.onScanClient}
        ></HomePage>
      }
    </div>
  }
}

export default App;