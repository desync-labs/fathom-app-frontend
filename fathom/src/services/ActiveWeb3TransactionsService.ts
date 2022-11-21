import { Constants } from "helpers/Constants";
import { Web3Utils } from "helpers/Web3Utils";
import {
  ITransaction,
  TransactionStatus,
} from "stores/interfaces/ITransaction";
import IActiveWeb3TransactionsService from "services/interfaces/IActiveWeb3TransactionsService";

export default class ActiveWeb3TransactionsService
  implements IActiveWeb3TransactionsService
{
  chainId = Constants.DEFAULT_CHAIN_ID;
  async checkTransactionStatus(
    pendingTransaction: ITransaction
  ): Promise<ITransaction> {
    console.log(
      `Checking the transaction status for : ${pendingTransaction.hash}`
    );
    const response = await Web3Utils.getWeb3Instance(
      this.chainId
    ).eth.getTransactionReceipt(pendingTransaction.hash);
    console.log(
      `status for transaction: ${pendingTransaction.hash} is ${JSON.stringify(
        response
      )}`
    );
    if (response !== null) {
      pendingTransaction.status = response.status
        ? TransactionStatus.Success
        : TransactionStatus.Error;
    }

    return pendingTransaction;
  }

  setChainId(chainId: number) {
    if (chainId !== undefined) this.chainId = chainId;
  }
}
