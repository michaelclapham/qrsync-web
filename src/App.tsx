import React from 'react';
import logo_fg from './logo_fg1.svg';
import logo_bg from './sync_arrows1.svg';
import './App.css';
import QrReader from 'react-qr-reader';

export default class App extends React.Component<{}, { result: string }> {

  state = {} as any;

  handleScan = (result: string | null) => {
    if (result) {
      this.setState({ result: result });
    } else {
      this.setState({ result: "No Result"});
    }
  }

  handleError = () => {

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="app-title-container">
            <div className="app-logo-container">
              <img src={logo_fg} className="app-logo-fg" alt="logo" />
              <img src={logo_bg} className="app-logo-bg" alt="logo-bg" />
            </div>
            <h1 className="app-title">QR Sync</h1>
          </div>
        </header>
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '60vmin', margin: 'auto', position: 'relative', marginTop: 30 }}
        ></QrReader>
        <p>Result: {this.state.result}</p>
      </div>
    );
  }
}