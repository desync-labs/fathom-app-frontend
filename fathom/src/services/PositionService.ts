import { Constants } from "helpers/Constants";
import { Web3Utils } from "helpers/Web3Utils";
import { Strings } from "helpers/Strings";

import { SmartContractFactory } from "config/SmartContractFactory";
import IPositionService from "services/interfaces/IPositionService";
import IOpenPosition from "stores/interfaces/IOpenPosition";

import ICollateralPool from "stores/interfaces/ICollateralPool";
import ActiveWeb3Transactions from "stores/transaction.store";
import {
  TransactionStatus,
  TransactionType,
} from "stores/interfaces/ITransaction";

import { toWei } from "web3-utils";

export default class PositionService implements IPositionService {
  chainId = Constants.DEFAULT_CHAIN_ID;

  openPosition(
    address: string,
    pool: ICollateralPool,
    collateral: number,
    fathomToken: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.proxyWalletExist(address);

        if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }

        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.chainId
        );

        const encodedResult = Web3Utils.getWeb3Instance(
          this.chainId
        ).eth.abi.encodeParameters(["address"], [address]);

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId
        ).abi.filter((abi) => abi.name === "openLockTokenAndDraw")[0];

        const openPositionCall = Web3Utils.getWeb3Instance(
          this.chainId
        ).eth.abi.encodeFunctionCall(jsonInterface, [
          SmartContractFactory.PositionManager(this.chainId).address,
          SmartContractFactory.StabilityFeeCollector(this.chainId).address,
          pool.tokenAdapterAddress,
          SmartContractFactory.StablecoinAdapter(this.chainId).address,
          pool.id,
          toWei(collateral.toString(), "ether"),
          toWei(fathomToken.toString(), "ether"),
          "1",
          encodedResult,
        ]);

        await wallet.methods
          .execute2(
            SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
              .address,
            openPositionCall
          )
          .send({ from: address })
          .on("transactionHash", (hash: any) => {
            transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.OpenPosition,
              active: false,
              status: TransactionStatus.None,
              title: `Opening Position Pending`,
              message: Strings.CheckOnBlockExplorer,
            });
          });

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  createProxyWallet(address: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const proxyWalletRegistry = Web3Utils.getContractInstance(
          SmartContractFactory.ProxyWalletRegistry(this.chainId),
          this.chainId
        );

        await proxyWalletRegistry.methods
          .build(address)
          .send({ from: address });

        const proxyWallet = await proxyWalletRegistry.methods
          .proxies(address)
          .call();

        return resolve(proxyWallet);
      } catch (error) {
        reject(error);
      }
    });
  }

  proxyWalletExist(address: string): Promise<string> {
    const proxyWalletRegistry = Web3Utils.getContractInstance(
      SmartContractFactory.ProxyWalletRegistry(this.chainId),
      this.chainId
    );

    return proxyWalletRegistry.methods.proxies(address).call();
  }

  closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    collateral: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const proxyWalletAddress = await this.proxyWalletExist(address);

        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.chainId
        );

        const encodedResult = Web3Utils.getWeb3Instance(
          this.chainId
        ).eth.abi.encodeParameters(["address"], [address]);

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId
        ).abi.filter((abi) => abi.name === "wipeAllAndUnlockToken")[0];

        const wipeAllAndUnlockTokenCall = Web3Utils.getWeb3Instance(
          this.chainId
        ).eth.abi.encodeFunctionCall(jsonInterface, [
          SmartContractFactory.PositionManager(this.chainId).address,
          pool.tokenAdapterAddress,
          SmartContractFactory.StablecoinAdapter(this.chainId).address,
          positionId,
          toWei(collateral.toString(), "ether"),
          encodedResult,
        ]);

        await wallet.methods
          .execute2(
            SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
              .address,
            wipeAllAndUnlockTokenCall
          )
          .send({ from: address })
          .on("transactionHash", (hash: any) => {
            transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: "Close Position Pending.",
              message: Strings.CheckOnBlockExplorer,
            });
          });

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async partiallyClosePosition(
    position: IOpenPosition,
    pool: ICollateralPool,
    address: string,
    stableCoin: number,
    collateral: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const proxyWalletAddress = await this.proxyWalletExist(address);

        const wallet = Web3Utils.getContractInstanceFrom(
          SmartContractFactory.proxyWallet.abi,
          proxyWalletAddress,
          this.chainId
        );

        const encodedResult = Web3Utils.getWeb3Instance(
          this.chainId
        ).eth.abi.encodeParameters(["address"], [address]);

        const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
          this.chainId
        ).abi.filter((abi) => abi.name === "wipeAndUnlockToken")[0];

        const wipeAndUnlockTokenCall = Web3Utils.getWeb3Instance(
          this.chainId
        ).eth.abi.encodeFunctionCall(jsonInterface, [
          SmartContractFactory.PositionManager(this.chainId).address,
          pool.tokenAdapterAddress,
          SmartContractFactory.StablecoinAdapter(this.chainId).address,
          position.id,
          toWei(collateral.toString(), "ether"),
          toWei(stableCoin.toString(), "ether"),
          encodedResult,
        ]);

        await wallet.methods
          .execute2(
            SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
              .address,
            wipeAndUnlockTokenCall
          )
          .send({ from: address })
          .on("transactionHash", (hash: any) => {
            transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.ClosePosition,
              active: false,
              status: TransactionStatus.None,
              title: "Close Position Pending.",
              message: Strings.CheckOnBlockExplorer,
            });
          });

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  approve(
    address: string,
    tokenAddress: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxyWalletAddress = await this.proxyWalletExist(address);

        if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
          proxyWalletAddress = await this.createProxyWallet(address);
        }

        const BEP20 = Web3Utils.getContractInstance(
          SmartContractFactory.BEP20(tokenAddress),
          this.chainId
        );

        await BEP20.methods
          .approve(proxyWalletAddress, Constants.MAX_UINT256)
          .send({ from: address })
          .on("transactionHash", (hash: any) => {
            transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: `Approval Pending`,
              message: Strings.CheckOnBlockExplorer,
            });
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async approvalStatus(
    address: string,
    tokenAddress: string,
    collateral: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<Boolean> {
    collateral = collateral || 0;

    const proxyWalletAddress = await this.proxyWalletExist(address);

    if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
      return false;
    }

    const BEP20 = Web3Utils.getContractInstance(
      SmartContractFactory.BEP20(tokenAddress),
      this.chainId
    );

    const allowance = await BEP20.methods
      .allowance(address, proxyWalletAddress)
      .call();

    return (
      Number(allowance) > Number(Constants.WeiPerWad.multipliedBy(collateral))
    );
  }

  async approveStableCoin(
    address: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    let proxyWalletAddress = await this.proxyWalletExist(address);

    if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
      proxyWalletAddress = await this.createProxyWallet(address);
    }

    const fathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      this.chainId
    );

    return fathomStableCoin.methods
      .approve(proxyWalletAddress, Constants.MAX_UINT256)
      .send({ from: address })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.Approve,
          active: false,
          status: TransactionStatus.None,
          title: `Approval Pending`,
          message: Strings.CheckOnBlockExplorer,
        });
      });
  }

  balanceStableCoin(address: string): Promise<number> {
    const fathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      this.chainId
    );

    return fathomStableCoin.methods.balanceOf(address).call();
  }

  async approvalStatusStableCoin(address: string): Promise<Boolean> {
    const proxyWalletAddress = await this.proxyWalletExist(address);

    if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
      return false;
    }

    const fathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      this.chainId
    );

    const allowance = await fathomStableCoin.methods
      .allowance(address, proxyWalletAddress)
      .call();

    return +allowance > 10000000000000000;
  }

  setChainId(chainId: number) {
    if (chainId !== undefined) this.chainId = chainId;
  }
}
