import IPoolService from "fathom-contracts-helper/src/interfaces/services/IPoolService";
import IPositionService from "fathom-contracts-helper/src/interfaces/services/IPositionService";
import IProposalService from "fathom-contracts-helper/src/interfaces/services/IProposalService";
import IStableSwapService from "fathom-contracts-helper/src/interfaces/services/IStableSwapService";
import IStakingService from "fathom-contracts-helper/src/interfaces/services/IStakingService";

import {
  PoolService,
  PositionService,
  ProposalService,
  StableSwapService,
  StakingService,
} from "fathom-contracts-helper";

import { DEFAULT_CHAIN_ID } from "helpers/Constants";
import Xdc3 from "xdc3";

export class RootStore {
  /*
   * Services
   */
  poolService: IPoolService;
  positionService: IPositionService;
  stableSwapService: IStableSwapService;
  proposalService: IProposalService;
  stakingService: IStakingService;

  chainId = DEFAULT_CHAIN_ID;

  provider: Xdc3;

  serviceList = [
    "poolService",
    "positionService",
    "proposalService",
    "stableSwapService",
    "stakingService",
  ];

  constructor(provider: Xdc3) {
    this.poolService = new PoolService(provider, this.chainId);
    this.positionService = new PositionService(provider, this.chainId);
    this.proposalService = new ProposalService(provider, this.chainId);
    this.stakingService = new StakingService(provider, this.chainId);
    this.stableSwapService = new StableSwapService(provider, this.chainId);

    this.provider = provider;
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
    this.serviceList.forEach((serviceName) => {
      console.log(`Setting chain ID ${chainId} for ${serviceName}`);
      // @ts-ignore
      this[serviceName].setChainId(chainId);
    });
  }

  setProvider(provider: Xdc3) {
    this.provider = provider;
    this.serviceList.forEach((serviceName) => {
      // @ts-ignore
      this[serviceName].setProvider(provider);
    });
  }
}
