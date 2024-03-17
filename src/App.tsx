import React, { useEffect, useState } from "react";
import "./App.css";
import { IonApp, IonRouterOutlet, useIonRouter } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { HomePage } from "./feature/home/HomePage";
import { WSClient } from "./WSClient";
import { ServerTypes } from "./ServerTypes";
import { SessionPage } from "./feature/session/SessionPage";

export const App: React.FC = () => {
  // let wsUrl = "wss://qrsync.org/api/v1/ws";
  let wsUrl = "ws://localhost:4010/api/v1/ws";
  const [wsClient] = useState<WSClient>(new WSClient(wsUrl));
  const [ourClientId, setOurClientId] = useState<string>();
  const [sessionOwnerId, setSessionOwnerId] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();
  const [clientMap, setClientMap] = useState<
    Record<string, ServerTypes.Client>
  >({});

  const onClientJoinedSessionMsg = (
    msg: ServerTypes.ClientJoinedSessionMsg
  ) => {
    if (msg.clientId === ourClientId) {
      setSessionId(msg.sessionId);
      setSessionOwnerId(msg.sessionOwnerId);
      setClientMap(msg.clientMap);
    }
  };

  const onClientConnectMsg = (msg: ServerTypes.ClientConnectMsg) => {
    setOurClientId(msg.client.id);
  };

  const onReceiveWebsocketMsg = (msg: ServerTypes.Msg) => {
    if (msg.type) {
      switch (msg.type) {
        case "ClientConnect":
          return onClientConnectMsg(msg);
        case "ClientJoinedSession":
          return onClientJoinedSessionMsg(msg);
        case "BroadcastFromSession":
          return onBroadcastFromSessionMsg(msg);
      }
    } else {
      console.warn("No message type ", msg);
    }
  };

  wsClient.addMessageHandler("main", onReceiveWebsocketMsg);

  const onScanClient = (clientId: string | null) => {
    if (clientId) {
      console.log("Client id scanned ", clientId);
      if (!sessionId) {
        wsClient.sendMessage({
          type: "CreateSession",
          addClientId: clientId,
        });
      } else {
        wsClient.sendMessage({
          type: "AddClientToSession",
          addClientId: clientId,
          sessionId: sessionId,
        });
      }
    }
  };

  const onBroadcastFromSessionMsg = (
    msg: ServerTypes.BroadcastFromSessionMsg
  ) => {};

  const onLeaveSession = () => {
    wsClient.leaveSession();
    setSessionId(undefined);
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/">
            <HomePage
              ourClientId={wsClient.getId()}
              onScanClient={onScanClient}
            ></HomePage>
          </Route>
          <Route path="/session">
            <SessionPage
              wsClient={wsClient}
              sessionId={sessionId}
              clientMap={clientMap}
              sessionOwnerId={sessionOwnerId}
              onLeaveSession={onLeaveSession}
            ></SessionPage>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};
