import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IStableSwapService from "../services/interfaces/IStableSwapService";
import { processRpcError } from "../utils/processRpcError";

export default class StableSwapStore {
  service: IStableSwapService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IStableSwapService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  async swapToken(inputCurrency: string, address: string, inputValue: number) {
    switch (true) {
      case inputCurrency === "USDT": {
        try {
          console.log(
            `swapTokenToStablecoin for address : ${address} token: ${inputValue}`
          );
          await this.service.swapTokenToStablecoin(
            address,
            inputValue,
            this.rootStore.transactionStore
          );
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "USDT token swapped with FXD!"
          );
        } catch (e) {
          const error = processRpcError(e);
          this.rootStore.alertStore.setShowErrorAlert(
            true,
            error.reason || error.message
          );
        }
        break;
      }
      case inputCurrency !== "USDT": {
        try {
          console.log(
            `swapStablecoinToToken for address : ${address} token: ${inputValue}`
          );
          await this.service.swapStablecoinToToken(
            address,
            inputValue,
            this.rootStore.transactionStore
          );
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "FXD token swapped with USDT!"
          );
        } catch (e) {
          const error = processRpcError(e);
          this.rootStore.alertStore.setShowErrorAlert(
            true,
            error.reason || error.message
          );
        }
        break;
      }
      default: {
        console.log("Invalid option from Stablecoin module.");
        break;
      }
    }
  }

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
      const error = processRpcError(e);
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        error.reason || error.message
      );
      throw e;
    }
  };

  approveUsdt = async (address: string) => {
    console.log(`Approved USDT clicked for address ${address}`);
    try {
      if (address === undefined || address === null) return;

      await this.service
        .approveUsdt(address, this.rootStore.transactionStore)
        .then(() => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "USDT approval was successful!"
          );
        });
    } catch (e) {
      const error = processRpcError(e);
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        error.reason || error.message
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
