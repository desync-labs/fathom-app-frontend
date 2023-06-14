import Xdc3 from "xdc3";
import { SmartContractFactory } from "config/SmartContractFactory";
import {
  MAX_UINT256,
  DEFAULT_CHAIN_ID
} from "helpers/Constants";
import { Strings } from "helpers/Strings";
import { Web3Utils } from "helpers/Web3Utils";
import {
  TransactionStatus,
  TransactionType
} from "stores/interfaces/ITransaction";
import ActiveWeb3Transactions from "stores/transaction.store";
import IStableSwapService from "services/interfaces/IStableSwapService";
import { toWei } from "web3-utils";
import { getEstimateGas } from "utils/getEstimateGas";
import { TransactionReceipt } from "web3-eth";
import AlertStore from "stores/alert.stores";
import BigNumber from "bignumber.js";
import { SKIP_ERRORS } from "connectors/networks";

export default class StableSwapService implements IStableSwapService {
  chainId = DEFAULT_CHAIN_ID;

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
    tokenInDecimals: number,
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

        const formattedTokenAmount = BigNumber(tokenIn).multipliedBy(10 ** tokenInDecimals).toString();

        const gas = await getEstimateGas(
          StableSwapModule,
          "swapTokenToStablecoin",
          [account, formattedTokenAmount],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        StableSwapModule.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);

          }
        );

        return StableSwapModule.methods
          .swapTokenToStablecoin(account, formattedTokenAmount)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: `${tokenName} to FXD Swap Pending.`,
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            this.alertStore.setShowErrorAlert(true, e.message);
            reject(e);
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
    tokenOutDecimals: number,
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

        const formattedTokenAmount = toWei(tokenOut.toString(), "ether");

        const gas = await getEstimateGas(
          StableSwapModule,
          "swapStablecoinToToken",
          [account, formattedTokenAmount],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        StableSwapModule.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);

          }
        );

        return StableSwapModule.methods
          .swapStablecoinToToken(account, formattedTokenAmount)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: `FXD to ${tokenName} Swap Pending.`,
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            this.alertStore.setShowErrorAlert(true, e.message);
            reject(e);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  addLiquidity(amount: number, account: string, library: Xdc3) {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModuleWrapper(this.chainId),
          library
        );
        const MESSAGE = "Add Liquidity to Stable Swap";

        const options = { from: account, gas: 0 };

        const formattedTokenAmount = toWei(amount.toString(), "ether");

        const gas = await getEstimateGas(
          StableSwapModuleWrapper,
          "depositTokens",
          [formattedTokenAmount],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        StableSwapModuleWrapper.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        return StableSwapModuleWrapper.methods
          .depositTokens(formattedTokenAmount)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: "Add Liquidity to Stable Swap.",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            this.alertStore.setShowErrorAlert(true, e.message);
            reject(e);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  removeLiquidity(amount: number, account: string, library: Xdc3) {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModuleWrapper(this.chainId),
          library
        );
        const MESSAGE = "Remove Liquidity from Stable Swap";

        const options = { from: account, gas: 0 };

        const formattedTokenAmount = toWei(amount.toString(), "ether");

        const gas = await getEstimateGas(
          StableSwapModuleWrapper,
          "withdrawTokens",
          [formattedTokenAmount],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        StableSwapModuleWrapper.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        return StableSwapModuleWrapper.methods
          .withdrawTokens(formattedTokenAmount)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: "Remove Liquidity from Stable Swap.",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            this.alertStore.setShowErrorAlert(true, e.message);
            reject(e);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  approveStableCoin(account: string, library: Xdc3, isStableSwapWrapper: boolean = false): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomStableCoin = Web3Utils.getContractInstance(
          SmartContractFactory.FathomStableCoin(this.chainId),
          library
        );
        const MESSAGE = "FXD approval was successful!";

        const options = { from: account, gas: 0 };
        const approvalAddress = isStableSwapWrapper ?
          SmartContractFactory.StableSwapModuleWrapper(this.chainId).address :
          SmartContractFactory.StableSwapModule(this.chainId).address;

        const gas = await getEstimateGas(
          FathomStableCoin,
          "approve",
          [
            approvalAddress,
            MAX_UINT256
          ],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        FathomStableCoin.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        return FathomStableCoin.methods
          .approve(
            approvalAddress,
            MAX_UINT256
          )
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: "Approval Pending.",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            this.alertStore.setShowErrorAlert(true, e.message);
            reject(e);
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
    library: Xdc3,
    isStableSwapWrapper: boolean = false
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const USStable = Web3Utils.getContractInstance(
          SmartContractFactory.USDT(this.chainId),
          library
        );
        const MESSAGE = `${tokenName} approval was successful!`;

        const options = { from: account, gas: 0 };
        const approvalAddress = isStableSwapWrapper ?
          SmartContractFactory.StableSwapModuleWrapper(this.chainId).address :
          SmartContractFactory.StableSwapModule(this.chainId).address;

        const gas = await getEstimateGas(
          USStable,
          "approve",
          [
            approvalAddress,
            MAX_UINT256
          ],
          options
        );
        options.gas = gas;

        return USStable.methods
          .approve(
            approvalAddress,
            MAX_UINT256
          )
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: "Approval Pending",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            this.alertStore.setShowErrorAlert(true, e.message);
            reject(e);
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
    tokenInDecimal: number,
    library: Xdc3,
    isStableSwapWrapper: boolean = false
  ) {
    try {
      const FathomStableCoin = Web3Utils.getContractInstance(
        SmartContractFactory.FathomStableCoin(this.chainId),
        library
      );

      const allowance = await FathomStableCoin.methods
        .allowance(
          account,
          isStableSwapWrapper ?
            SmartContractFactory.StableSwapModuleWrapper(this.chainId).address :
            SmartContractFactory.StableSwapModule(this.chainId).address
        )
        .call();

      return BigNumber(allowance).isGreaterThanOrEqualTo(
        BigNumber(10 ** tokenInDecimal).multipliedBy(tokenIn)
      );
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async approvalStatusUsdt(
    account: string,
    tokenIn: number,
    tokenInDecimal: number,
    library: Xdc3,
    isStableSwapWrapper: boolean = false
  ) {
    try {
      const USStable = Web3Utils.getContractInstance(
        SmartContractFactory.USDT(this.chainId),
        library
      );

      const allowance = await USStable.methods
        .allowance(
          account,
          isStableSwapWrapper ?
            SmartContractFactory.StableSwapModuleWrapper(this.chainId).address :
            SmartContractFactory.StableSwapModule(this.chainId).address
        )
        .call();

      return BigNumber(allowance).isGreaterThanOrEqualTo(
        BigNumber(10 ** tokenInDecimal).multipliedBy(tokenIn)
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

  isDecentralizedState(library: Xdc3) {
    try {
      const StableSwapModule = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModule(this.chainId),
        library
      );
      return StableSwapModule.methods.isDecentralizedState().call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  isUserWhitelisted(address: string, library: Xdc3) {
    try {
      const StableSwapModule = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModule(this.chainId),
        library
      );
      return StableSwapModule.methods.isUserWhitelisted(address).call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  usersWrapperWhitelist(address: string, library: Xdc3) {
    try {
      const StableSwapModuleWrapper = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModuleWrapper(this.chainId),
        library
      );
      return StableSwapModuleWrapper.methods.usersWhitelist(address).call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getAmounts(amount: number, account: string, library: Xdc3) {
    try {
      const StableSwapModuleWrapper = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModuleWrapper(this.chainId),
        library
      );
      const formattedTokenAmount = toWei(amount.toString(), "ether");
      return StableSwapModuleWrapper.methods.getAmounts(formattedTokenAmount).call({
        from: account
      });
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getTotalValueLocked(library: Xdc3) {
    try {
      const StableSwapModule = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModule(this.chainId),
        library
      );
      return StableSwapModule.methods.totalValueLocked().call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getDepositTracker(account: string, library: Xdc3) {
    try {
      const StableSwapModuleWrapper = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModuleWrapper(this.chainId),
        library
      );
      return StableSwapModuleWrapper.methods.depositTracker(account).call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getActualLiquidityAvailablePerUser(account: string, library: Xdc3) {
    try {
      const StableSwapModuleWrapper = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModuleWrapper(this.chainId),
        library
      );
      return StableSwapModuleWrapper.methods.getActualLiquidityAvailablePerUser(account).call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}