import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { ITransaction, TransactionStatus } from "./interfaces/ITransaction";
import { Constants } from "../helpers/Constants";
import ActiveWeb3TransactionsService from "../services/ActiveWeb3TransactionsService";

export default class ActiveWeb3Transactions {
  transactions: ITransaction[];
  service: ActiveWeb3TransactionsService;
  private fetchHandle: NodeJS.Timeout | null = null;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: ActiveWeb3TransactionsService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
    this.transactions = [];

    if (this.fetchHandle !== null) clearInterval(this.fetchHandle);
    this.fetchHandle = setInterval(
      this.checkTransactionStatus.bind(this),
      Constants.TransactionCheckUpdateInterval
    );
  }

  addTransaction(_transaction: ITransaction) {
    this.transactions.push(_transaction);
    this.rootStore.alertStore.resetAlerts()
  }

  removeTransaction() {
    this.transactions.pop();
  }

  private async checkTransactionStatus(): Promise<void> {
    for (const transaction of this.transactions) {
      if (transaction !== undefined) {
        transaction.active = true;
        let tx = await this.service.checkTransactionStatus(transaction);
        if (tx.status !== TransactionStatus.None) {
          this.removeTransaction();
        }
      }
    }
  }
}
