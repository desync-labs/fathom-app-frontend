import { makeObservable, observable, action } from 'mobx';

interface IUser{
    address: string;
    balance: string;
}

export default class AuthStore{
    authenticated: boolean;
    currentUser?:IUser;

    constructor() {
        makeObservable(this, {
            authenticated: observable,
            currentUser: observable,
            authenticate: action,
        })
        this.authenticated = false
        this.currentUser = undefined;
    }

    authenticate(_authenticated: boolean) {
        this.authenticated = _authenticated;
    }
}