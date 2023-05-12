// src/stores/index.js
import React from "react";
import PoolService from "services/PoolService";
import PositionService from "services/PositionService";
import StableSwapService from "services/StableSwapService";
import AlertStore from "stores/alert.stores";
import ActiveWeb3Transactions from "stores/transaction.store";
import IPoolService from "services/interfaces/IPoolService";
import IPositionService from "services/interfaces/IPositionService";
import IStableSwapService from "services/interfaces/IStableSwapService";
import IProposalService from "services/interfaces/IProposalService";
import ProposalService from "services/ProposalService";
import StakingService from "services/StakingService";
import IStakingService from "services/interfaces/IStakingService";
import ICentralizedPriceFeedService from "services/interfaces/ICentralizedPriceFeedService";
import CentralizedPriceFeedService from "services/CentralizedPriceFeedService";

import {
  DEFAULT_CHAIN_ID
} from "helpers/Constants";

export class RootStore {
  /**
   * Stores
   */
  alertStore: AlertStore;
  transactionStore: ActiveWeb3Transactions;

  /**
   * Services
   */
  poolService: IPoolService;
  positionService: IPositionService;
  stableSwapService: IStableSwapService;
  proposalService: IProposalService;
  stakingService: IStakingService;
  centralizedOracleService: ICentralizedPriceFeedService;

  chainId: number = DEFAULT_CHAIN_ID;

  constructor() {

    this.alertStore = new AlertStore();

    this.transactionStore = new ActiveWeb3Transactions(
      this,
    );

    this.poolService = new PoolService(this.alertStore);

    this.positionService = new PositionService(this.alertStore, this.transactionStore);
    this.proposalService = new ProposalService(this.alertStore, this.transactionStore);
    this.stakingService = new StakingService(this.alertStore, this.transactionStore);

    this.stableSwapService = new StableSwapService(this.alertStore, this.transactionStore);

    this.centralizedOracleService = new CentralizedPriceFeedService();
  }

  setChainId(chainId: number) {
    this.chainId = chainId;

    [
      "poolService",
      "positionService",
      "stableSwapService",
      "proposalService",
      "stakingService",
    ].forEach((serviceName) => {
      console.log(`Setting chain ID ${chainId} for ${serviceName}`);
      // @ts-ignore
      this[serviceName].setChainId(chainId);
    });
  }
}

const StoresContext = React.createContext(new RootStore());

// this will be the function available for the app to connect to the stores
export const useStores = () => React.useContext(StoresContext);
