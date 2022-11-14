import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import IStakingService from "services/interfaces/IStakingService";
import ILockPosition from "stores/interfaces/ILockPosition";
import { processRpcError } from "../utils/processRpcError";

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

  async createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number
  ) {
    console.log("Running createLock from store");
    try {
      if (!account) return;

      await this.service.createLock(
        account,
        stakePosition,
        unlockPeriod,
        this.rootStore.transactionStore
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in Creating Lock postion!"
      );
    }
  }

  async handleEarlyWithdrawal(account: string, lockId: number) {
    console.log("Running createLock from store");
    try {
      if (!account) return;

      await this.service.handleEarlyWithdrawal(
        account,
        lockId,
        this.rootStore.transactionStore
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in Early Withdrawal!"
      );
    }
  }

  async handleUnlock(account: string, lockId: number) {
    console.log("Running createLock from store");
    try {
      if (!account) return;

      await this.service.handleUnlock(
        account,
        lockId,
        this.rootStore.transactionStore
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in Unlock!"
      );
    }
  }

  async handleClaimRewards(account: string) {
    console.log("Running createLock from store");
    try {
      if (!account) return;
      await this.service.handleClaimRewards(
        account,
        1,
        this.rootStore.transactionStore
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in claiming rewards!"
      );
    }
  }

  async handleClaimRewardsSingle(account: string, lockId: number) {
    try {
      if (!account) return;
      await this.service.handleClaimRewardsSingle(
        account,
        lockId,
        this.rootStore.transactionStore
      );
    } catch (e) {
      const error = processRpcError(e);
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        error.reason || error.message
      );
    }
  };

  async handleWithdrawRewards(account: string){
    console.log("Running createLock from store");
    try {
      if (!account) return;
      await this.service.handleWithdrawRewards(
        account,
        1,
        this.rootStore.transactionStore
      );
    } catch (e) {
      const error = processRpcError(e);
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        error.reason || error.message
      );
    }
  };

  setLocks(_lockPositions: ILockPosition[]){
    this.lockPositions = _lockPositions;
  };

  setTotalStakedPosition(_lockPositions: ILockPosition[]) {
    this.totalStakedPosition = 0;
    for (let i = 0; i < _lockPositions.length; i++) {
      this.totalStakedPosition += _lockPositions[i].MAINTokenBalance;
    }
  }

  async fetchAPR() {
    console.log("fetching... APR");
    const apr = await this.service.getAPR();
    this.setAPR(apr);
  }

  setAPR(_apr: number) {
    this.apr = _apr;
  }

  setWalletBalance(_walletBalance: number) {
    this.walletBalance = _walletBalance;
  }

  async fetchWalletBalance(account: string) {
    try {
      const walletBalance = await this.service.getWalletBalance(account);
      this.setWalletBalance(walletBalance);
    } catch (e) {
      const error = processRpcError(e);

      this.rootStore.alertStore.setShowErrorAlert(
        true,
        error.reason || error.message
      );
    }
  }

  setVOTEBalance(_voteBalance: number) {
    this.voteBalance = _voteBalance;
  }

  async fetchVOTEBalance(account: string) {
    try {
      const voteBalance = await this.service.getVOTEBalance(account);
      this.setVOTEBalance(voteBalance);
    } catch (e) {
      const error = processRpcError(e);
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        error.reason || error.message
      );
    }
  }

  async fetchLocks(account: string) {
    try {
      const locks = await this.service.getLockPositions(account);
      runInAction(() => {
        this.setLocks(locks);
        this.setTotalStakedPosition(locks);
      });
    } catch (e) {
      const error = processRpcError(e);
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        error.reason || error.message
      );
    }
  }

  async fetchLatestLock(account: string) {
    console.log("......is fetch Latest Lock getting called before,.....");
    let lockId = await this.service.getLockPositionsLength(account);
    if (lockId > 0) {
      let lockPosition = await this.service.getLockInfo(lockId, account);
      if (lockPosition.MAINTokenBalance > 0) {
        this.lockPositions.push(lockPosition);
        this.setTotalStakedPosition(this.lockPositions);
      }
    }
  }

  async fetchLockPositionAfterUnlock(lockId: number) {
    let latestLockId = this.lockPositions.length;
    if (latestLockId > 1) {
      let lockPosition = this.lockPositions[latestLockId - 1];
      lockPosition.lockId = lockId;
      this.lockPositions[lockId - 1] = lockPosition;
      this.lockPositions.pop();
      this.setTotalStakedPosition(this.lockPositions);
    } else {
      this.lockPositions.pop();
    }
  }

  async fetchLocksAfterClaimAllRewards() {
    for (let i = 0; i < this.lockPositions.length; i++) {
      this.lockPositions[i].RewardsAvailable = "0";
    }
  }

  async approvalStatusStakingFTHM(address: string, stakingPosition: number) {
    console.log(`Checking FTHM approval status for address ${address}`);
    try {
      if (!address) return;

      return this.service.approvalStatusStakingFTHM(address, stakingPosition);
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error retreiving approval status"
      );
    }
  }

  async approveFTHM(address: string, chainId: number) {
    console.log(`Approving staking position for address ${address}`);
    try {
      if (!address) return;

      return this.service
        .approveStakingFTHM(address, this.rootStore.transactionStore)
        .then(() => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Token approval was successful"
          );
        });
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error approving the token!"
      );
      throw e;
    }
  }
}
