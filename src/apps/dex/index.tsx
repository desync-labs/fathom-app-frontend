import { FC, memo } from "react";
import "inter-ui";

import { isMobile } from "react-device-detect";
import ReactGA from "react-ga";
import Blocklist from "apps/dex/components/Blocklist";
import "apps/dex/i18n";
import App from "apps/dex/pages/App";
import ApplicationUpdater from "apps/dex/state/application/updater";
import ListsUpdater from "apps/dex/state/lists/updater";
import MulticallUpdater from "apps/dex/state/multicall/updater";
import TransactionUpdater from "apps/dex/state/transactions/updater";
import ThemeProvider, {
  FixedGlobalStyle,
  ThemedGlobalStyle,
} from "apps/dex/theme";
import { DexViewProps } from "components/Dashboard/DexView";
import { DexSharedProvider } from "context/dexShared";

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

const DexIndexComponent: FC<DexViewProps> = ({ openConnectorMenu }) => {
  return (
    <>
      <FixedGlobalStyle />
      <Blocklist>
        <Updaters />
        <ThemeProvider>
          <>
            <ThemedGlobalStyle />
            <DexSharedProvider openConnectorMenu={openConnectorMenu}>
              <App />
            </DexSharedProvider>
          </>
        </ThemeProvider>
      </Blocklist>
    </>
  );
};

export default memo(DexIndexComponent);
