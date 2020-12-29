import { IonIcon } from "@ionic/react";
import React from "react";
import QrReader from "react-qr-reader";
import { close } from 'ionicons/icons'

export interface ScanClientModalProps {
    onScanClient: (clientId: string | null) => void;
    onCloseClick: () => void;
}

export class ScanClientModal extends React.Component<ScanClientModalProps, { result: string }> {

    handleError = () => {

    }

    render() {
        return <div>
            <div style={{display: "flex"}}>
                <h1>Scan another device with QRSync open</h1>
                <IonIcon icon={close} onClick={this.props.onCloseClick} style={{width: 40, height: 40, margin: 40}}></IonIcon>
            </div>
            
            <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.props.onScanClient}
                style={{ width: '60vmin', maxWidth: '250px', margin: 'auto', position: 'relative', marginTop: 30 }}
            ></QrReader>
        </div>;
    }

}