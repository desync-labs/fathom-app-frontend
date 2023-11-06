import PoolService from "services/PoolService";
import PositionService from "services/PositionService";
import StableSwapService from "services/StableSwapService";
import IPoolService from "services/interfaces/services/IPoolService";
import IPositionService from "services/interfaces/services/IPositionService";
import IStableSwapService from "services/interfaces/services/IStableSwapService";
import IProposalService from "services/interfaces/services/IProposalService";
import ProposalService from "services/ProposalService";
import StakingService from "services/StakingService";
import IStakingService from "services/interfaces/services/IStakingService";

import {
  DEFAULT_CHAIN_ID
} from "helpers/Constants";
import {
  UseAlertAndTransactionServiceType
} from "context/alertAndTransaction";

export class RootStore {
  /*
   * Services
   */
  poolService: IPoolService;
  positionService: IPositionService;
  stableSwapService: IStableSwapService;
  proposalService: IProposalService;
  stakingService: IStakingService;

  chainId: number = DEFAULT_CHAIN_ID;

  constructor(alertAndTransactionProvider: UseAlertAndTransactionServiceType) {
    this.poolService = new PoolService(alertAndTransactionProvider);
    this.positionService = new PositionService(alertAndTransactionProvider);
    this.proposalService = new ProposalService(alertAndTransactionProvider);
    this.stakingService = new StakingService(alertAndTransactionProvider);
    this.stableSwapService = new StableSwapService(alertAndTransactionProvider);
  }

  setChainId(chainId: number) {
    this.chainId = chainId;

    [
      "poolService",
      "positionService",
      "stableSwapService",
      "proposalService",
      "stakingService"
    ].forEach((serviceName) => {
      console.log(`Setting chain ID ${chainId} for ${serviceName}`);
      // @ts-ignore
      this[serviceName].setChainId(chainId);
    });
  }
}
