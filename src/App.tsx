import React, { useEffect, useState } from "react";
import "./App.css";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router";
import { NewClientPage } from "./feature/new-client/NewClientPage";
import { WSClient } from "./WSClient";
import { ServerTypes } from "./ServerTypes";
import { SessionPage } from "./feature/session/SessionPage";
import { useHistory } from "react-router-dom";

export enum Page {
  NEW_CLIENT,
  SESSION,
}

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.NEW_CLIENT);
  // let wsUrl = "wss://qrsync.org/api/v1/ws";
  let wsUrl = "ws://localhost:4010/api/v1/ws";
  const [wsClient] = useState<WSClient>(new WSClient(wsUrl));
  const [ourClientId, setOurClientId] = useState<string>();
  const [sessionOwnerId, setSessionOwnerId] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();
  const [clientMap, setClientMap] = useState<
    Record<string, ServerTypes.Client>
  >({});

  const navigateToSessionPage = () => {
    setCurrentPage(Page.SESSION);
    console.log("Current page ", currentPage);
  };

  const onClientJoinedSessionMsg = (
    msg: ServerTypes.ClientJoinedSessionMsg
  ) => {
    if (msg.clientId === ourClientId) {
      setSessionId(msg.sessionId);
      setSessionOwnerId(msg.sessionOwnerId);
      setClientMap(msg.clientMap);
      // Move to session screen once part of a session
      navigateToSessionPage();
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
      // Move to session screen once part of a session
      navigateToSessionPage();
    }
  };

  const onBroadcastFromSessionMsg = (
    msg: ServerTypes.BroadcastFromSessionMsg
  ) => {};

  const onLeaveSession = () => {
    wsClient.leaveSession();
    setSessionId(undefined);
    setCurrentPage(Page.NEW_CLIENT);
  };

  return (
    <IonApp>
      {currentPage != Page.NEW_CLIENT ? null : (
        <NewClientPage
          ourClientId={wsClient.getId()}
          onScanClient={onScanClient}
        ></NewClientPage>
      )}
      {currentPage != Page.SESSION ? null : (
        <SessionPage
          wsClient={wsClient}
          sessionId={sessionId}
          clientMap={clientMap}
          sessionOwnerId={sessionOwnerId}
          onLeaveSession={onLeaveSession}
        ></SessionPage>
      )}
    </IonApp>
  );
};
