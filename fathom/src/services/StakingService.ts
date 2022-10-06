import { SmartContractFactory } from "../config/SmartContractFactory";
import IStakingService from "./interfaces/IStakingService";
import { Web3Utils } from "../helpers/Web3Utils";

import ActiveWeb3Transactions from "../stores/transaction.store";
import {
  TransactionStatus,
  TransactionType,
} from "../stores/interfaces/ITransaction";
import { Constants } from "../helpers/Constants";
import ILockPosition from "../stores/interfaces/ILockPosition";
import { Strings } from "../helpers/Strings";
import { secondsToTime } from "../utils/secondsToTime";

export default class StakingService implements IStakingService {
  chainId = 51;
  async createLock(
    address: string,
    stakePosition: number,
    unlockPeriod: number,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    chainId = chainId || this.chainId;
      if (chainId) {
        const MainToken = Web3Utils.getContractInstance(
          SmartContractFactory.MainToken(chainId),
          chainId
        );
        console.log("HERE1");
        console.log("SmartContractFactory.Staking(this.chainId).address:  ");
        console.log(SmartContractFactory.Staking(chainId).address);

        console.log(
          "Constants.WeiPerWad.multipliedBy(stakePosition).toString()"
        );
        console.log(Constants.WeiPerWad.multipliedBy(stakePosition).toString());

        return new Promise(async (resolve, reject) => {
          try {
            await MainToken.methods
              .approve(
                SmartContractFactory.Staking(this.chainId).address,
                await this.toWei(stakePosition, chainId)
              )
              .send({ from: address })
              .on("transactionHash", (hash: any) => {
                transactionStore.addTransaction({
                  hash: hash,
                  type: TransactionType.Approve,
                  active: false,
                  status: TransactionStatus.None,
                  title: `Approval Pending`,
                  message: Strings.CheckOnBlockExplorer,
                });
              });

            const Staking = Web3Utils.getContractInstance(
              SmartContractFactory.Staking(chainId),
              chainId
            );

            const day = 24 * 60 * 60;

            console.log(
              "timestamp  HERE: ",
              (await this.getTimestamp(chainId)).toString()
            );

            const lockingPeriod = unlockPeriod * day;
            let endTime = await this.getTimestamp(chainId);

            if (lockingPeriod === 0) {
              //if locking period = 0, lock only for 5 mins
              endTime += 5 * 60;
            }
            if (lockingPeriod > 0) {
              endTime = endTime + lockingPeriod;
            }

            await Staking.methods
              .createLock(this.toWei(stakePosition, chainId), endTime)
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

            resolve();
          } catch (error) {
            reject(error);
          }
        });
      }
    
  }

  async getLockPositions(
    account: string,
    chainId: number
  ): Promise<ILockPosition[]> {
    chainId = chainId || this.chainId;

    const lockPositionsList = [] as ILockPosition[];

    try {
      if (chainId) {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(chainId),
          chainId
        );

        const StakingGetter = Web3Utils.getContractInstance(
          SmartContractFactory.StakingGetter(chainId),
          chainId
        );

        const result = await StakingGetter.methods
          .getLocksLength(account)
          .call();

        for (let i = 0; i < result; i++) {
          let lockPosition = {} as ILockPosition;
          const {
            0: amountOfMAINTkn,
            1: amountOfveMAINTkn,
            4: end,
          } = await StakingGetter.methods.getLock(account, i + 1).call();

          const amountOfRewardsAvailable = await Staking.methods
            .getStreamClaimableAmountPerLock(1, account, i + 1)
            .call();

          lockPosition.lockId = i + 1;
          lockPosition.MAINTokenBalance = this._convertToEtherBalance(
            amountOfMAINTkn,
            chainId
          );

          lockPosition.VOTETokenBalance = this._convertToEtherBalance(
            amountOfveMAINTkn,
            chainId
          );

          lockPosition.EndTime = await this.getRemainingTime(end, chainId);
          lockPosition.RewardsAvailable =
            await this._convertToEtherBalanceRewards(
              amountOfRewardsAvailable,
              chainId
            );

          lockPosition.timeObject = this._convertToTimeObject(
            lockPosition.EndTime
          );

          console.log(lockPosition);
          lockPositionsList.push(lockPosition);
        }
        return lockPositionsList;
      } else return [];
    } catch (error) {
      console.error(`Error in fetching Locks: ${error}`);
      return [];
    }
  }

  async getLockInfo(
    lockId: number,
    account: string,
    chainId: number): Promise<ILockPosition> {
      //TODO: What to return if it fails?
      let lockPosition = {} as ILockPosition;
      
      chainId = chainId || this.chainId;
      try {
        if (chainId) {
          const Staking = Web3Utils.getContractInstance(
            SmartContractFactory.Staking(chainId),
            chainId
          );

          const StakingGetter = Web3Utils.getContractInstance(
            SmartContractFactory.StakingGetter(chainId),
            chainId
          );
          const {
            0: amountOfMAINTkn,
            1: amountOfveMAINTkn,
            4: end,
          } = await StakingGetter.methods.getLock(account,lockId).call();

          const amountOfRewardsAvailable = await Staking.methods
            .getStreamClaimableAmountPerLock(1, account, lockId)
            .call();
            lockPosition.lockId = lockId;
            lockPosition.MAINTokenBalance = await this._convertToEtherBalance(
              amountOfMAINTkn,
              chainId
            );
            lockPosition.VOTETokenBalance = await this._convertToEtherBalance(
              amountOfveMAINTkn,
              chainId
            );
            lockPosition.EndTime = await this.getRemainingTime(end, chainId);
            lockPosition.RewardsAvailable =
              await this._convertToEtherBalanceRewards(
                amountOfRewardsAvailable,
                chainId
              );
  
              lockPosition.timeObject = this._convertToTimeObject(lockPosition.EndTime)
              console.log(lockPosition);

            return lockPosition
        }else {
          return {
            lockId: 0,
            VOTETokenBalance: 0,
            MAINTokenBalance: 0,
            EndTime: 0,
            RewardsAvailable:"0",
            timeObject: {
              hour: 0,
              sec: 0,
              days: 0,
              min: 0
            }
          }
        }
  
    }catch (error) {
      console.error(`Error in fetching latest lock: ${error}`);
      return {
        lockId: 0,
        VOTETokenBalance: 0,
        MAINTokenBalance: 0,
        EndTime: 0,
        RewardsAvailable:"0",
        timeObject: {
          hour: 0,
          sec: 0,
          days: 0,
          min: 0
        }
      }
    }
  }

  async getLockPositionsLength(
    account: string,
    chainId: number
  ): Promise<number> {
    chainId = chainId || this.chainId;
    try{
      const StakingGetter = Web3Utils.getContractInstance(
        SmartContractFactory.StakingGetter(chainId),
        chainId
      );
      const result = await StakingGetter.methods
          .getLocksLength(account)
          .call();

          return result;

    }catch(error){
      console.error(`Error in fetching Locks: ${error}`);
      return 0;
    }
  }

  async handleUnlock(
    account: string,
    lockId: number,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    chainId = chainId || this.chainId;
    
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(chainId),
        chainId
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
                title: `Handling Single claim reward`,
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
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    chainId = chainId || this.chainId;
    console.log("is account here", account);
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(chainId),
        chainId
      );
      console.log("is account here", account);
      console.log("getting LockID:", lockId);

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
                title: `Hanndling Single claim reward`,
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
                title: `Hanndling early withdrawal`,
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
    lockId: number,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    chainId = chainId || this.chainId;
    console.log("is account here", account);
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(chainId),
        chainId
      );
      console.log("is account here", account);
      console.log("getting LockID:", lockId);
      return Staking.methods
        .claimRewards(lockId)
        .send({ from: account })
        .on("transactionHash", (hash: any) => {
          transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.Approve,
            active: false,
            status: TransactionStatus.None,
            title: `Hanndling Single claim reward`,
            message: Strings.CheckOnBlockExplorer,
          });
        });
  
  }

  async handleClaimRewards(
    account: string,
    streamId: number,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    chainId = chainId || this.chainId;
    try {
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(chainId),
        chainId
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
    } catch (error) {
      console.error(`Error in Claim Rewards: ${error}`);
    }
  }

  async handleWithdrawRewards(
    account: string,
    streamId: number,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    chainId = chainId || this.chainId;
    try {
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(chainId),
        chainId
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
            title: `handling withdraw rewards`,
            message: Strings.CheckOnBlockExplorer,
          });
        });
    } catch (error) {
      console.error(`Error in Withdraw rewards: ${error}`);
    }
  }

  async getOneDayRewardForStream1(): Promise<number> {
    const oneDay = 86400;
    const oneYear = 365 * 24 * 60 * 60;

    const oneDayReward = (20000 * oneDay) / oneYear;
    return oneDayReward;
  }

  async getAPR(chainId: number): Promise<number> {
    chainId = chainId || this.chainId;
    try {
      const oneDayReward = await this.getOneDayRewardForStream1();
      const oneYearStreamRewardValue = oneDayReward * 365;

      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(chainId),
        chainId
      );

      let totalStaked = await Staking.methods
        .totalAmountOfStakedMAINTkn()
        .call();
      totalStaked = this.fromWei(totalStaked, chainId);

      const totalAPR = (oneYearStreamRewardValue * 100) / totalStaked;
      const APR = parseInt(totalAPR.toString());

      return APR;
    } catch (error) {
      console.error(`Error in get APR: ${error}`);
      return 0;
    }
  }

  async getWalletBalance(account: string, chainId: number): Promise<number> {
    chainId = chainId || this.chainId;
    try {
      const MainToken = Web3Utils.getContractInstance(
        SmartContractFactory.MainToken(chainId),
        chainId
      );

      let balance = await MainToken.methods.balanceOf(account).call();
      balance = this._convertToEtherBalance(balance, chainId);
      return balance;
    } catch (error) {
      console.error(`Error in get wallet balance: ${error}`);
      return 0;
    }
  }

  async getVOTEBalance(account: string, chainId: number): Promise<number> {
    chainId = chainId || this.chainId;
    try {
      const VeMAINToken = Web3Utils.getContractInstance(
        SmartContractFactory.VeMAINToken(chainId),
        chainId
      );

      let balance = await VeMAINToken.methods.balanceOf(account).call();
      balance = this._convertToEtherBalance(balance, chainId);

      return balance;
    } catch (error) {
      console.error(`Error in get vote balance: ${error}`);
      return 0;
    }
  }

  async getRemainingTime(end: number, chainId: number): Promise<number> {
    chainId = chainId || this.chainId;

    const currentTimestamp = await this.getTimestamp(chainId);
    return  end - currentTimestamp;
  }

  async getTimestamp(chainId: number): Promise<number> {
    chainId = chainId || this.chainId;
    console.log(`getTimestamp`);
    const web3 = Web3Utils.getWeb3Instance(chainId);
    const blockNumber = await web3.eth.getBlockNumber();
    const block = await web3.eth.getBlock(blockNumber);

    return block.timestamp;
  }

  fromWei(balance: number, chainId: number): number {
    chainId = chainId || this.chainId;
    const web3 = Web3Utils.getWeb3Instance(chainId);
    return web3.utils.fromWei(balance.toString(), "ether");
  }

  toWei(balance: number, chainId: number): number {
    chainId = chainId || this.chainId;
    const web3 = Web3Utils.getWeb3Instance(chainId);
    return web3.utils.toWei(balance.toString(), "ether");
  }

  _convertToEtherBalance(balance: number, chainId: number): number {
    chainId = chainId || this.chainId;
    return parseInt(this.fromWei(balance, chainId).toString());
  }

  _convertToEtherBalanceRewards(balance: number, chainId: number): string {
    chainId = chainId || this.chainId;
    return parseFloat(this.fromWei(balance, chainId).toString()).toFixed(2);
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

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
