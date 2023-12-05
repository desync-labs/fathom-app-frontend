import ReactDOM from "react-dom";
import App from "./App";
import dotenv from "dotenv";
import { ConnectorProvider } from "context/connector";
import { Web3ReactProvider } from "@web3-react/core";
import { AlertAndTransactionProvider } from "context/alertAndTransaction";
import { ServicesProvider } from "./context/services";
import { Web3Provider } from "@ethersproject/providers";

dotenv.config();

export function getLibrary(provider: any): Web3Provider {
  console.log("getLibrary", provider);
  return new Web3Provider(provider);
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <AlertAndTransactionProvider>
      <ServicesProvider>
        <ConnectorProvider>
          <App />
        </ConnectorProvider>
      </ServicesProvider>
    </AlertAndTransactionProvider>
  </Web3ReactProvider>,
  document.getElementById("root")
);
