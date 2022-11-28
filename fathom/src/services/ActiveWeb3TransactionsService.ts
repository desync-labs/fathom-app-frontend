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
    const response = await Web3Utils.getWeb3Instance(
      this.chainId
    ).eth.getTransactionReceipt(pendingTransaction.hash);
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
