import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { ITransaction, TransactionStatus } from "stores/interfaces/ITransaction";
import { Constants } from "helpers/Constants";
import ActiveWeb3TransactionsService from "services/ActiveWeb3TransactionsService";
import Xdc3 from "xdc3";

export default class ActiveWeb3Transactions {
  transactions: ITransaction[];
  service: ActiveWeb3TransactionsService;
  fetchHandle: NodeJS.Timeout | null = null;
  rootStore: RootStore;
  library?: Xdc3;

  constructor(rootStore: RootStore, service: ActiveWeb3TransactionsService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
    this.transactions = [];

    if (this.fetchHandle !== null) clearInterval(this.fetchHandle);
    this.fetchHandle = setInterval(
      () => this.checkTransactionStatus(this.library!),
      Constants.TransactionCheckUpdateInterval
    );
  }

  addTransaction(_transaction: ITransaction) {
    this.transactions.push(_transaction);
    this.rootStore.alertStore.resetAlerts();
  }

  removeTransaction() {
    this.transactions.pop();
  }

  setLibrary(library: Xdc3) {
    this.library = library;
  }

  private async checkTransactionStatus(library: Xdc3): Promise<void> {
    for (const transaction of this.transactions) {
      if (transaction !== undefined) {
        transaction.active = true;
        let tx = await this.service.checkTransactionStatus(transaction, library);
        if (tx.status !== TransactionStatus.None) {
          this.removeTransaction();
        }
      }
    }
  }
}
