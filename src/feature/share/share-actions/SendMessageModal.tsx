import { IonButton, IonInput } from "@ionic/react";
import React, { useState } from "react";
import { ShareModalProps } from "./ShareModal";
import { SessionMessage } from "../../session/SessionMessage";

export const SendMessageModal: React.FC<ShareModalProps> = ({
  onShare,
  closeModal,
}) => {

  const [text, setText] = useState("");

  const sendClick = () => {
    let sessionMsg: SessionMessage = {
      type: "TEXT_MESSAGE",
      text: text,
    };
    onShare(sessionMsg);
    closeModal();
  };

  return (
      <div style={{display: "flex", flexDirection: "column"}}>
        <h1>Send message</h1>
        <p>Send message to all clients in this session.</p>
        <IonInput
          value={text}
          placeholder="Enter message to send"
          onIonChange={(e) => setText(e.detail.value!)}
        ></IonInput>
        <IonButton onClick={() => sendClick()}>Send</IonButton>
      </div>
    );
}
