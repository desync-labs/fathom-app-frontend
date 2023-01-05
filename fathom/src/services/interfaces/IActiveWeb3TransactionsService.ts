import { ITransaction } from "stores/interfaces/ITransaction";
import Xdc3 from "xdc3";

export default interface IActiveWeb3TransactionsService{
    checkTransactionStatus(pendingTransaction:ITransaction, library: Xdc3): Promise<ITransaction>;
}
