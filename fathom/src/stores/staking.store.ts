import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import IStakingService from "../services/interfaces/IStakingService";
import ILockPosition from "./interfaces/ILockPosition";

export default class StakingStore {
  lockPositions: ILockPosition[] = [];
  service: IStakingService;
  rootStore: RootStore;
  totalStakedPosition: number = 0;
  apr: number = 0;
  walletBalance: number = 0;
  voteBalance: number = 0;

  constructor(rootStore: RootStore, service: IStakingService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  createLock = async (
    account: string,
    stakePosition: number,
    unlockPeriod: number,
    chainId: number
  ) => {
    console.log("Running createLock from store");
    try {
      if (!account) return;

      return this.service.createLock(
        account,
        stakePosition,
        unlockPeriod,
        chainId,
        this.rootStore.transactionStore
      );

 //     await this.fetchLatestLock(account, chainId)

      // await this.fetchAll(account,chainId)
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in Creating Lock postion!"
      );
    }
  };

  handleEarlyWithdrawal = async (
    account: string,
    lockId: number,
    chainId: number
  ) => {
    console.log("Running createLock from store");
    try {
      if (!account) return;

      return this.service.handleEarlyWithdrawal(
        account,
        lockId,
        chainId,
        this.rootStore.transactionStore
      );

     // await this.fetchLockPositionAfterUnlock(lockId,account, chainId)

      //   await this.fetchAll(account,chainId)
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in Early Withdrawal!"
      );
    }
  };

  handleUnlock = async (account: string, lockId: number, chainId: number) => {
    console.log("Running createLock from store");
    try {
      if (!account) return;

      return this.service.handleUnlock(
        account,
        lockId,
        chainId,
        this.rootStore.transactionStore
      );

  //    await this.fetchLockPositionAfterUnlock(lockId,account, chainId)

      //    await this.fetchAll(account,chainId)
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in Unlock!"
      );
    }
  };

  handleClaimRewards = async (account: string, chainId: number) => {
    console.log("Running createLock from store");
    try {
      if (!account) return;
      return this.service.handleClaimRewards(
        account,
        1,
        chainId,
        this.rootStore.transactionStore
      );
      //TODO: Check This:

      //await this.fetchLocksAfterClaimAllRewards();

      //      await this.fetchAll(account,chainId)
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in claiming rewards!"
      );
    }
  };

  handleClaimRewardsSingle = async (
    account: string,
    lockId: number,
    chainId: number
  ) => {
    console.log("Running createLock from store");
    try {
      if (account === undefined || account === null) return;

      await this.service.handleClaimRewardsSingle(
        account,
        lockId,
        chainId,
        this.rootStore.transactionStore
      );

      

      //      await this.fetchAll(account,chainId)
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in claiming rewards!"
      );
    }
  };

  handleWithdrawRewards = async (account: string, chainId: number) => {
    console.log("Running createLock from store");
    try {
      if (!account) return;

      return this.service.handleWithdrawRewards(
        account,
        1,
        chainId,
        this.rootStore.transactionStore
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in Withdrawing Rewards!"
      );
    }
  };

  setLocks = (_lockPositions: ILockPosition[]) => {
    this.lockPositions = _lockPositions;
  };

  setTotalStakedPosition = (_lockPositions: ILockPosition[]) => {
    this.totalStakedPosition = 0;
    for (let i = 0; i < _lockPositions.length; i++) {
      this.totalStakedPosition += _lockPositions[i].MAINTokenBalance;
    }
  };

  fetchAPR = async (chainId: number) => {
    console.log("fetching... APR");
    const apr = await this.service.getAPR(chainId);
    runInAction(() => {
      this.setAPR(apr);
    });
  };

  setAPR = (_apr: number) => {
    this.apr = _apr;
  };

  setWalletBalance = (_walletBalance: number) => {
    this.walletBalance = _walletBalance;
  };

  fetchWalletBalance = async (account: string, chainId: number) => {
    const walletBalance = await this.service.getWalletBalance(account, chainId);
    runInAction(() => {
      this.setWalletBalance(walletBalance);
    });
  };

  setVOTEBalance = (_voteBalance: number) => {
    this.voteBalance = _voteBalance;
  };

  fetchVOTEBalance = async (account: string, chainId: number) => {
    const voteBalance = await this.service.getVOTEBalance(account, chainId);
    runInAction(() => {
      this.setVOTEBalance(voteBalance);
    });
  };

  fetchLocks = async (account: string, chainId: number) => {
    const locks = await this.service.getLockPositions(account, chainId);
    runInAction(() => {
      this.setLocks(locks);
      this.setTotalStakedPosition(locks);
    });
  };

  fetchLatestLock = async(account: string, chainId: number) => {
    console.log("......is fetch Latest Lock getting called before,.....")
    let lockId = await this.service.getLockPositionsLength(account, chainId);
    if(lockId > 0){
      let lockPosition = await this.service.getLockInfo(lockId, account, chainId);
      if(lockPosition.MAINTokenBalance > 0){
        this.lockPositions.push(lockPosition)
        this.setTotalStakedPosition(this.lockPositions)
      }

    }
  }

  fetchLockPositionAfterUnlock = async (lockId: number) => {
    let latestLockId =  this.lockPositions.length
    
    if(latestLockId > 1){
      console.log("........", latestLockId)
      
        let lockPosition = this.lockPositions[latestLockId - 1]
        lockPosition.lockId = lockId;
        this.lockPositions[lockId - 1] = lockPosition;
        this.lockPositions.pop();
        
    }else{
        this.lockPositions.pop();
    }
  }

  fetchLocksAfterClaimAllRewards = async() => {
    for (let i = 0; i < this.lockPositions.length; i++) {
      this.lockPositions[i].RewardsAvailable ="0";
    }
  }
}
