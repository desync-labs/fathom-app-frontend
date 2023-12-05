import { createWeb3ReactRoot } from "@web3-react/core";
import "inter-ui";

import { isMobile } from "react-device-detect";
import ReactGA from "react-ga";
import { Provider } from "react-redux";
import Blocklist from "apps/dex/components/Blocklist";
import { NetworkContextName } from "apps/dex/constants";
import "apps/dex/i18n";
import App from "apps/dex/pages/App";
import store from "apps/dex/state";
import ApplicationUpdater from "apps/dex/state/application/updater";
import ListsUpdater from "apps/dex/state/lists/updater";
import MulticallUpdater from "apps/dex/state/multicall/updater";
import TransactionUpdater from "apps/dex/state/transactions/updater";
import ThemeProvider, {
  FixedGlobalStyle,
  ThemedGlobalStyle,
} from "apps/dex/theme";
import { getLibrary } from "../../index";
import { memo, Suspense } from "react";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

const GOOGLE_ANALYTICS_ID: string | undefined =
  process.env.REACT_APP_GOOGLE_ANALYTICS_ID;
if (typeof GOOGLE_ANALYTICS_ID === "string") {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
    gaOptions: {
      storage: "none",
      storeGac: false,
    },
  });
  ReactGA.set({
    anonymizeIp: true,
    customBrowserType: !isMobile
      ? "desktop"
      : "web3" in window || "ethereum" in window
      ? "mobileWeb3"
      : "mobileRegular",
  });
} else {
  ReactGA.initialize("test", { testMode: true, debug: true });
}

window.addEventListener("error", (error) => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true,
  });
});

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  );
}

const DexIndexComponent = () => {
  return (
    <Suspense fallback={null}>
      <FixedGlobalStyle />
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Blocklist>
          <Provider store={store}>
            <Updaters />
            <ThemeProvider>
              <ThemedGlobalStyle />
              <App />
            </ThemeProvider>
          </Provider>
        </Blocklist>
      </Web3ProviderNetwork>
    </Suspense>
  );
};

export default memo(DexIndexComponent);
