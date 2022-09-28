import { Web3Utils } from "../helpers/Web3Utils";
import { ITransaction } from "../stores/interfaces/ITransaction";
import IActiveWeb3TransactionsService from "./interfaces/IActiveWeb3TransactionsService";

export default class ActiveWeb3TransactionsService implements IActiveWeb3TransactionsService{
    
    async checkTransactionStatus(pendingTransaction: ITransaction): Promise<ITransaction> {
        console.log(`Checking the transaction status for : ${pendingTransaction.hash}`)
        let response = await Web3Utils.getWeb3Instance().eth.getTransactionReceipt(pendingTransaction.hash)
        console.log(`status for transaction: ${pendingTransaction.hash} is ${JSON.stringify(response)}`)
        if(response !== null){
            pendingTransaction.status = response.status;
        }

        return pendingTransaction;
    }

}