import React, { useState } from 'react';
import './App.css';
import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router';
import { HomePage } from './feature/home/HomePage';
import { WSClient } from './WSClient';

export const App: React.FC = () => {

  let wsUrl = "wss://qrsync.org/api/v1/ws";
  const [wsClient] = useState<WSClient>(new WSClient(wsUrl));

  wsClient.addMessageHandler("main", onReceiveWebsocketMsg);

  const onReceiveWebsocketMsg = (msg: ServerTypes.Msg) => {
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

  const onClientJoinedSessionMsg = (msg: ServerTypes.ClientJoinedSessionMsg) => {
    if (msg.clientId === this.state.ourClientId) {
      this.setState({
        sessionId: msg.sessionId,
        sessionOwnerId: msg.sessionOwnerId,
        clientMap: msg.clientMap
      });
    }
  }

  const onClientConnectMsg = (msg: ServerTypes.ClientConnectMsg) => {
    this.setState({ ourClientId: msg.client.id });
  }

  const onScanClient = (clientId: string | null) => {
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

  const onBroadcastFromSessionMsg = (msg: ServerTypes.BroadcastFromSessionMsg) => {

  }

  onLeaveSession = () => {
    this.wsClient.leaveSession();
    this.setState({ sessionId: null });
  }

  return (<IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/home">
          <HomePage
              ourClientId={wsClient.getId()}
              onScanClient={onScanClient}
            ></HomePage>
        </Route>
        <Redirect exact from="/" to="/home" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>);
};