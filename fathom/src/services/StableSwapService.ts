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

export default class StableSwapService implements IStableSwapService {
  readonly tokenBuffer: number = 5;
  chainId = Constants.DEFAULT_CHAIN_ID;

  swapTokenToStableCoin(
    address: string,
    tokenIn: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.chainId
    );

    return StableSwapModule.methods
      .swapTokenToStablecoin(address, toWei(tokenIn.toString(), "ether"))
      .send({ from: address })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.ClosePosition,
          active: false,
          status: TransactionStatus.None,
          title: "USDT to FXD Swap Pending.",
          message: Strings.CheckOnBlockExplorer,
        });
      });
  }

  swapStableCoinToToken(
    address: string,
    stablecoinIn: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.chainId
    );

    return StableSwapModule.methods
      .swapStablecoinToToken(address, toWei(stablecoinIn.toString(), "ether"))
      .send({ from: address })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.ClosePosition,
          active: false,
          status: TransactionStatus.None,
          title: "FXD to USDT Swap Pending.",
          message: Strings.CheckOnBlockExplorer,
        });
      });
  }

  approveStableCoin(
    address: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const FathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      this.chainId
    );

    return FathomStableCoin.methods
      .approve(
        SmartContractFactory.StableSwapModule(this.chainId).address,
        Constants.MAX_UINT256
      )
      .send({ from: address })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.ClosePosition,
          active: false,
          status: TransactionStatus.None,
          title: "Approval Pending.",
          message: Strings.CheckOnBlockExplorer,
        });
      });
  }

  approveUsdt(
    address: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    const USDT = Web3Utils.getContractInstance(
      SmartContractFactory.USDT(this.chainId),
      this.chainId
    );

    return USDT.methods
      .approve(
        SmartContractFactory.AuthtokenAdapter(this.chainId).address,
        Constants.MAX_UINT256
      )
      .send({ from: address })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.ClosePosition,
          active: false,
          status: TransactionStatus.None,
          title: "Approval Pending",
          message: Strings.CheckOnBlockExplorer,
        });
      });
  }

  async approvalStatusStablecoin(
    address: string,
    tokenIn: number
  ): Promise<Boolean> {
    const FathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      this.chainId
    );

    const allowance = await FathomStableCoin.methods
      .allowance(
        address,
        SmartContractFactory.StableSwapModule(this.chainId).address
      )
      .call();

    const buffer = Number(tokenIn) + Number((tokenIn * this.tokenBuffer) / 100);

    return Number(allowance) > Number(Constants.WeiPerWad.multipliedBy(buffer));
  }

  async approvalStatusUsdt(address: string, tokenIn: number): Promise<Boolean> {
    const USDT = Web3Utils.getContractInstance(
      SmartContractFactory.USDT(this.chainId),
      this.chainId
    );

    const allowance = await USDT.methods
      .allowance(
        address,
        SmartContractFactory.AuthtokenAdapter(this.chainId).address
      )
      .call();

    const buffer = Number(tokenIn) + Number((tokenIn * this.tokenBuffer) / 100);

    return +allowance > +Constants.WeiPerWad.multipliedBy(buffer);
  }

  getFeeIn() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.chainId
    );

    return StableSwapModule.methods.feeIn().call();
  }

  getFeeOut() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.chainId
    );

    return StableSwapModule.methods.feeOut().call();
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
