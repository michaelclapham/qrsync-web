import React from "react";
import QRCode from "react-qr-code";
import { IonButton, IonModal } from "@ionic/react";
import { ScanClientModal } from "../scan-client/ScanClientModal";

export interface HomePageProps {
    ourClientId: string | null;
    onScanClient: (clientId: string | null) => any;
}

export class HomePage extends React.Component<HomePageProps, { scanModalOpen: boolean }> {

    state = {} as any;

    closeScannerModal = () => this.setState({ scanModalOpen: false });

    onScan = (result: string | null) => {
        if (result) {
            this.closeScannerModal();
            this.props.onScanClient(result);
        }
    }

    render() {
        return <div>
            {this.props.ourClientId ? [
                <QRCode value={this.props.ourClientId}></QRCode>,
                <p>Client id {this.props.ourClientId}</p>
            ] : null}
            <IonButton onClick={() => this.setState({ scanModalOpen: true })}>
                Open Scanner
            </IonButton>
            <IonModal isOpen={this.state.scanModalOpen} onDidDismiss={this.closeScannerModal}>
                <ScanClientModal onScanClient={this.onScan} onCloseClick={this.closeScannerModal}></ScanClientModal>
            </IonModal>
        </div>
    }

}