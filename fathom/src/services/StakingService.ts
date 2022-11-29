import { SmartContractFactory } from "config/SmartContractFactory";
import IStakingService from "services/interfaces/IStakingService";
import { Web3Utils } from "helpers/Web3Utils";

import ActiveWeb3Transactions from "stores/transaction.store";
import {
  TransactionStatus,
  TransactionType,
} from "stores/interfaces/ITransaction";
import { Constants } from "helpers/Constants";
import ILockPosition from "stores/interfaces/ILockPosition";
import { Strings } from "helpers/Strings";

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
    const daySeconds = 24 * 60 * 60;
    const endTime = unlockPeriod * daySeconds;
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

  async getLockPositions(account: string): Promise<ILockPosition[]> {
    const lockPositionsList = [] as ILockPosition[];

    try {
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(this.chainId),
        this.chainId
      );

      const StakingGetter = Web3Utils.getContractInstance(
        SmartContractFactory.StakingGetter(this.chainId),
        this.chainId
      );

      const promises = [];
      const claimPromises = [];

      const length = await StakingGetter.methods.getLocksLength(account).call();

      for (let i = 0; i < length; i++) {
        promises.push(StakingGetter.methods.getLock(account, i + 1).call());
        claimPromises.push(
          Staking.methods
            .getStreamClaimableAmountPerLock(0, account, i + 1)
            .call()
        );
      }

      const data = await Promise.all([
        Promise.all(promises),
        Promise.all(claimPromises),
      ]);

      const currentTimestamp = Math.floor(Date.now() / 1000);

      const [lockData, claimData] = data;

      for (let i = 0; i < length; i++) {
        let lockPosition = {} as ILockPosition;
        const { 0: amountOfToken, 1: amountOfvToken, 3: end } = lockData[i];

        const amountOfRewardsAvailable = claimData[i];

        lockPosition.lockId = i + 1;
        lockPosition.MAINTokenBalance =
          this._convertToEtherBalance(amountOfToken);

        lockPosition.VOTETokenBalance =
          this._convertToEtherBalance(amountOfvToken);

        lockPosition.EndTime = end - currentTimestamp;

        lockPosition.RewardsAvailable = this._convertToEtherBalanceRewards(
          amountOfRewardsAvailable
        );

        lockPositionsList.push(lockPosition);
      }

      return lockPositionsList;
    } catch (error) {
      console.error(`Error in fetching Locks: ${error}`);
      return [];
    }
  }

  async getLockInfo(lockId: number, account: string): Promise<ILockPosition> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
    );

    const StakingGetter = Web3Utils.getContractInstance(
      SmartContractFactory.StakingGetter(this.chainId),
      this.chainId
    );

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const {
      0: amountOfToken,
      1: amountOfvToken,
      3: end,
    } = await StakingGetter.methods.getLock(account, lockId).call();

    const amountOfRewardsAvailable = await Staking.methods
      .getStreamClaimableAmountPerLock(0, account, lockId)
      .call();

    const lockPosition = {
      lockId,
      MAINTokenBalance: this._convertToEtherBalance(amountOfToken),
      VOTETokenBalance: this._convertToEtherBalance(amountOfvToken),
      EndTime: end - currentTimestamp,
      RewardsAvailable: this._convertToEtherBalanceRewards(
        amountOfRewardsAvailable
      ),
    };

    return lockPosition;
  }

  async getLockPositionsLength(account: string): Promise<number> {
    const StakingGetter = Web3Utils.getContractInstance(
      SmartContractFactory.StakingGetter(this.chainId),
      this.chainId
    );
    return StakingGetter.methods.getLocksLength(account).call();
  }

  async handleUnlock(
    account: string,
    lockId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
    );

    return Staking.methods
      .unlock(lockId)
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

  async handleClaimRewardsSingle(
    account: string,
    streamId: number,
    lockId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
    );

    return Staking.methods
      .claimRewards(streamId, lockId)
      .send({ from: account })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.Approve,
          active: false,
          status: TransactionStatus.None,
          title: `Handling Single claim reward`,
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

    return Staking.methods
      .withdrawAll()
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

  async getOneDayRewardForStream1(): Promise<number> {
    // One day seconds
    const oneDay = 24 * 60 * 60;
    // One year seconds
    const oneYear = 365 * 24 * 60 * 60;
    return (20000 * oneDay) / oneYear;
  }

  async getAPR(): Promise<number> {
    const oneDayReward = await this.getOneDayRewardForStream1();
    const oneYearStreamRewardValue = oneDayReward * 365;

    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
    );

    let totalStaked = await Staking.methods.totalAmountOfStakedToken().call();

    totalStaked = this.fromWei(totalStaked);

    const totalAPR = (oneYearStreamRewardValue * 100) / totalStaked;
    const APR = parseInt(totalAPR.toString());

    return APR;
  }

  async getVOTEBalance(account: string): Promise<number> {
    const VeMAINToken = Web3Utils.getContractInstance(
      SmartContractFactory.vFathom(this.chainId),
      this.chainId
    );

    const balance = await VeMAINToken.methods.balanceOf(account).call();
    return parseFloat(this._convertToEtherBalanceRewards(balance));
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

  _convertToEtherBalanceRewards(balance: number): string {
    return parseFloat(this.fromWei(balance).toString()).toFixed(2);
  }

  async approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string
  ): Promise<Boolean> {
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
