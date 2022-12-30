import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  ConnectorProvider,
} from "context/connector";
import { Web3ReactProvider } from "@web3-react/core";
import Xdc3 from "xdc3";


async function getLibrary(provider: any) {
  return new Xdc3(provider);
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <ConnectorProvider>
      <App />
    </ConnectorProvider>
  </Web3ReactProvider>
);
