import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IStableSwapService from "services/interfaces/IStableSwapService";

export default class StableSwapStore {
  service: IStableSwapService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IStableSwapService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  async swapToken(inputCurrency: string, address: string, inputValue: number, tokenName: string): Promise<any> {
    if (inputCurrency === tokenName) {
      try {
        return await this.service
          .swapTokenToStableCoin(
            address,
            inputValue,
            this.rootStore.transactionStore
          )
          .then((receipt) => {
            this.rootStore.alertStore.setShowSuccessAlert(
              true,
              "USDT token swapped with FXD!"
            );
            return receipt;
          });
      } catch (e: any) {
        this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      }
    } else {
      try {
        return await this.service
          .swapStableCoinToToken(
            address,
            inputValue,
            this.rootStore.transactionStore
          )
          .then((receipt) => {
            this.rootStore.alertStore.setShowSuccessAlert(
              true,
              "FXD token swapped with USDT!"
            );
            return receipt;
          });
      } catch (e: any) {
        this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      }
    }
  }

  async approveStableCoin(address: string) {
    try {
      if (!address) return;

      await this.service.approveStableCoin(
        address,
        this.rootStore.transactionStore
      );
      this.rootStore.alertStore.setShowSuccessAlert(
        true,
        "FXD approval was successful!"
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async approveUsdt(address: string) {
    console.log(`Approved USDT clicked for address ${address}`);
    try {
      if (!address) return;

      await this.service
        .approveUsdt(address, this.rootStore.transactionStore)
        .then(() => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "USDT approval was successful!"
          );
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async approvalStatusStableCoin(address: string, tokenIn: number) {
    try {
      return await this.service.approvalStatusStablecoin(address, tokenIn);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async approvalStatusUsdt(address: string, tokenIn: number) {
    try {
      return await this.service.approvalStatusUsdt(address, tokenIn);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }
}
