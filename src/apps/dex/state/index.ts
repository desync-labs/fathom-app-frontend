import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";

import application from "apps/dex/state/application/reducer";
import { updateVersion } from "apps/dex/state/global/actions";
import user from "apps/dex/state/user/reducer";
import transactions from "apps/dex/state/transactions/reducer";
import swap from "apps/dex/state/swap/reducer";
import mint from "apps/dex/state/mint/reducer";
import lists from "apps/dex/state/lists/reducer";
import burn from "apps/dex/state/burn/reducer";
import multicall from "apps/dex/state/multicall/reducer";

const PERSISTED_KEYS: string[] = ["user", "transactions", "lists"];

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

store.dispatch(updateVersion());

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
