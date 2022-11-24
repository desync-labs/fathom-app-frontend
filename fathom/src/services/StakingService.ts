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
import { secondsToTime } from "utils/secondsToTime";
    //claimAllLockRewardsForStream(uint256 streamId) (pass streamId = 0 as FTHM tokens streamId is 0) --> This function is use to claim all lock rewards for a stream
    //function withdrawStream(uint256 streamId) -> This is used to withdraw all the fthm token claimed
const defaultLockInfo = {
  lockId: 0,
  VOTETokenBalance: 0,
  MAINTokenBalance: 0,
  EndTime: 0,
  RewardsAvailable: "0",
  timeObject: {
    hour: 0,
    seconds: 0,
    days: 0,
    min: 0,
    sec: 0,
  },
};

export default class StakingService implements IStakingService {
  chainId = 51;

  async createLock(
    address: string,
    stakePosition: number,
    unlockPeriod: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
    );
    const day = 24 * 60 * 60;

    console.log("timestamp  HERE: ", (await this.getTimestamp()).toString());

    const lockingPeriod = unlockPeriod * day;
    let endTime = await this.getTimestamp();

    if (lockingPeriod === 0) {
      //if locking period = 0, lock only for 5 min
      endTime += 5 * 60;
    }
    if (lockingPeriod > 0) {
      endTime = endTime + lockingPeriod;
    }

    return Staking.methods
      .createLock(this.toWei(stakePosition), endTime)
      .send({ from: address })
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
            .getStreamClaimableAmountPerLock(1, account, i + 1)
            .call()
        );
      }

      const data = await Promise.all([
        Promise.all(promises),
        Promise.all(claimPromises),
      ]);
      const currentTimestamp = await this.getTimestamp();

      const [lockData, claimData] = data;

      for (let i = 0; i < length; i++) {
        let lockPosition = {} as ILockPosition;
        const {
          0: amountOfMAINTkn,
          1: amountOfveMAINTkn,
          4: end,
        } = lockData[i];

        const amountOfRewardsAvailable = claimData[i];

        lockPosition.lockId = i + 1;
        lockPosition.MAINTokenBalance =
          this._convertToEtherBalance(amountOfMAINTkn);

        lockPosition.VOTETokenBalance =
          this._convertToEtherBalance(amountOfveMAINTkn);

        lockPosition.EndTime = end - currentTimestamp;

        lockPosition.RewardsAvailable = this._convertToEtherBalanceRewards(
          amountOfRewardsAvailable
        );

        lockPosition.timeObject = this._convertToTimeObject(
          lockPosition.EndTime
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
    let lockPosition = {} as ILockPosition;

    try {
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(this.chainId),
        this.chainId
      );

      const StakingGetter = Web3Utils.getContractInstance(
        SmartContractFactory.StakingGetter(this.chainId),
        this.chainId
      );

      const currentTimestamp = await this.getTimestamp();

      const {
        0: amountOfMAINTkn,
        1: amountOfveMAINTkn,
        4: end,
      } = await StakingGetter.methods.getLock(account, lockId).call();

      const amountOfRewardsAvailable = await Staking.methods
        .getStreamClaimableAmountPerLock(1, account, lockId)
        .call();

      lockPosition.lockId = lockId;

      lockPosition.MAINTokenBalance =
        this._convertToEtherBalance(amountOfMAINTkn);

      lockPosition.VOTETokenBalance =
        this._convertToEtherBalance(amountOfveMAINTkn);

      lockPosition.EndTime = end - currentTimestamp;

      lockPosition.RewardsAvailable = this._convertToEtherBalanceRewards(
        amountOfRewardsAvailable
      );

      lockPosition.timeObject = this._convertToTimeObject(lockPosition.EndTime);

      return lockPosition;
    } catch (error) {
      console.error(`Error in fetching latest lock: ${error}`);
      return defaultLockInfo;
    }
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

    return new Promise(async (resolve, reject) => {
      try {
        await Staking.methods
          .claimAllStreamRewardsForLock(lockId)
          .send({ from: account })
          .on("transactionHash", (hash: any) => {
            transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: `Claiming All Stream Rewards before unlock`,
              message: Strings.CheckOnBlockExplorer,
            });
          });

        await Staking.methods
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

        resolve();
      } catch (error) {
        reject(error);
      }
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
    

    return new Promise(async (resolve, reject) => {
      try {
        await Staking.methods
          .claimAllStreamRewardsForLock(lockId) 
          .send({ from: account })
          .on("transactionHash", (hash: any) => {
            transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: `Claiming All Stream Rewards before unlock`,
              message: Strings.CheckOnBlockExplorer,
            });
          });

        await Staking.methods
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

        resolve();
      } catch (error) {
        reject(error);
      }
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
    return  (20000 * oneDay) / oneYear;
  }

  async getAPR(): Promise<number> {
    const oneDayReward = await this.getOneDayRewardForStream1();
    const oneYearStreamRewardValue = oneDayReward * 365;

    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.chainId
    );

    let totalStaked = await Staking.methods.totalAmountOfStakedMAINTkn().call();

    totalStaked = this.fromWei(totalStaked);

    const totalAPR = (oneYearStreamRewardValue * 100) / totalStaked;
    const APR = parseInt(totalAPR.toString());

    return APR;
  }

  async getWalletBalance(account: string): Promise<number> {
    const MainToken = Web3Utils.getContractInstance(
      SmartContractFactory.MainToken(this.chainId),
      this.chainId
    );

    const balance = await MainToken.methods.balanceOf(account).call();
    return parseFloat(this._convertToEtherBalanceRewards(balance));
  }

  async getVOTEBalance(account: string): Promise<number> {
    const VeMAINToken = Web3Utils.getContractInstance(
      SmartContractFactory.VeMAINToken(this.chainId),
      this.chainId
    );

    const balance = await VeMAINToken.methods.balanceOf(account).call();
    return parseFloat(this._convertToEtherBalanceRewards(balance));
  }

  async getTimestamp(): Promise<number> {
    console.log(`getTimestamp`);
    const web3 = Web3Utils.getWeb3Instance(this.chainId);
    const blockNumber = await web3.eth.getBlockNumber();
    const block = await web3.eth.getBlock(blockNumber);

    return block.timestamp;
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

  _convertToTimeObject(_remainingTime: number) {
    const remainingTime = _remainingTime;
    let obj = {
      days: 0,
      hour: 0,
      min: 0,
      sec: 0,
      seconds: 0,
    };

    if (remainingTime > 0) {
      obj = secondsToTime(remainingTime);
    }
    return obj;
  }

  async approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number
  ): Promise<Boolean> {
    const FTHMToken = Web3Utils.getContractInstance(
      SmartContractFactory.MainToken(this.chainId),
      this.chainId
    );

    const StakingAddress = SmartContractFactory.Staking(this.chainId).address;

    const allowance = await FTHMToken.methods
      .allowance(address, StakingAddress)
      .call();

    return allowance > this.toWei(stakingPosition);
  }

  approveStakingFTHM(
    address: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const FTHMToken = Web3Utils.getContractInstance(
      SmartContractFactory.MainToken(this.chainId),
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
