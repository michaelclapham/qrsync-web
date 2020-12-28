import { IonIcon } from "@ionic/react";
import React from "react";
import QrReader from "react-qr-reader";
import { Client } from "../../Client";
import { close } from 'ionicons/icons'

export interface ScanPeerModalProps {
    onScanPeer: (client: Client) => void;
    onCloseClick: () => void;
}

export class ScanPeerModal extends React.Component<ScanPeerModalProps, { result: string }> {

    handleScan = async (result: string | null) => {
        if (result) {
            const res = await fetch(`https://jungleapp.co.uk:4001/api/client/${result}`);
            const newClient = await res.json();
            this.props.onScanPeer(newClient);
        }
    }

    handleError = () => {

    }

    render() {
        return <div>
            <div style={{display: "flex"}}>
                <h1>Scan another device with QRSync open</h1>
                <IonIcon icon={close}></IonIcon>
            </div>
            
            <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '60vmin', maxWidth: '250px', margin: 'auto', position: 'relative', marginTop: 30 }}
            ></QrReader>
        </div>;
    }

}