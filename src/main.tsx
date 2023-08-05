import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Chain, EthosConnectProvider } from 'ethos-connect';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EthosConnectProvider
      ethosConfiguration={{
        chain: Chain.SUI_DEVNET,
        network: "https://fullnode.devnet.sui.io/",
        hideEmailSignIn: true // Optional.  Defaults to false
      }}
    >
      <App />
    </EthosConnectProvider>
  </React.StrictMode>,
)
