import React from 'react';
import logo_fg from './logo_fg1.svg';
import logo_bg from './sync_arrows1.svg';
import './App.css';
import QrReader from 'react-qr-reader';
import { Client } from './Client';

interface AppState {
  result: string;
  goToURL: string;
  clientMap: Record<string, Client>;
}

export default class App extends React.Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      result: "",
      goToURL: "",
      clientMap: {}
    };
  }

  handleScan = (result: string | null) => {
    if (result) {
      this.setState({ result: result });
      if (!this.state.clientMap[result]) {
        const clientId = result;
        fetch(`https://jungleapp.co.uk:4001/api/client/${clientId}`).then((res) => {
          res.json().then((newClient: Client) => {
            const newClientMap = { ...this.state.clientMap, [clientId]: newClient };
            this.setState({ clientMap: newClientMap });
          });
        });
      }
    } else {
      this.setState({ result: "No Result" });
    }
  }

  handleError = () => {

  }

  handleUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {

  };

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
          style={{ width: '60vmin', maxWidth: '250px', margin: 'auto', position: 'relative', marginTop: 30 }}
        ></QrReader>
        <p>Result: {this.state.result}</p>
        <form onSubmit={this.handleUrlSubmit}>
          <label>
            Go To URL:
          <textarea value={this.state.goToURL} onChange={(event) => this.setState({ goToURL: event.target.value })} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <h2>Client List:</h2>
        <ul>
          {
            Object.keys(this.state.clientMap).map((clientId) => <li>
              <span>Id: {clientId}</span>
              <span>Name: {this.state.clientMap[clientId].name}</span>
            </li>)
          }
        </ul>
      </div>
    );
  }
}