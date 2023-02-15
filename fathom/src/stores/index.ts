// src/stores/index.js
import React from "react";
import PoolService from "services/PoolService";
import PositionService from "services/PositionService";
import StableSwapService from "services/StableSwapService";
import AlertStore from "stores/alert.stores";
import StableSwapStore from "stores/stableswap.stores";
import ActiveWeb3Transactions from "stores/transaction.store";
import IPoolService from "services/interfaces/IPoolService";
import IPositionService from "services/interfaces/IPositionService";
import IStableSwapService from "services/interfaces/IStableSwapService";
import ProposalStore from "stores/proposal.store";
import IProposalService from "services/interfaces/IProposalService";
import ProposalService from "services/ProposalService";
import StakingStore from "stores/staking.store";
import StakingService from "services/StakingService";
import IStakingService from "services/interfaces/IStakingService";
import { Constants } from "helpers/Constants";

export class RootStore {
  /**
   * Stores
   */
  alertStore: AlertStore;
  transactionStore: ActiveWeb3Transactions;

  stableSwapStore: StableSwapStore;
  proposalStore: ProposalStore;
  stakingStore: StakingStore;
  /**
   * Services
   */
  poolService: IPoolService;
  positionService: IPositionService;
  stableSwapService: IStableSwapService;
  proposalService: IProposalService;

  stakingService: IStakingService;

  chainId: number = Constants.DEFAULT_CHAIN_ID;

  constructor() {

    this.alertStore = new AlertStore();

    this.transactionStore = new ActiveWeb3Transactions(
      this,
    );


    this.poolService = new PoolService(this.alertStore);
    this.positionService = new PositionService(this.alertStore, this.transactionStore);

    this.stableSwapService = new StableSwapService(this.transactionStore);
    this.proposalService = new ProposalService(this.transactionStore);
    this.stakingService = new StakingService(this.transactionStore);

    this.stableSwapStore = new StableSwapStore(this, this.stableSwapService);
    this.proposalStore = new ProposalStore(this, this.proposalService);
    this.stakingStore = new StakingStore(this, this.stakingService);
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
