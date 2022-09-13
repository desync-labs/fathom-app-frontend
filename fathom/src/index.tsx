import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MetaMaskProvider } from './hooks/metamask';
//import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core'
import { provider } from 'web3-core';
import Web3 from 'web3/dist/web3.min.js'

function getLibrary(provider: provider, connector: any) {
  return new Web3(provider)
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetaMaskProvider>
        <App />
      </MetaMaskProvider>
    </Web3ReactProvider>
);