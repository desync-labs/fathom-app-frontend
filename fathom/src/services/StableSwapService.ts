import { SmartContractFactory } from "../config/SmartContractFactory";
import { Constants } from "../helpers/Constants";
import { Web3Utils } from "../helpers/Web3Utils";
import {
  TransactionStatus,
  TransactionType,
} from "../stores/interfaces/ITransaction";
import ActiveWeb3Transactions from "../stores/transaction.store";
import IStableSwapService from "./interfaces/IStableSwapService";

export default class StableSwapService implements IStableSwapService {
  readonly tokenBuffer: number = 5;
  chainId = 1337;

  async swapTokenToStablecoin(
    address: string,
    tokenIn: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    try {
      console.log(
        `Performing swapTokenToStablecoin from address: ${address} amount: ${tokenIn}`
      );
      const USDT = Web3Utils.getContractInstance(SmartContractFactory.USDT, this.chainId);
      let buffer = Number(tokenIn) + Number((tokenIn * this.tokenBuffer) / 100);
      await USDT.methods
        .approve(
          SmartContractFactory.AuthtokenAdapter(this.chainId).address,
          Constants.WeiPerWad.multipliedBy(buffer)
        )
        .send({ from: address })
        .on("transactionHash", (hash: any) => {
          transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.ClosePosition,
            active: false,
            status: TransactionStatus.None,
            title: "Approval Pending",
            message: "Click on transaction to view on Etherscan.",
          });
        });

      const stableSwapModule = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModule(this.chainId),
        this.chainId
      );

      await stableSwapModule.methods
        .swapTokenToStablecoin(
          address,
          Constants.WeiPerWad.multipliedBy(tokenIn)
        )
        .send({ from: address })
        .on("transactionHash", (hash: any) => {
          transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.ClosePosition,
            active: false,
            status: TransactionStatus.None,
            title: "USDT to FXD Swap Pending.",
            message: "Click on transaction to view on Etherscan.",
          });
        });
    } catch (error) {
      console.error(`Error in swapTokenToStablecoin`);
      throw error;
    }
  }

  async swapStablecoinToToken(
    address: string,
    stablecoinIn: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    try {
      console.log(
        `Performing swapTokenToStablecoin from address: ${address} amount: ${stablecoinIn}`
      );
      const fathomStableCoin = Web3Utils.getContractInstance(
        SmartContractFactory.FathomStableCoin(this.chainId),
        this.chainId
      );
      const stableSwapModule = Web3Utils.getContractInstance(
        SmartContractFactory.StableSwapModule(this.chainId),
        this.chainId
      );

      let buffer =
        Number(stablecoinIn) + Number((stablecoinIn * this.tokenBuffer) / 100);

      await fathomStableCoin.methods
        .approve(
          SmartContractFactory.StableSwapModule(this.chainId).address,
          Constants.WeiPerWad.multipliedBy(buffer)
        )
        .send({ from: address })
        .on("transactionHash", (hash: any) => {
          transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.ClosePosition,
            active: false,
            status: TransactionStatus.None,
            title: "Approval Pending.",
            message: "Click on transaction to view on Etherscan.",
          });
        });

      await stableSwapModule.methods
        .swapStablecoinToToken(
          address,
          Constants.WeiPerWad.multipliedBy(stablecoinIn)
        )
        .send({ from: address })
        .on("transactionHash", (hash: any) => {
          transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.ClosePosition,
            active: false,
            status: TransactionStatus.None,
            title: "FXD to USDT Swap Pending.",
            message: "Click on transaction to view on Etherscan.",
          });
        });
    } catch (error) {
      console.error(`Error in swapStablecoinToToke ${error}`);
      throw error;
    }
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
