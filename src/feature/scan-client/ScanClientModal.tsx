import { IonIcon, IonInput, IonItem } from "@ionic/react";
import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { close } from "ionicons/icons";

interface ScanClientModalProps {
  onScanClient: (clientId: string | null) => void;
  onCloseClick: () => void;
}

export const ScanClientModal: React.FC<ScanClientModalProps> = ({
  onScanClient,
  onCloseClick,
}) => {
  const [result, setResult] = useState("");
  const [manualId, setManualId] = useState("");

  const handleScan = (data: string | null) => {
    setResult(data || "");
    onScanClient(data);
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h1>Scan another device with QRSync open</h1>
        <IonIcon
          icon={close}
          onClick={onCloseClick}
          style={{ width: 40, height: 40, margin: 40 }}
        ></IonIcon>
      </div>
      <IonItem>
        <IonInput
          value={manualId}
          placeholder="Enter Manual Id"
          onIonChange={(e) => setManualId(e.detail.value!)}
        ></IonInput>
        <button onClick={() => onScanClient(manualId)}>Add Client</button>
      </IonItem>
      <QrScanner
        scanDelay={100}
        tracker={true}
        deviceId=""
        hideCount={true}
        onError={(error) => console.log("QrScanner error ", error?.message)}
        onDecode={handleScan}
      />
    </div>
  );
};
