import { TransactionReceipt } from "web3-eth";
import { toWei } from "web3-utils";
import Xdc3 from "xdc3";
import BigNumber from "bignumber.js";

import { Constants } from "helpers/Constants";
import { Web3Utils } from "helpers/Web3Utils";
import { Strings } from "helpers/Strings";

import { SmartContractFactory } from "config/SmartContractFactory";
import IPositionService from "services/interfaces/IPositionService";

import ICollateralPool from "stores/interfaces/ICollateralPool";
import ActiveWeb3Transactions from "stores/transaction.store";
import AlertStore from "stores/alert.stores";

import {
  TransactionStatus,
  TransactionType,
} from "stores/interfaces/ITransaction";

import { getEstimateGas } from "utils/getEstimateGas";

export default class PositionService implements IPositionService {
  chainId = Constants.DEFAULT_CHAIN_ID;

  alertStore: AlertStore;
  transactionStore: ActiveWeb3Transactions;

  constructor(
    alertStore: AlertStore,
    transactionStore: ActiveWeb3Transactions
  ) {
    this.alertStore = alertStore;
    this.transactionStore = transactionStore;
  }

  openPosition(
    address: string,
    pool: ICollateralPool,
    collateral: string,
    fathomToken: string,
    library: Xdc3
  ): Promise<number | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.proxyWalletExist(address, library);

        if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address, library);
        }

        /**
         * Get Proxy Wallet
         */
        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          library
        );

        const encodedResult = library.eth.abi.encodeParameters(
          ["address"],
          [address]
        );

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId
        ).abi.filter((abi) => abi.name === "openLockXDCAndDraw")[0];

        const openPositionCall = library.eth.abi.encodeFunctionCall(
          jsonInterface,
          [
            SmartContractFactory.PositionManager(this.chainId).address,
            SmartContractFactory.StabilityFeeCollector(this.chainId).address,
            pool.tokenAdapterAddress,
            SmartContractFactory.StablecoinAdapter(this.chainId).address,
            pool.id,
            toWei(fathomToken.toString(), "ether"),
            encodedResult,
          ]
        );

        const options = {
          from: address,
          gas: 0,
          value: toWei(collateral.toString(), "ether"),
        };
        const gas = await getEstimateGas(
          wallet,
          "execute",
          [openPositionCall],
          options
        );
        options.gas = gas;
        /**
         * Block for XDC Pay.
         */
        wallet.events.allEvents(
          (_: any, transactionReceipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "New position opened successfully!"
            );
            resolve(transactionReceipt.blockNumber);
          }
        );

        wallet.methods
          .execute(openPositionCall)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.OpenPosition,
              active: false,
              status: TransactionStatus.None,
              title: `Opening Position Pending`,
              message: Strings.CheckOnBlockExplorer,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "New position opened successfully!"
            );

            resolve(receipt.blockNumber);
          });
      } catch (error: any) {
        this.alertStore.setShowErrorAlert(true, error.message);
        reject(error);
      }
    });
  }

  topUpPositionAndBorrow(
    address: string,
    pool: ICollateralPool,
    collateral: string,
    fathomToken: string,
    positionId: string,
    library: Xdc3
  ): Promise<number | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.proxyWalletExist(address, library);

        if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address, library);
        }

        /**
         * Get Proxy Wallet
         */
        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          library
        );

        const encodedResult = library.eth.abi.encodeParameters(
          ["address"],
          [address]
        );

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId
        ).abi.filter((abi) => abi.name === "lockXDCAndDraw")[0];

        const topUpPositionCall = library.eth.abi.encodeFunctionCall(
          jsonInterface,
          [
            SmartContractFactory.PositionManager(this.chainId).address,
            SmartContractFactory.StabilityFeeCollector(this.chainId).address,
            pool.tokenAdapterAddress,
            SmartContractFactory.StablecoinAdapter(this.chainId).address,
            positionId,
            fathomToken ? toWei(fathomToken.toString(), "ether") : 0,
            encodedResult,
          ]
        );

        const options = {
          from: address,
          gas: 0,
          value: collateral ? toWei(collateral, "ether") : 0,
        };
        const gas = await getEstimateGas(
          wallet,
          "execute",
          [topUpPositionCall],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        wallet.events.allEvents(
          (_: any, transactionReceipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "Top Up position successfully!"
            );
            resolve(transactionReceipt.blockNumber);
          }
        );

        wallet.methods
          .execute(topUpPositionCall)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.OpenPosition,
              active: false,
              status: TransactionStatus.None,
              title: `Top Up Position Pending`,
              message: Strings.CheckOnBlockExplorer,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "Top Up position successfully!"
            );
            resolve(receipt.blockNumber);
          });
      } catch (error: any) {
        this.alertStore.setShowErrorAlert(true, error.message);
        reject(error);
      }
    });
  }

  topUpPosition(
    address: string,
    pool: ICollateralPool,
    collateral: string,
    positionId: string,
    library: Xdc3
  ): Promise<number | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.proxyWalletExist(address, library);

        if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address, library);
        }

        /**
         * Get Proxy Wallet
         */
        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          library
        );

        const encodedResult = library.eth.abi.encodeParameters(
          ["address"],
          [address]
        );

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId
        ).abi.filter((abi) => abi.name === "lockXDC")[0];

        const topUpPositionCall = library.eth.abi.encodeFunctionCall(
          jsonInterface,
          [
            SmartContractFactory.PositionManager(this.chainId).address,
            pool.tokenAdapterAddress,
            positionId,
            encodedResult,
          ]
        );

        const options = {
          from: address,
          gas: 0,
          value: collateral ? toWei(collateral.toString(), "ether") : 0,
        };
        const gas = await getEstimateGas(
          wallet,
          "execute",
          [topUpPositionCall],
          options
        );
        options.gas = gas;
        /**
         * Block for XDC Pay.
         */
        wallet.events.allEvents(
          (_: any, transactionReceipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "Top Up position successfully!"
            );
            resolve(transactionReceipt.blockNumber);
          }
        );

        wallet.methods
          .execute(topUpPositionCall)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.OpenPosition,
              active: false,
              status: TransactionStatus.None,
              title: `Top Up Position Pending`,
              message: Strings.CheckOnBlockExplorer,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "Top Up position successfully!"
            );
            resolve(receipt.blockNumber);
          });
      } catch (error: any) {
        this.alertStore.setShowErrorAlert(true, error.message);
        reject(error);
      }
    });
  }

  async createProxyWallet(address: string, library: Xdc3): Promise<string> {
    try {
      const proxyWalletRegistry = Web3Utils.getContractInstance(
        SmartContractFactory.ProxyWalletRegistry(this.chainId),
        library
      );

      await proxyWalletRegistry.methods.build(address).send({ from: address });

      const proxyWallet = await proxyWalletRegistry.methods
        .proxies(address)
        .call();

      return proxyWallet;
    } catch (error: any) {
      this.alertStore.setShowErrorAlert(true, error.message);
      throw error;
    }
  }

  proxyWalletExist(address: string, library: Xdc3): Promise<string> {
    const proxyWalletRegistry = Web3Utils.getContractInstance(
      SmartContractFactory.ProxyWalletRegistry(this.chainId),
      library
    );

    return proxyWalletRegistry.methods.proxies(address).call();
  }

  closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    collateral: string,
    library: Xdc3
  ): Promise<number | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const proxyWalletAddress = await this.proxyWalletExist(
          address,
          library
        );
        const MESSAGE = 'Position repay successfully!';

        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          library
        );

        const encodedResult = library.eth.abi.encodeParameters(
          ["address"],
          [address]
        );

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId
        ).abi.filter((abi) => abi.name === "wipeAllAndUnlockXDC")[0];

        const wipeAllAndUnlockTokenCall = library.eth.abi.encodeFunctionCall(
          jsonInterface,
          [
            SmartContractFactory.PositionManager(this.chainId).address,
            pool.tokenAdapterAddress,
            SmartContractFactory.StablecoinAdapter(this.chainId).address,
            positionId,
            collateral,
            encodedResult,
          ]
        );

        const options = { from: address, gas: 0 };
        const gas = await getEstimateGas(
          wallet,
          "execute",
          [wipeAllAndUnlockTokenCall],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        wallet.events.allEvents(
          (_: any, transactionReceipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              MESSAGE,
            );
            resolve(transactionReceipt.blockNumber);
          }
        );

        wallet.methods
          .execute(wipeAllAndUnlockTokenCall)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: "Repay Position Pending.",
              message: Strings.CheckOnBlockExplorer,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              MESSAGE,
            );
            resolve(receipt.blockNumber);
          });
      } catch (error: any) {
        this.alertStore.setShowErrorAlert(true, error.message);
        reject(error);
      }
    });
  }

  partiallyClosePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    stableCoin: string,
    collateral: string,
    library: Xdc3
  ): Promise<number | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const proxyWalletAddress = await this.proxyWalletExist(
          address,
          library
        );
        const MESSAGE = "Position repay successfully!"

        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          library
        );

        const encodedResult = library.eth.abi.encodeParameters(
          ["address"],
          [address]
        );

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId
        ).abi.filter((abi) => abi.name === "wipeAndUnlockXDC")[0];

        const wipeAndUnlockTokenCall = library.eth.abi.encodeFunctionCall(
          jsonInterface,
          [
            SmartContractFactory.PositionManager(this.chainId).address,
            pool.tokenAdapterAddress,
            SmartContractFactory.StablecoinAdapter(this.chainId).address,
            positionId,
            collateral,
            stableCoin,
            encodedResult,
          ]
        );

        const options = { from: address, gas: 0 };
        const gas = await getEstimateGas(
          wallet,
          "execute",
          [wipeAndUnlockTokenCall],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        wallet.events.allEvents(
          (_: any, transactionReceipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              MESSAGE,
            );
            resolve(transactionReceipt.blockNumber);
          }
        );

        wallet.methods
          .execute(wipeAndUnlockTokenCall)
          .send({ from: address })
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: "Repay Position Pending.",
              message: Strings.CheckOnBlockExplorer,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              MESSAGE,
            );
            resolve(receipt.blockNumber);
          });
      } catch (error: any) {
        this.alertStore.setShowErrorAlert(true, error.message);
        reject(error);
      }
    });
  }

  approve(
    address: string,
    tokenAddress: string,
    library: Xdc3
  ): Promise<number | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.proxyWalletExist(address, library);

        if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address, library);
        }

        const BEP20 = Web3Utils.getContractInstance(
          SmartContractFactory.BEP20(tokenAddress),
          library
        );

        const options = { from: address, gas: 0 };
        const gas = await getEstimateGas(
          BEP20,
          "approve",
          [proxyWalletAddress, Constants.MAX_UINT256],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        BEP20.events.allEvents(
          (_: any, transactionReceipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "Approval was successful!"
            );
            resolve(transactionReceipt.blockNumber);
          }
        );

        BEP20.methods
          .approve(proxyWalletAddress, Constants.MAX_UINT256)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Approval Pending",
              message: Strings.CheckOnBlockExplorer,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "Approval was successful!"
            );
            resolve(receipt.blockNumber);
          });
      } catch (error: any) {
        this.alertStore.setShowErrorAlert(true, error.message);
        reject(error);
      }
    });
  }

  async approvalStatus(
    address: string,
    tokenAddress: string,
    collateral: string,
    library: Xdc3
  ): Promise<boolean> {
    const proxyWalletAddress = await this.proxyWalletExist(address, library);

    if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
      return false;
    }

    const BEP20 = Web3Utils.getContractInstance(
      SmartContractFactory.BEP20(tokenAddress),
      library
    );

    const allowance = await BEP20.methods
      .allowance(address, proxyWalletAddress)
      .call();

    return BigNumber(allowance).isGreaterThan(
      Constants.WeiPerWad.multipliedBy(collateral)
    );
  }

  approveStableCoin(
    address: string,
    library: Xdc3
  ): Promise<number | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.proxyWalletExist(address, library);

        if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address, library);
        }

        const fathomStableCoin = Web3Utils.getContractInstance(
          SmartContractFactory.FathomStableCoin(this.chainId),
          library
        );

        const options = { from: address, gas: 0 };
        const gas = await getEstimateGas(
          fathomStableCoin,
          "approve",
          [proxyWalletAddress, Constants.MAX_UINT256],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        fathomStableCoin.events.allEvents(
          (_: any, transactionReceipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "Token approval was successful!"
            );
            resolve(transactionReceipt.blockNumber);
          }
        );

        fathomStableCoin.methods
          .approve(proxyWalletAddress, Constants.MAX_UINT256)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: `Approval Pending`,
              message: Strings.CheckOnBlockExplorer,
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "Token approval was successful!"
            );
            resolve(receipt.blockNumber);
          });
      } catch (error: any) {
        this.alertStore.setShowErrorAlert(true, error.message);
        reject(error);
      }
    });
  }

  balanceStableCoin(address: string, library: Xdc3): Promise<string> {
    const fathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      library
    );

    return fathomStableCoin.methods.balanceOf(address).call();
  }

  async approvalStatusStableCoin(
    address: string,
    library: Xdc3
  ): Promise<boolean> {
    const proxyWalletAddress = await this.proxyWalletExist(address, library);

    if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
      return false;
    }

    const fathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      library
    );

    const allowance = await fathomStableCoin.methods
      .allowance(address, proxyWalletAddress)
      .call();

    return Number(allowance) > 10000000000000000;
  }

  async getDebtValue(
    debtShare: number,
    poolId: string,
    library: Xdc3
  ): Promise<string> {
    const poolConfigContract = Web3Utils.getContractInstance(
      SmartContractFactory.PoolConfig(this.chainId),
      library
    );

    const debtAccumulatedRate = await poolConfigContract.methods
      .getDebtAccumulatedRate(poolId)
      .call();

    const debtShareValue = BigNumber(debtShare)
      .multipliedBy(Constants.WeiPerWad)
      .integerValue(BigNumber.ROUND_CEIL);

    const debtValue =
      BigNumber(debtAccumulatedRate).multipliedBy(debtShareValue);

    return debtValue.dividedBy(Constants.WeiPerRad).toFixed();
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
