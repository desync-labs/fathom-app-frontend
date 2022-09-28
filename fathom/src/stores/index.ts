// src/stores/index.js

import React from "react";
import ActiveWeb3TransactionsService from "../services/ActiveWeb3TransactionsService";
import PoolService from "../services/PoolService";
import PositionService from "../services/PositionService";
import StableSwapService from "../services/StableSwapService";
import AlertStore from "./alert.stores";
import AuthStore from "./auth.store";
import PoolStore from "./pool.store";
import PositionStore from "./positions.store";
import StableSwapStore from "./stableswap.stores";
import ActiveWeb3Transactions from "./transaction.store";

export class RootStore {
  poolStore: PoolStore;
  authStore: AuthStore;
  positionStore: PositionStore;
  stableSwapStore: StableSwapStore;
  alertStore: AlertStore;
  transactionStore: ActiveWeb3Transactions;


  constructor() {
    this.authStore = new AuthStore(this)
    this.poolStore = new PoolStore(this,new PoolService())
    this.positionStore = new PositionStore(this, new PositionService())
    this.stableSwapStore = new StableSwapStore(this, new StableSwapService())
    this.alertStore = new AlertStore(this);
    this.transactionStore = new ActiveWeb3Transactions(this, new ActiveWeb3TransactionsService())
  }
 

}

const StoresContext = React.createContext(new RootStore());

// this will be the function available for the app to connect to the stores
export const useStores = () => React.useContext(StoresContext);
