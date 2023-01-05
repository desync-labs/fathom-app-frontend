import { SmartContractFactory } from "config/SmartContractFactory";
import IStakingService from "services/interfaces/IStakingService";
import { Web3Utils } from "helpers/Web3Utils";

import ActiveWeb3Transactions from "stores/transaction.store";
import {
  TransactionStatus,
  TransactionType,
} from "stores/interfaces/ITransaction";
import { Constants } from "helpers/Constants";
import { Strings } from "helpers/Strings";
import Xdc3 from "xdc3";

const DAY_SECONDS = 24 * 60 * 60;

export default class StakingService implements IStakingService {
  chainId = Constants.DEFAULT_CHAIN_ID;

  createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3,
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      library,
    );
    const endTime = unlockPeriod * DAY_SECONDS;

    console.log(this.toWei(stakePosition, library))
    console.log(endTime)
    console.log(account)

    return Staking.methods
      .createLock(this.toWei(stakePosition, library), endTime, account)
      .send({ from: account })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.Approve,
          active: false,
          status: TransactionStatus.None,
          title: `Creating Lock`,
          message: Strings.CheckOnBlockExplorer,
        });
      });
  }

  handleUnlock(
    account: string,
    lockId: number,
    amount: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3,
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      library
    );
    return Staking.methods
      .unlockPartially(lockId, this.toWei(amount, library))
      .send({ from: account })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.Approve,
          active: false,
          status: TransactionStatus.None,
          title: `Handling Unlock`,
          message: Strings.CheckOnBlockExplorer,
        });
      });
  }

  handleEarlyWithdrawal(
    account: string,
    lockId: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3,
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      library,
    );

    return Staking.methods
      .earlyUnlock(lockId)
      .send({ from: account })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.Approve,
          active: false,
          status: TransactionStatus.None,
          title: `Handling Early Unlock`,
          message: Strings.CheckOnBlockExplorer,
        });
      });
  }

  handleClaimRewards(
    account: string,
    streamId: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3,
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      library,
    );

    return Staking.methods
      .claimAllLockRewardsForStream(streamId)
      .send({ from: account })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.Approve,
          active: false,
          status: TransactionStatus.None,
          title: `Handling claim rewards`,
          message: Strings.CheckOnBlockExplorer,
        });
      });
  }

  handleWithdrawAll(
    account: string,
    streamId: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3,
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      library,
    );

    /**
     * For FTHM stream we is 0
     */
    return Staking.methods
      .withdrawStream(0)
      .send({ from: account })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.Approve,
          active: false,
          status: TransactionStatus.None,
          title: `Handling Withdraw Rewards`,
          message: Strings.CheckOnBlockExplorer,
        });
      });
  }

  toWei(balance: number, library:Xdc3): string {
    return library.utils.toWei(balance.toString(), "ether");
  }

  async approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string,
    library: Xdc3,
  ): Promise<boolean> {
    const FTHMToken = Web3Utils.getContractInstance(
      SmartContractFactory.MainToken(fthmTokenAddress),
      library,
    );

    const StakingAddress = SmartContractFactory.Staking(this.chainId).address;

    const allowance = await FTHMToken.methods
      .allowance(address, StakingAddress)
      .call();

    return Number(allowance) > Number(this.toWei(stakingPosition, library));
  }

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number,
    library: Xdc3,
  ): Promise<number> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      library,
    );

    return Staking.methods
      .getStreamClaimableAmountPerLock(streamId, account, lockId)
      .call();
  }

  getStreamClaimableAmount(account: string, library: Xdc3): Promise<number> {
    const StakingGetter = Web3Utils.getContractInstance(
      SmartContractFactory.StakingGetter(this.chainId),
      library,
    );

    return StakingGetter.methods.getStreamClaimableAmount(0, account).call();
  }

  approveStakingFTHM(
    address: string,
    fthmTokenAddress: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3,
  ): Promise<void> {
    const FTHMToken = Web3Utils.getContractInstance(
      SmartContractFactory.MainToken(fthmTokenAddress),
      library,
    );

    const StakingAddress = SmartContractFactory.Staking(this.chainId).address;

    return FTHMToken.methods
      .approve(StakingAddress, Constants.MAX_UINT256)
      .send({ from: address })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.Approve,
          active: false,
          status: TransactionStatus.None,
          title: `Approving the token`,
          message: Strings.CheckOnBlockExplorer,
        });
      });
  }

  getPairPrice(token0: string, token1: string, library: Xdc3) {
    const DexPriceOracle = Web3Utils.getContractInstance(
      SmartContractFactory.DexPriceOracle(this.chainId),
      library,
    );
    return DexPriceOracle.methods.getPrice(token0, token1).call();
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
