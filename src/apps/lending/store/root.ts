import { enableMapSet } from "immer";
import { CustomMarket } from "apps/lending/ui-config/marketsConfig";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

import {
  AnalyticsSlice,
  createAnalyticsSlice,
} from "apps/lending/store/analyticsSlice";
import {
  createIncentiveSlice,
  IncentiveSlice,
} from "apps/lending/store/incentiveSlice";
import { createLayoutSlice, LayoutSlice } from "apps/lending/store/layoutSlice";
import { createPoolSlice, PoolSlice } from "apps/lending/store/poolSlice";
import {
  createProtocolDataSlice,
  ProtocolDataSlice,
} from "apps/lending/store/protocolDataSlice";
import {
  createTransactionsSlice,
  TransactionsSlice,
} from "apps/lending/store/transactionsSlice";
import { createSingletonSubscriber } from "apps/lending/store/utils/createSingletonSubscriber";
import { getQueryParameter } from "apps/lending/store/utils/queryParams";
import {
  createWalletDomainsSlice,
  WalletDomainsSlice,
} from "apps/lending/store/walletDomains";
import { createWalletSlice, WalletSlice } from "apps/lending/store/walletSlice";

enableMapSet();

export type RootStore = ProtocolDataSlice &
  WalletSlice &
  PoolSlice &
  IncentiveSlice &
  WalletDomainsSlice &
  AnalyticsSlice &
  TransactionsSlice &
  LayoutSlice;

export const useRootStore = create<RootStore>()(
  subscribeWithSelector(
    devtools((...args) => {
      return {
        ...createProtocolDataSlice(...args),
        ...createWalletSlice(...args),
        ...createPoolSlice(...args),
        ...createIncentiveSlice(...args),
        ...createWalletDomainsSlice(...args),
        ...createAnalyticsSlice(...args),
        ...createTransactionsSlice(...args),
        ...createLayoutSlice(...args),
      };
    })
  )
);

// hydrate state from localeStorage to not break on ssr issues
if (typeof document !== "undefined") {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      const selectedMarket =
        getQueryParameter("marketName") ||
        localStorage.getItem("selectedMarket");

      if (selectedMarket) {
        const currentMarket = useRootStore.getState().currentMarket;
        const setCurrentMarket = useRootStore.getState().setCurrentMarket;
        if (selectedMarket !== currentMarket) {
          setCurrentMarket(selectedMarket as CustomMarket, true);
        }
      }
    }
  };
}

export const usePoolDataSubscription = createSingletonSubscriber(() => {
  console.log("Fetch Pool Data");
  return useRootStore.getState().refreshPoolData();
}, 60000);

export const usePoolDataV3Subscription = createSingletonSubscriber(() => {
  console.log("Fetch Pool V3 Data");
  return useRootStore.getState().refreshPoolV3Data();
}, 60000);

export const useIncentiveDataSubscription = createSingletonSubscriber(() => {
  console.log("Fetch Incentive Data");
  return useRootStore.getState().refreshIncentiveData();
}, 60000);

useRootStore.subscribe(
  (state) => state.account,
  (account) => {
    if (account) {
      useRootStore.getState().fetchConnectedWalletDomains();
    } else {
      useRootStore.getState().clearWalletDomains();
    }
  },
  { fireImmediately: true }
);
