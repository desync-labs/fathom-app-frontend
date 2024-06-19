import { enableMapSet } from "immer";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

import {
  AnalyticsSlice,
  createAnalyticsSlice,
} from "apps/lending/store/analyticsSlice";
import { createLayoutSlice, LayoutSlice } from "apps/lending/store/layoutSlice";
import { createPoolSlice, PoolSlice } from "apps/lending/store/poolSlice";
import {
  createIncentiveSlice,
  IncentiveSlice,
} from "apps/lending/store/incentiveSlice";
import {
  createProtocolDataSlice,
  ProtocolDataSlice,
} from "apps/lending/store/protocolDataSlice";
import {
  createTransactionsSlice,
  TransactionsSlice,
} from "apps/lending/store/transactionsSlice";
import { createSingletonSubscriber } from "apps/lending/store/utils/createSingletonSubscriber";
import { createWalletSlice, WalletSlice } from "apps/lending/store/walletSlice";

enableMapSet();

export type RootStore = ProtocolDataSlice &
  IncentiveSlice &
  WalletSlice &
  PoolSlice &
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
        ...createAnalyticsSlice(...args),
        ...createTransactionsSlice(...args),
        ...createLayoutSlice(...args),
      };
    })
  )
);

export const usePoolDataSubscription = createSingletonSubscriber(() => {
  console.log("Fetch Pool Data");
  return useRootStore.getState().refreshPoolData();
}, 60000);

export const useIncentiveDataSubscription = createSingletonSubscriber(() => {
  console.log("Fetch Incentives Data");
  return useRootStore.getState().refreshIncentiveData();
}, 60000);
