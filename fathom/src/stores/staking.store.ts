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

  constructor(rootStore: RootStore, service: IStakingService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  createLock = async (
    account:string,
    stakePosition:number, 
    unlockPeriod: number,
    chainId: number
  ) => {
    console.log(
      "Running createLock from store"
    );
    try {
      if (account === undefined || account === null) return;

      await this.service.createLock(
        account,
        500, 
        2,
        chainId
      );
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
    console.log(
      "Running createLock from store"
    );
    try {
      if (account === undefined || account === null) return;

      await this.service.handleEarlyWithdrawal(
        account,
        lockId,
        chainId
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in Early Withdrawal!"
      );
    }
  };


  handleUnlock = async (
    account: string, 
    lockId: number,
    chainId: number
) => {
  console.log(
    "Running createLock from store"
  );
  try {
    if (account === undefined || account === null) return;

    await this.service.handleUnlock(
      account,
      lockId,
      chainId
    );

  } catch (e) {
    this.rootStore.alertStore.setShowErrorAlert(
      true,
      "There is some error in Unlock!"
      );
    }
  };

  handleClaimRewards = async (
    account: string, 
    chainId: number
  ) => {
    console.log(
      "Running createLock from store"
    );
    try {
      if (account === undefined || account === null) return;

      await this.service.handleClaimRewards(
        account,
        1,
        chainId
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in claiming rewards!"
        );
      }
  };

  handleWithdrawRewards = async (
    account: string, 
    chainId: number
  ) => {
    console.log(
      "Running createLock from store"
    );
    try {
      if (account === undefined || account === null) return;

      await this.service.handleWithdrawRewards(
        account,
        1,
        chainId
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in Withdrawing Rewards!"
        );
      }
  };
  
  

  setLocks = (_lockPositions:ILockPosition[]) => {
    this.lockPositions = []
    this.lockPositions= _lockPositions;
  }

  setTotalStakedPosition = (_lockPositions:ILockPosition[]) => {
    this.totalStakedPosition = 0;
      for(let i = 0; i< _lockPositions.length; i++){
          this.totalStakedPosition+=_lockPositions[i].MAINTokenBalance;
      }
  }

  fetchAPR = async (chainId: number) => {
    let apr = await this.service.getAPR(chainId);
    runInAction(() => {
      this.setAPR(apr)
    })
  }

  setAPR = (_apr: number) => {
    this.apr= _apr;
  }


  fetchLocks = async (account: string, chainId: number) => {
    let locks = await this.service.getLockPositions(account,chainId);
    runInAction(() => {
      this.setLocks(locks)
    })
  }
}
