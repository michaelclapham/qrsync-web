import React, { useState } from "react";
import "./App.css";
import { IonApp, IonPage, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { HomePage } from "./feature/home/HomePage";
import { WSClient } from "./WSClient";
import { ServerTypes } from "./ServerTypes";
import { SessionPage } from "./feature/session/SessionPage";
import { NavigateOnStateChange } from "./NavigateOnStateChange";
import { SessionMessage, mapSessionMsg } from "./feature/session/SessionMessage";

// let wsUrl = "wss://qrsync.org/api/v1/ws";
let wsUrl = "ws://localhost:4010/api/v1/ws";
const wsClient = new WSClient(wsUrl);

const SESSION_MESSAGES_KEY = "sessionMessages";

function getSessionStorageJSONArray(key: string, defValue: any[]): any[] {
  const item = sessionStorage.getItem(key);
  try {
    if (item != null) {
      return JSON.parse(item)
    } else {
      return defValue;
    }
  } catch (ex) {
    return defValue;
  }
}

export const App: React.FC = () => {
  const [ourClientId, setOurClientId] = useState<string>();
  const [sessionOwnerId, setSessionOwnerId] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();
  const [clientMap, setClientMap] = useState<
    Record<string, ServerTypes.Client>
  >({});
  let clientToAddOnSessionCreation: string | undefined;
  const prevSavedSessionMessages = getSessionStorageJSONArray(SESSION_MESSAGES_KEY, []);
  const [sessionMessages, setSessionMessages] = useState<SessionMessage[]>(prevSavedSessionMessages);

  // State used to navigate to route via a server sent event (not user link click)
  const [changeToRoute, setChangeToRoute] = useState<string | undefined>();

  const onClientJoinedSessionMsg = (
    msg: ServerTypes.ClientJoinedSessionMsg
  ) => {
    setSessionId(msg.sessionId);
    setSessionOwnerId(msg.sessionOwnerId);
    setClientMap(msg.clientMap);
    setChangeToRoute("/session");
    if (clientToAddOnSessionCreation) {
      wsClient.sendMessage({
        type: "AddClientToSession",
        sessionId: msg.sessionId,
        addClientId: clientToAddOnSessionCreation
      });
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
  wsClient.addDisconnectHandler(() => {
    sessionStorage.removeItem(SESSION_MESSAGES_KEY);
  });

  const onScanClient = (clientId: string | null) => {
    if (clientId) {
      console.log("Client id scanned ", clientId);
      if (!sessionId) {
        wsClient.sendMessage({
          type: "CreateSession",
        });
        clientToAddOnSessionCreation = clientId;
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
    serverMsg: ServerTypes.BroadcastFromSessionMsg
  ) => {
    const newMsg = mapSessionMsg(serverMsg);
    const newMsgs = sessionMessages.concat([newMsg]);
    setSessionMessages(newMsgs);

    // Save session messages to session storage
    sessionStorage.setItem(SESSION_MESSAGES_KEY, JSON.stringify(newMsgs));
  };

  const onLeaveSession = () => {
    wsClient.leaveSession();
    setSessionId(undefined);
    setChangeToRoute("/index.html");
  };

  const onShare = (msg: SessionMessage) => {
    let msgWithSender: SessionMessage = {
      ...msg,
      senderId: wsClient.getId() ?? "",
      senderName: wsClient.getName(),
    }
    let serverMsg: ServerTypes.BroadcastToSessionMsg = {
      type: "BroadcastToSession",
      payload: JSON.stringify(msgWithSender)
    };
    wsClient.sendMessage(serverMsg);
  }

  return (
    <IonApp>
      <IonReactRouter>
        {/*
          Way to change react router route based on websocket events without
          having to create second state wrapper inside of IonReactRouter
        */}
        <NavigateOnStateChange route={changeToRoute} onNavigate={() => setChangeToRoute(undefined)}/>
        <IonRouterOutlet>
          <Route path="/index.html">
            <HomePage
              ourClientId={wsClient.getId()}
              onScanClient={onScanClient}
            ></HomePage>
          </Route>
          <Route path="/session">
            <SessionPage
              sessionMessages={sessionMessages}
              userIsSessionOwner={wsClient.getId() === sessionOwnerId}
              sessionId={sessionId}
              clientMap={clientMap}
              sessionOwnerId={sessionOwnerId}
              onShare={onShare}
              onLeaveSession={onLeaveSession}
            ></SessionPage>
          </Route>
          <Route path="/test">
            <IonPage>
              <h1>Just a quick test...</h1>
            </IonPage>
          </Route>
          <Redirect exact from="/" to="/index.html" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};
