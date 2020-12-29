import React from 'react';
import logo_fg from './logo_fg1.svg';
import logo_bg from './sync_arrows1.svg';
import './App.css';
import { IonButton, IonModal } from '@ionic/react';
import { ScanPeerModal } from './feature/scan-peer/ScanPeerModal';
import QRCode from "react-qr-code";
import { ServerTypes } from './ServerTypes';
import { Client } from './Client';

interface AppState {
  result: string;
  goToURL: string;
  clientMap: Record<string, Client>;
  scanModalOpen: boolean;
  ourClientId: string;
}

export default class App extends React.Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      result: "",
      goToURL: "",
      clientMap: {},
      scanModalOpen: false,
      ourClientId: ""
    };
    this.connectToWebsocket();
  }

  handleUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {

  };

  connectToWebsocket = () => {
    const ws = new WebSocket("ws://localhost:4001/v1/ws");
    ws.onmessage = (event) => {
      console.log("ws event", event);
      const msg: ServerTypes.Msg = JSON.parse(event.data);
      this.onReceiveWebsocketMsg(msg);
    }
  }

  onReceiveWebsocketMsg = (msg: ServerTypes.Msg) => {
    if (msg.type) {
      switch (msg.type) {
        case "ClientConnect": return this.onClientConnectMsg(msg)
      }
    } else {
      console.warn("No message type ", msg);
    }
  }

  onClientConnectMsg = (msg: ServerTypes.ClientConnectMsg) => {
    this.setState({ ourClientId: msg.client.id });
  }

  onScanPeer = (client: Client) => {
    this.setState({ clientMap: { ...this.state.clientMap, client } })
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
        { this.state.ourClientId.length > 0 ? <QRCode value={this.state.ourClientId}></QRCode> : null }
        <p>Result: {this.state.result}</p>
        <form onSubmit={this.handleUrlSubmit}>
          <label>
            Go To URL:
          <textarea value={this.state.goToURL} onChange={(event) => this.setState({ goToURL: event.target.value })} />
          </label>
          <input type="submit" value="Submit" />
        </form>
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
          <ScanPeerModal onScanPeer={this.onScanPeer} onCloseClick={this.closeScannerModal}></ScanPeerModal>
        </IonModal>
      </div>
    );
  }
}