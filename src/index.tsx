import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import dotenv from "dotenv";
import { ConnectorProvider } from "context/connector";
import { Web3ReactProvider } from "@web3-react/core";
import { AlertAndTransactionProvider } from "context/alertAndTransaction";
import { ServicesProvider } from "./context/services";
import { Web3Provider } from "@ethersproject/providers";

dotenv.config();

function getLibrary(provider: any): Web3Provider {
  console.log("getLibrary", provider);
  return new Web3Provider(provider);
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <AlertAndTransactionProvider>
      <ServicesProvider>
        <ConnectorProvider>
          <App />
        </ConnectorProvider>
      </ServicesProvider>
    </AlertAndTransactionProvider>
  </Web3ReactProvider>
);
