import React, { useState } from "react";
import QRCode from "react-qr-code";
import { IonButton, IonModal } from "@ionic/react";
import { ScanClientModal } from "../scan-client/ScanClientModal";

export interface HomePageProps {
  ourClientId: string | null;
  onScanClient: (clientId: string | null) => any;
}

export const HomePage: React.FC<HomePageProps> = ({
  ourClientId,
  onScanClient,
}) => {
  const [scanModalOpen, setScanModalOpen] = useState(false);

  const closeScannerModal = () => {
    console.log("Close scanner");
    setScanModalOpen(false);
  };

  const onScan = (result: string | null) => {
    if (result) {
      closeScannerModal();
      onScanClient(result);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        margin: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {ourClientId && (
        <>
          <QRCode key="0" value={ourClientId} />
          <p key="1">Client id {ourClientId}</p>
        </>
      )}
      <IonButton onClick={() => setScanModalOpen(true)}>Open Scanner</IonButton>
      <IonModal isOpen={scanModalOpen} onDidDismiss={closeScannerModal}>
        <ScanClientModal
          onScanClient={onScan}
          onCloseClick={closeScannerModal}
        />
      </IonModal>
    </div>
  );
};
