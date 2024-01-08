import { FC, ReactElement } from "react";
import ReactGA from "react-ga";
import { isMobile } from "react-device-detect";
import ThemeProvider, { GlobalStyle } from "apps/charts/Theme";
import LocalStorageContextProvider, {
  Updater as LocalStorageContextUpdater,
} from "apps/charts/contexts/LocalStorage";
import { Updater as TokenDataContextUpdater } from "apps/charts/contexts/TokenData";
import PairDataContextProvider, {
  Updater as PairDataContextUpdater,
} from "apps/charts/contexts/PairData";
import UserContextProvider from "apps/charts/contexts/User";
import GlobalDataContextProvider from "apps/charts/contexts/GlobalData";
import ApplicationContextProvider from "apps/charts/contexts/Application";
import TokenDataContextProvider from "apps/charts/contexts/TokenData";
import App from "apps/charts/App";

// initialize GA
const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;

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

type ContextProvidersProps = {
  children: ReactElement;
};

export const ContextProviders: FC<ContextProvidersProps> = ({ children }) => {
  return (
    <LocalStorageContextProvider>
      <ApplicationContextProvider>
        <TokenDataContextProvider>
          <GlobalDataContextProvider>
            <PairDataContextProvider>
              <UserContextProvider>{children}</UserContextProvider>
            </PairDataContextProvider>
          </GlobalDataContextProvider>
        </TokenDataContextProvider>
      </ApplicationContextProvider>
    </LocalStorageContextProvider>
  );
};

export const Updaters = () => {
  return (
    <>
      <LocalStorageContextUpdater />
      <PairDataContextUpdater />
      <TokenDataContextUpdater />
    </>
  );
};

export default function ChartsIndexComponent() {
  return (
    <>
      <ThemeProvider>
        <>
          <GlobalStyle />
          <App />
        </>
      </ThemeProvider>
    </>
  );
}
