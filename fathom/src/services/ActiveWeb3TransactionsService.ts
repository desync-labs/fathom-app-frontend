import {
  ITransaction,
  TransactionStatus,
} from "stores/interfaces/ITransaction";
import IActiveWeb3TransactionsService from "services/interfaces/IActiveWeb3TransactionsService";
import Xdc3 from "xdc3";

export default class ActiveWeb3TransactionsService
  implements IActiveWeb3TransactionsService
{
  async checkTransactionStatus(
    pendingTransaction: ITransaction,
    library: Xdc3
  ): Promise<ITransaction> {
    const response = await library.eth.getTransactionReceipt(
      pendingTransaction.hash
    );
    if (response !== null) {
      pendingTransaction.status = response.status
        ? TransactionStatus.Success
        : TransactionStatus.Error;
    }

    return pendingTransaction;
  }
}
