import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IStakingService from "services/interfaces/IStakingService";

export default class StakingStore {
  service: IStakingService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IStakingService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  async createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number
  ): Promise<any> {
    try {
      return await this.service
        .createLock(
          account,
          stakePosition,
          unlockPeriod,
          this.rootStore.transactionStore
        )
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Lock position created successfully!"
          );
          return receipt;
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async handleEarlyWithdrawal(account: string, lockId: number): Promise<any> {
    try {
      await this.service
        .handleEarlyWithdrawal(account, lockId, this.rootStore.transactionStore)
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Early withdrawal created successfully!"
          );
          return receipt;
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async handleUnlock(account: string, lockId: number): Promise<any> {
    try {
      return await this.service
        .handleUnlock(account, lockId, this.rootStore.transactionStore)
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Position unlock was successful!"
          );
          return receipt;
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async handleClaimRewards(account: string): Promise<any> {
    try {
      return await this.service
        .handleClaimRewards(account, 1, this.rootStore.transactionStore)
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Claim Rewards was successful!"
          );
          return receipt;
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async handleWithdrawAll(account: string): Promise<any> {
    try {
      return await this.service
        .handleWithdrawAll(account, 1, this.rootStore.transactionStore)
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Withdraw all was successful!"
          );

          return receipt;
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async getStreamClaimableAmountPerLock(account: string, lockId: number) {
    try {
      return await this.service.getStreamClaimableAmountPerLock(
        0,
        account,
        lockId
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async getStreamClaimableAmount(account: string) {
    try {
      return await this.service.getStreamClaimableAmount(account);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string
  ) {
    try {
      return await this.service.approvalStatusStakingFTHM(
        address,
        stakingPosition,
        fthmTokenAddress
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async approveFTHM(address: string, fthmTokenAddress: string) {
    try {
      return await this.service
        .approveStakingFTHM(
          address,
          fthmTokenAddress,
          this.rootStore.transactionStore
        )
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Token approval was successful"
          );

          return receipt;
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }
}
