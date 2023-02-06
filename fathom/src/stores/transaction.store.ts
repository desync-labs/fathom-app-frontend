import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { ITransaction, TransactionStatus } from "stores/interfaces/ITransaction";
import { Constants } from "helpers/Constants";
import Xdc3 from "xdc3";

export default class ActiveWeb3Transactions {
  transactions: ITransaction[];
  fetchHandle: NodeJS.Timeout | null = null;
  rootStore: RootStore;
  library?: Xdc3;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.transactions = [];

    if (this.fetchHandle !== null) clearInterval(this.fetchHandle);
    this.fetchHandle = setInterval(
      () => this.checkTransactionStatus(this.library!),
      Constants.TransactionCheckUpdateInterval
    );
  }

  addTransaction(_transaction: ITransaction) {
    this.transactions = [...this.transactions, _transaction];
    this.rootStore.alertStore.resetAlerts();
  }

  removeTransaction() {
    this.transactions.splice(-1);
    this.transactions = [...this.transactions];
  }

  setLibrary(library: Xdc3) {
    this.library = library;
  }

  async checkStatus(
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

  private async checkTransactionStatus(library: Xdc3): Promise<void> {
    for (const transaction of this.transactions) {
      if (transaction !== undefined) {
        transaction.active = true;
        const tx = await this.checkStatus(transaction, library);
        if (tx.status !== TransactionStatus.None) {
          this.removeTransaction();
        }
      }
    }
  }
}
