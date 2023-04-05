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
import Xdc3 from "xdc3";
import { getEstimateGas } from "utils/getEstimateGas";
import { TransactionReceipt } from "web3-eth";

export default class StableSwapService implements IStableSwapService {
  readonly tokenBuffer: number = 5;
  chainId = Constants.DEFAULT_CHAIN_ID;

  transactionStore: ActiveWeb3Transactions;

  constructor(transactionStore: ActiveWeb3Transactions) {
    this.transactionStore = transactionStore;
  }

  async swapTokenToStableCoin(
    account: string,
    tokenIn: number,
    tokenName: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined> {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      library
    );

    const options = { from: account, gas: 0 };
    const gas = await getEstimateGas(
      StableSwapModule,
      "swapTokenToStablecoin",
      [account, toWei(tokenIn.toString(), "ether")],
      options
    );
    options.gas = gas;

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
      });
  }

  async swapStableCoinToToken(
    account: string,
    tokenOut: number,
    tokenName: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined> {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      library
    );

    const options = { from: account, gas: 0 };
    const gas = await getEstimateGas(
      StableSwapModule,
      "swapStablecoinToToken",
      [account, toWei(tokenOut.toString(), "ether")],
      options
    );
    options.gas = gas;

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
      });
  }

  async approveStableCoin(
    account: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined> {
    const FathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      library
    );

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
      });
  }

  async approveUsdt(
    account: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined> {
    const USStable = Web3Utils.getContractInstance(
      SmartContractFactory.USDT(this.chainId),
      library
    );

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
      });
  }

  async approvalStatusStableCoin(
    account: string,
    tokenIn: number,
    library: Xdc3
  ): Promise<Boolean> {
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

    const buffer = Number(tokenIn) + Number((tokenIn * this.tokenBuffer) / 100);

    return Number(allowance) > Constants.WeiPerWad.multipliedBy(buffer).toNumber();
  }

  async approvalStatusUsdt(
    account: string,
    tokenIn: number,
    library: Xdc3
  ): Promise<boolean> {
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

    const buffer = Number(tokenIn) + Number((tokenIn * this.tokenBuffer) / 100);

    return Number(allowance) > Constants.WeiPerWad.multipliedBy(buffer).toNumber();
  }

  getFeeIn(library: Xdc3) {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      library
    );

    return StableSwapModule.methods.feeIn().call();
  }

  getFeeOut(library: Xdc3) {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      library
    );

    return StableSwapModule.methods.feeOut().call();
  }

  getLastUpdate(library: Xdc3) {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      library
    );

    return StableSwapModule.methods.lastUpdate().call();
  }

  getDailySwapLimit(library: Xdc3) {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      library
    );

    return StableSwapModule.methods.dailySwapLimit().call();
  }

  getPoolBalance(tokenAddress:string, library:Xdc3) {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      library
    );

    return StableSwapModule.methods.tokenBalance(tokenAddress).call()
  }

  isDecentralizedState(library: Xdc3) {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      library
    );

    return StableSwapModule.methods.isDecentralizedState().call();
  }

  isUserWhitelisted(address: string, library: Xdc3) {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      library
    );

    return StableSwapModule.methods.isUserWhitelisted(address).call();
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}