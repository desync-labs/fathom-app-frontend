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
  Web3Utils,
} from "fathom-sdk";

import { DEFAULT_CHAIN_ID } from "helpers/Constants";
import { getDefaultProvider } from "utils/defaultProvider";
import { ProviderOrSigner } from "connectors/networks";
import { JsonRpcProvider } from "@ethersproject/providers";

export class RootService {
  /*
   * Services
   */
  poolService: IPoolService;
  positionService: IPositionService;
  stableSwapService: IStableSwapService;
  proposalService: IProposalService;
  stakingService: IStakingService;

  chainId = DEFAULT_CHAIN_ID;

  provider: ProviderOrSigner;

  serviceList: {
    [key: string]:
      | IPoolService
      | IPositionService
      | IStableSwapService
      | IProposalService
      | IStakingService;
  };

  constructor() {
    this.provider = getDefaultProvider();

    this.poolService = new PoolService(this.provider, this.chainId);
    this.positionService = new PositionService(this.provider, this.chainId);
    this.proposalService = new ProposalService(this.provider, this.chainId);
    this.stakingService = new StakingService(this.provider, this.chainId);
    this.stableSwapService = new StableSwapService(this.provider, this.chainId);

    this.serviceList = {
      poolService: this.poolService,
      positionService: this.positionService,
      proposalService: this.proposalService,
      stakingService: this.stakingService,
      stableSwapService: this.stableSwapService,
    };
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
    Object.values(this.serviceList).forEach((service) => {
      service.setChainId(chainId);
    });
  }

  setProvider(provider: ProviderOrSigner) {
    if (
      provider instanceof JsonRpcProvider &&
      this.provider instanceof JsonRpcProvider
    ) {
      const url = provider.connection.url;
      const currentUrl = this.provider.connection.url;

      if (url === currentUrl) {
        return;
      }
    }
    this.provider = provider;
    /**
     * When change provider need to reset contracts cache.
     */
    Web3Utils.clearContracts();
    Object.values(this.serviceList).forEach((service) => {
      service.setProvider(provider);
    });
  }
}
