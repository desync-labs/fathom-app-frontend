import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IStakingService from "services/interfaces/IStakingService";
import Xdc3 from "xdc3";

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
    unlockPeriod: number,
    library: Xdc3,
  ): Promise<any> {
    try {
      return await this.service
        .createLock(
          account,
          stakePosition,
          unlockPeriod,
          this.rootStore.transactionStore,
          library,
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

  async handleEarlyWithdrawal(account: string, lockId: number, library: Xdc3): Promise<any> {
    try {
      return await this.service
        .handleEarlyWithdrawal(account, lockId, this.rootStore.transactionStore, library)
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

  async handleUnlock(
    account: string,
    lockId: number,
    amount: number,
    library: Xdc3,
  ): Promise<any> {
    try {
      return await this.service
        .handleUnlock(account, lockId, amount, this.rootStore.transactionStore, library)
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

  async handleClaimRewards(account: string, library: Xdc3): Promise<any> {
    try {
      return await this.service
        .handleClaimRewards(account, 0, this.rootStore.transactionStore, library)
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

  async handleWithdrawAll(account: string, library: Xdc3): Promise<any> {
    try {
      return await this.service
        .handleWithdrawAll(account, 1, this.rootStore.transactionStore, library)
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

  async getStreamClaimableAmountPerLock(account: string, lockId: number, library: Xdc3) {
    try {
      return await this.service.getStreamClaimableAmountPerLock(
        0,
        account,
        lockId,
        library,
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async getPairPrice(token0: string, token1: string, library: Xdc3) {
    try {
      return await this.service.getPairPrice(token0, token1, library);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async getStreamClaimableAmount(account: string, library: Xdc3) {
    try {
      return await this.service.getStreamClaimableAmount(account, library);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string,
    library: Xdc3,
  ) {
    try {
      return await this.service.approvalStatusStakingFTHM(
        address,
        stakingPosition,
        fthmTokenAddress,
        library,
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async approveFTHM(address: string, fthmTokenAddress: string, library: Xdc3) {
    try {
      return await this.service
        .approveStakingFTHM(
          address,
          fthmTokenAddress,
          this.rootStore.transactionStore,
          library
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
