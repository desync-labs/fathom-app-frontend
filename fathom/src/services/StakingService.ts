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

const DAY_SECONDS = 24 * 60 * 60;

export default class StakingService implements IStakingService {
  chainId = Constants.DEFAULT_CHAIN_ID;

  async createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
    );
    const endTime = unlockPeriod * DAY_SECONDS;
    return Staking.methods
      .createLock(this.toWei(stakePosition), endTime, account)
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

  async handleUnlock(
    account: string,
    lockId: number,
    amount: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
    );
    return Staking.methods
      .unlockPartially(lockId, this.toWei(amount))
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

  async handleEarlyWithdrawal(
    account: string,
    lockId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
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

  async handleClaimRewards(
    account: string,
    streamId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
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

  async handleWithdrawAll(
    account: string,
    streamId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
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

  fromWei(balance: number): number {
    const web3 = Web3Utils.getWeb3Instance(this.chainId);
    return web3.utils.fromWei(balance.toString(), "ether");
  }

  toWei(balance: number): number {
    const web3 = Web3Utils.getWeb3Instance(this.chainId);
    return web3.utils.toWei(balance.toString(), "ether");
  }

  _convertToEtherBalance(balance: number): number {
    return parseInt(this.fromWei(balance).toString());
  }

  async approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string
  ): Promise<boolean> {
    const FTHMToken = Web3Utils.getContractInstance(
      SmartContractFactory.MainToken(fthmTokenAddress),
      this.chainId
    );

    const StakingAddress = SmartContractFactory.Staking(this.chainId).address;

    const allowance = await FTHMToken.methods
      .allowance(address, StakingAddress)
      .call();

    return Number(allowance) > Number(this.toWei(stakingPosition));
  }

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number
  ): Promise<number> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
    );

    return Staking.methods
      .getStreamClaimableAmountPerLock(streamId, account, lockId)
      .call();
  }

  getStreamClaimableAmount(account: string): Promise<number> {
    const StakingGetter = Web3Utils.getContractInstance(
      SmartContractFactory.StakingGetter(this.chainId),
      this.chainId
    );

    return StakingGetter.methods.getStreamClaimableAmount(0, account).call();
  }

  approveStakingFTHM(
    address: string,
    fthmTokenAddress: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const FTHMToken = Web3Utils.getContractInstance(
      SmartContractFactory.MainToken(fthmTokenAddress),
      this.chainId
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

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
