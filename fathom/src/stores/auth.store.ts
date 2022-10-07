import { makeObservable, observable, action } from "mobx";
import { RootStore } from ".";

interface IUser {
  address: string;
  balance: string;
}

export default class AuthStore {
  authenticated: boolean;
  currentUser?: IUser;

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      authenticated: observable,
      currentUser: observable,
      authenticate: action,
    });
    this.authenticated = false;
    this.currentUser = undefined;
  }

  authenticate(_authenticated: boolean) {
    this.authenticated = _authenticated;
  }
}
