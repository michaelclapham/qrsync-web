import React from 'react';
import logo_fg from './logo_fg1.svg';
import logo_bg from './sync_arrows1.svg';
import './App.css';
import { IonButton, IonModal } from '@ionic/react';
import { ScanClientModal } from './feature/scan-peer/ScanClientModal';
import QRCode from "react-qr-code";
import { ServerTypes } from './ServerTypes';
import { Client } from './Client';

interface AppState {
  result: string;
  goToURL: string;
  clientMap: Record<string, Client>;
  scanModalOpen: boolean;
  ourClientId: string | null;
  sessionId: string | null;
}

export default class App extends React.Component<{}, AppState> {
  ws: WebSocket | undefined;
  clientIdsForUpcomingSession: string[] = [];

  constructor(props: {}) {
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

  handleUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {

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
    }
  }

  onClientConnectMsg = (msg: ServerTypes.ClientConnectMsg) => {
    this.setState({ ourClientId: msg.client.id });
  }

  onScanClient = (clientId: string | null) => {
    this.setState({result: "" + clientId});
    if (clientId) {
      this.closeScannerModal();
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

  closeScannerModal = () => this.setState({ scanModalOpen: false });

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="app-title-container">
            <div className="app-logo-container">
              <img src={logo_fg} className="app-logo-fg" alt="logo" />
              <img src={logo_bg} className="app-logo-bg" alt="logo-bg" />
            </div>
            <h1 className="app-title">QR Sync</h1>
          </div>
        </header>
        { this.state.ourClientId ?
          <><QRCode value={this.state.ourClientId}></QRCode>
            <p>Client Id: {this.state.ourClientId}</p></>
        : null }
        <p>Session Id: {this.state.sessionId}</p>
        <p>Result: {this.state.result}</p>
        <h2>Client List:</h2>
        <ul>
          {
            Object.keys(this.state.clientMap).map((clientId) => <li>
              <span>Id: {clientId}</span>
              <span>Name: {this.state.clientMap[clientId].name}</span>
            </li>)
          }
        </ul>
        <IonButton onClick={() => this.setState({ scanModalOpen: true })}>
          Open Scanner
        </IonButton>
        <IonModal isOpen={this.state.scanModalOpen} onDidDismiss={this.closeScannerModal}>
          <ScanClientModal onScanClient={this.onScanClient} onCloseClick={this.closeScannerModal}></ScanClientModal>
        </IonModal>
      </div>
    );
  }
}