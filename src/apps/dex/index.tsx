import { FC, memo } from "react";
import Blocklist from "apps/dex/components/Blocklist";
import App from "apps/dex/pages/App";
import ApplicationUpdater from "apps/dex/state/application/updater";
import ListsUpdater from "apps/dex/state/lists/updater";
import MulticallUpdater from "apps/dex/state/multicall/updater";
import TransactionUpdater from "apps/dex/state/transactions/updater";

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

export const Updaters = () => {
  return (
    <>
      <ListsUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  );
};

const DexIndexComponent: FC = () => {
  return (
    <>
      <Blocklist>
        <App />
      </Blocklist>
    </>
  );
};

export default memo(DexIndexComponent);
