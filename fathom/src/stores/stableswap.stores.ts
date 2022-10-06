import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IStableSwapService from "../services/interfaces/IStableSwapService";

export default class StableSwapStore {
  service: IStableSwapService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IStableSwapService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  swapToken = async (index: number, address: string, token: number) => {
    switch (index) {
      case 0: {
        try {
          console.log(
            `swapTokenToStablecoin for address : ${address} token: ${token}`
          );
          await this.service.swapTokenToStablecoin(
            address,
            token,
            this.rootStore.transactionStore
          );
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "USDT token swapped with FXD!"
          );
        } catch (error) {
          this.rootStore.alertStore.setShowErrorAlert(true);
        }
        break;
      }
      case 1: {
        try {
          console.log(
            `swapStablecoinToToken for address : ${address} token: ${token}`
          );
          await this.service.swapStablecoinToToken(
            address,
            token,
            this.rootStore.transactionStore
          );
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "FXD token swapped with USDT!"
          );
        } catch (error) {
          this.rootStore.alertStore.setShowErrorAlert(true);
        }
        break;
      }
      default: {
        console.log("Invalid option from stableswap module.");
        break;
      }
    }
  };

  approveStablecoin = async (address: string) => {
    console.log(`Open position token approval clicked for address ${address}`);
    try {
      if (!address) return;

      await this.service.approveStablecoin(
        address,
        this.rootStore.transactionStore
      );
      this.rootStore.alertStore.setShowSuccessAlert(
        true,
        "FXD approval was successful!"
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error approving the token!"
      );
      throw e;
    }
  };

  approveUsdt = async (address: string, tokenIn: number) => {
    console.log(`Approved USDT clicked for address ${address}`);
    try {
      if (address === undefined || address === null) return;

      await this.service.approveUsdt(
        address,
        tokenIn,
        this.rootStore.transactionStore
      );
      this.rootStore.alertStore.setShowSuccessAlert(
        true,
        "USDT approval was successful!"
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error approving the token!"
      );
      throw e;
    }
  };

  approvalStatusStablecoin = async (address: string, tokenIn: number) => {
    console.log(`Checking stablecoin approval status for address ${address}`);
    try {
      if (address === undefined || address === null) return;

      return await this.service.approvalStatusStablecoin(address, tokenIn);
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error approving the token!"
      );
    }
  };

  approvalStatusUsdt = async (address: string, tokenIn: number) => {
    console.log(`Checking usdt approval status for address ${address}`);
    try {
      if (address === undefined || address === null) return;

      return await this.service.approvalStatusUsdt(address, tokenIn);
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error approving the token!"
      );
    }
  };
}
