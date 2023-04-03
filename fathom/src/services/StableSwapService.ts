import Xdc3 from "xdc3";
import { SmartContractFactory } from "config/SmartContractFactory";
import { Constants } from "helpers/Constants";
import { Strings } from "helpers/Strings";
import { Web3Utils } from "helpers/Web3Utils";
import {
  TransactionStatus,
  TransactionType,
} from "stores/interfaces/ITransaction";
import ActiveWeb3Transactions from "stores/transaction.store";
import IStableSwapService from "services/interfaces/IStableSwapService";
import { toWei } from "web3-utils";
import { getEstimateGas } from "utils/getEstimateGas";
import { TransactionReceipt } from "web3-eth";
import AlertStore from "stores/alert.stores";
import BigNumber from "bignumber.js";

export default class StableSwapService implements IStableSwapService {
  readonly tokenBuffer: number = 5;
  chainId = Constants.DEFAULT_CHAIN_ID;

  transactionStore: ActiveWeb3Transactions;
  alertStore: AlertStore;

  constructor(
    alertStore: AlertStore,
    transactionStore: ActiveWeb3Transactions
  ) {
    this.alertStore = alertStore;
    this.transactionStore = transactionStore;
  }

  swapTokenToStableCoin(
    account: string,
    tokenIn: number,
    tokenName: string,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModule = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModule(this.chainId),
          library
        );
        const MESSAGE = `${tokenName} token swapped with FXD!`;

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          StableSwapModule,
          "swapTokenToStablecoin",
          [account, toWei(tokenIn.toString(), "ether")],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        StableSwapModule.events.allEvents(
          (_: any, transactionReceipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        return StableSwapModule.methods
          .swapTokenToStablecoin(account, toWei(tokenIn.toString(), "ether"))
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: `${tokenName} to FXD Swap Pending.`,
              message: Strings.CheckOnBlockExplorer,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  swapStableCoinToToken(
    account: string,
    tokenOut: number,
    tokenName: string,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModule = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModule(this.chainId),
          library
        );
        const MESSAGE = `FXD token swapped with ${tokenName}!`;

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          StableSwapModule,
          "swapStablecoinToToken",
          [account, toWei(tokenOut.toString(), "ether")],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        StableSwapModule.events.allEvents(
          (_: any, transactionReceipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        return StableSwapModule.methods
          .swapStablecoinToToken(account, toWei(tokenOut.toString(), "ether"))
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: `FXD to ${tokenName} Swap Pending.`,
              message: Strings.CheckOnBlockExplorer,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  approveStableCoin(account: string, library: Xdc3): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomStableCoin = Web3Utils.getContractInstance(
          SmartContractFactory.FathomStableCoin(this.chainId),
          library
        );
        const MESSAGE = "FXD approval was successful!";

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          FathomStableCoin,
          "approve",
          [
            SmartContractFactory.StableSwapModule(this.chainId).address,
            Constants.MAX_UINT256,
          ],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        FathomStableCoin.events.allEvents(
          (_: any, transactionReceipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        return FathomStableCoin.methods
          .approve(
            SmartContractFactory.StableSwapModule(this.chainId).address,
            Constants.MAX_UINT256
          )
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: "Approval Pending.",
              message: Strings.CheckOnBlockExplorer,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  async approveUsdt(
    account: string,
    tokenName: string,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const USStable = Web3Utils.getContractInstance(
          SmartContractFactory.USDT(this.chainId),
          library
        );
        const MESSAGE = `${tokenName} approval was successful!`;

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          USStable,
          "approve",
          [
            SmartContractFactory.StableSwapModule(this.chainId).address,
            Constants.MAX_UINT256,
          ],
          options
        );
        options.gas = gas;

        return USStable.methods
          .approve(
            SmartContractFactory.StableSwapModule(this.chainId).address,
            Constants.MAX_UINT256
          )
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: "Approval Pending",
              message: Strings.CheckOnBlockExplorer,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  async approvalStatusStableCoin(
    account: string,
    tokenIn: number,
    library: Xdc3
  ) {
    try {
      const FathomStableCoin = Web3Utils.getContractInstance(
        SmartContractFactory.FathomStableCoin(this.chainId),
        library
      );

      const allowance = await FathomStableCoin.methods
        .allowance(
          account,
          SmartContractFactory.StableSwapModule(this.chainId).address
        )
        .call();

      const buffer = BigNumber(tokenIn).plus(
        BigNumber(tokenIn).multipliedBy(this.tokenBuffer).dividedBy(100)
      );
      return BigNumber(allowance).isGreaterThan(
        Constants.WeiPerWad.multipliedBy(buffer)
      );
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async approvalStatusUsdt(
    account: string,
    tokenIn: number,
    library: Xdc3
  ) {
    try {
      const USStable = Web3Utils.getContractInstance(
        SmartContractFactory.USDT(this.chainId),
        library
      );

      const allowance = await USStable.methods
        .allowance(
          account,
          SmartContractFactory.StableSwapModule(this.chainId).address
        )
        .call();

      const buffer = BigNumber(tokenIn).plus(
        BigNumber(tokenIn).multipliedBy(this.tokenBuffer).dividedBy(100)
      );
      return BigNumber(allowance).isGreaterThan(
        Constants.WeiPerWad.multipliedBy(buffer)
      );
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getFeeIn(library: Xdc3) {
    try {
      const StableSwapModule = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModule(this.chainId),
        library
      );

      return StableSwapModule.methods.feeIn().call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getFeeOut(library: Xdc3) {
    try {
      const StableSwapModule = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModule(this.chainId),
        library
      );
      return StableSwapModule.methods.feeOut().call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getLastUpdate(library: Xdc3) {
    try {
      const StableSwapModule = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModule(this.chainId),
        library
      );
      return StableSwapModule.methods.lastUpdate().call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getDailySwapLimit(library: Xdc3) {
    try {
      const StableSwapModule = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModule(this.chainId),
        library
      );

      return StableSwapModule.methods.dailySwapLimit().call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getPoolBalance(tokenAddress: string, library: Xdc3) {
    try {
      const StableSwapModule = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModule(this.chainId),
        library
      );

      return StableSwapModule.methods.tokenBalance(tokenAddress).call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
