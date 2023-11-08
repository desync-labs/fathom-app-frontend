import {
  PoolService,
  PositionService,
  ProposalService,
  StableSwapService,
  StakingService,
  IPoolService,
  IPositionService,
  IProposalService,
  IStableSwapService,
  IStakingService,
} from "fathom-contracts-helper";

import { DEFAULT_CHAIN_ID } from "helpers/Constants";
import Xdc3 from "xdc3";
import { getDefaultProvider } from "utils/defaultProvider";
import { Web3Utils } from "fathom-contracts-helper";

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

  constructor() {
    const provider = getDefaultProvider();
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
    /**
     * When change provider need to reset contracts cache.
     */
    Web3Utils.clearContracts();
    this.serviceList.forEach((serviceName) => {
      // @ts-ignore
      this[serviceName].setProvider(provider);
    });
  }
}
