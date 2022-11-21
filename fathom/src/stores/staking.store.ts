import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IStakingService from "services/interfaces/IStakingService";
import ILockPosition from "stores/interfaces/ILockPosition";

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
    try {
      if (!account) return;

      await this.service.createLock(
        account,
        stakePosition,
        unlockPeriod,
        this.rootStore.transactionStore
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        e.message
      );
    }
  }

  async handleEarlyWithdrawal(account: string, lockId: number) {
    try {
      if (!account) return;

      await this.service.handleEarlyWithdrawal(
        account,
        lockId,
        this.rootStore.transactionStore
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        e.message
      );
    }
  }

  async handleUnlock(account: string, lockId: number) {
    try {
      if (!account) return;

      await this.service.handleUnlock(
        account,
        lockId,
        this.rootStore.transactionStore
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        e.message
      );
    }
  }

  async handleClaimRewards(account: string) {
    try {
      if (!account) return;
      await this.service.handleClaimRewards(
        account,
        1,
        this.rootStore.transactionStore
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        e.message
      );
    }
  }

  async handleClaimRewardsSingle(account: string, lockId: number) {
    try {
      if (!account) return;
      await this.service.handleClaimRewardsSingle(
        account,
        1,
        lockId,
        this.rootStore.transactionStore
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        e.message
      );
    }
  }

  async handleWithdrawAll(account: string) {
    try {
      if (!account) return;
      await this.service.handleWithdrawAll(
        account,
        1,
        this.rootStore.transactionStore
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
         e.message
      );
    }
  }

  setLocks(_lockPositions: ILockPosition[]) {
    this.lockPositions = _lockPositions;
  }

  setTotalStakedPosition(_lockPositions: ILockPosition[]) {
    let totalStakedPosition = 0;
    for (let i = 0; i < _lockPositions.length; i++) {
      totalStakedPosition += _lockPositions[i].MAINTokenBalance;
    }

    this.totalStakedPosition = totalStakedPosition;
  }

  async fetchAPR() {
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
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        e.message
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
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        e.message
      );
    }
  }

  async fetchLocks(account: string) {
    try {
      const locks = await this.service.getLockPositions(account);
      this.setLocks(locks);
      this.setTotalStakedPosition(locks);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        e.message
      );
    }
  }

  async fetchLatestLock(account: string) {
    const lockId = await this.service.getLockPositionsLength(account);

    if (lockId > 0) {
      const lockPosition = await this.service.getLockInfo(lockId, account);
      if (lockPosition.MAINTokenBalance > 0) {
        this.lockPositions.push(lockPosition);
        this.setTotalStakedPosition(this.lockPositions);
      }
    }
  }

  fetchLockPositionAfterUnlock(lockId: number) {
    this.lockPositions = this.lockPositions.filter(
      (lockPosition) => lockPosition.lockId !== lockId
    );
  }

  fetchLocksAfterClaimAllRewards() {
    this.lockPositions = this.lockPositions.map((lockPosition) => {
      lockPosition.RewardsAvailable = "0";
      return lockPosition;
    });
  }

  fetchLockPositionAfterClaimReward(lockId: number) {
    this.lockPositions = this.lockPositions.map((lockPosition) => {
      if (lockPosition.lockId === lockId) {
        lockPosition.RewardsAvailable = "0";
      }
      return lockPosition;
    });
  }

  async approvalStatusStakingFTHM(address: string, stakingPosition: number) {
    console.log(`Checking FTHM approval status for address ${address}`);
    try {
      if (!address) return;
      return await this.service.approvalStatusStakingFTHM(address, stakingPosition);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        e.message
      );
    }
  }

  async approveFTHM(address: string) {
    console.log(`Approving staking position for address ${address}`);
    try {
      if (!address) return;

      await this.service
        .approveStakingFTHM(address, this.rootStore.transactionStore)
        .then(() => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Token approval was successful"
          );
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        e.message
      );
    }
  }
}
