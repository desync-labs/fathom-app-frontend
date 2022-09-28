import { ITransaction } from "../../stores/interfaces/ITransaction";

export default interface IActiveWeb3TransactionsService{
    checkTransactionStatus(pendingTransaction:ITransaction): Promise<ITransaction>;
}
