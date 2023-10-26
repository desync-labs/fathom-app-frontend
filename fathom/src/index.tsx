import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import dotenv from "dotenv";
import { ConnectorProvider } from "context/connector";
import { Web3ReactProvider } from "@web3-react/core";
import Xdc3 from "xdc3";
import { TransactionAndAlertContext } from "context/transactionAndAlertProvider";

dotenv.config();

function getLibrary(provider: any) {
  console.log("getLibrary", provider);
  return new Xdc3(provider);
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <ConnectorProvider>
      <TransactionAndAlertContext>
        <App />
      </TransactionAndAlertContext>
    </ConnectorProvider>
  </Web3ReactProvider>
);
