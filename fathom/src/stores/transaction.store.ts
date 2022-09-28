import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IActiveWeb3TransactionsService from "../services/interfaces/IActiveWeb3TransactionsService";
import { ITransaction, TransactionStatus } from "./interfaces/ITransaction";
import { Constants } from "../helpers/Constants";

export default class ActiveWeb3Transactions {
  transactions: ITransaction[];
  service: IActiveWeb3TransactionsService;
  private fetchHandle: NodeJS.Timeout | null = null;

  constructor(rootStore: RootStore, service: IActiveWeb3TransactionsService) {
    makeAutoObservable(this);
    this.service = service;
    this.transactions = [];

    if (this.fetchHandle !== null) clearInterval(this.fetchHandle);
    this.fetchHandle = setInterval(
      this.checkTransactionStatus.bind(this),
      Constants.TransactionCheckUpdateInterval
    );
  }

  addTransaction(_transaction: ITransaction) {
    this.transactions.push(_transaction);
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
