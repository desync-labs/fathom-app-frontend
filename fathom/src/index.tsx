import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MetaMaskProvider } from "context/metamask";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3/dist/web3.min.js";
import { XDC_CHAIN_IDS } from "connectors/networks";
import Xdc3 from "xdc3";


async function getLibrary(provider: any) {
  const instance = new Web3(provider);
  const chainId = await instance.eth.getChainId();

  if (XDC_CHAIN_IDS.includes(chainId)) {
    return new Xdc3(provider);
  }

  return instance;
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <MetaMaskProvider>
      <App />
    </MetaMaskProvider>
  </Web3ReactProvider>
);
