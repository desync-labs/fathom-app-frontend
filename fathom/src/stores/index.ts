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
import IPoolService from "../services/interfaces/IPoolService";
import IPositionService from "../services/interfaces/IPositionService";
import IStableSwapService from "../services/interfaces/IStableSwapService";
import IActiveWeb3TransactionsService from "../services/interfaces/IActiveWeb3TransactionsService";

export class RootStore {
  /**
   * Stores
   */
  poolStore: PoolStore;
  authStore: AuthStore;
  positionStore: PositionStore;
  stableSwapStore: StableSwapStore;
  alertStore: AlertStore;
  transactionStore: ActiveWeb3Transactions;
  /**
   * Services
   */
  poolService: IPoolService;
  positionService: IPositionService;
  stableSwapService: IStableSwapService;
  activeWeb3TransactionService: IActiveWeb3TransactionsService;

  chainId: number = 1337;

  constructor() {
    this.poolService = new PoolService();
    this.positionService = new PositionService();
    this.stableSwapService = new StableSwapService();
    this.activeWeb3TransactionService = new ActiveWeb3TransactionsService();

    this.authStore = new AuthStore(this);
    this.poolStore = new PoolStore(this, this.poolService);
    this.positionStore = new PositionStore(this, this.positionService);
    this.stableSwapStore = new StableSwapStore(this, this.stableSwapService);
    this.alertStore = new AlertStore(this);
    this.transactionStore = new ActiveWeb3Transactions(
      this,
      this.activeWeb3TransactionService
    );
  }

  setChainId(chainId: number) {
    this.chainId = chainId;

    [
      "poolService",
      "positionService",
      "stableSwapService",
      "activeWeb3TransactionService",
    ].map((serviceName) =>{
      console.log(`Setting chainid ${chainId} for ${serviceName}`)
      // @ts-ignore
      this[serviceName].setChainId(chainId)
      }
    );
  }
}

const StoresContext = React.createContext(new RootStore());

// this will be the function available for the app to connect to the stores
export const useStores = () => React.useContext(StoresContext);
