import React from 'react';
import logo_fg from './logo_fg1.svg';
import logo_bg from './sync_arrows1.svg';
import './App.css';

const App: React.FC = () => {
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
    </div>
  );
}

export default App;
