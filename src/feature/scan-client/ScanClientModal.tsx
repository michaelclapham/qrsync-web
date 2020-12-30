import { IonIcon, IonInput, IonItem } from "@ionic/react";
import React from "react";
import QrReader from "react-qr-reader";
import { close } from 'ionicons/icons'

export interface ScanClientModalProps {
    onScanClient: (clientId: string | null) => void;
    onCloseClick: () => void;
}

export class ScanClientModal extends React.Component<ScanClientModalProps, { result: string, manualId: string }> {

    state = {
        result: "",
        manualId: ""
    };

    handleError = () => {

    }

    handleScan = (data: string | null) => {
        this.setState({ result: "" + data });
        this.props.onScanClient(data);
    }

    setManualId = (text: string) => {
        this.setState({ manualId: text });
    }

    render() {
        return <div>
            <div style={{ display: "flex" }}>
                <h1>Scan another device with QRSync open</h1>
                <IonIcon icon={close} onClick={this.props.onCloseClick} style={{ width: 40, height: 40, margin: 40 }}></IonIcon>
            </div>
            <IonItem>
                <IonInput value={this.state.manualId} placeholder="Enter Manual Id" onIonChange={e => this.setManualId(e.detail.value!)}></IonInput>
                <button onClick={() => this.props.onScanClient(this.state.manualId)}>Add Client</button>
            </IonItem>
            <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '60vmin', maxWidth: '250px', margin: 'auto', position: 'relative', marginTop: 30 }}
            ></QrReader>
        </div>;
    }

}