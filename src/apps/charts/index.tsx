import { FC, ReactElement } from "react";
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
