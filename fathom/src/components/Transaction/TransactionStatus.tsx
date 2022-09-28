//import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import {observer} from 'mobx-react'
import { Alert, AlertTitle,LinearProgress, Typography } from '@mui/material';
import { useStores } from '../../stores';
import truncateEthAddress from 'truncate-eth-address'


const TransactionStatus = observer(() => {
  let transactionStore = useStores().transactionStore

  const getTxUrl = (txHash:string) =>{
    return `https://goerli.etherscan.io/tx/${txHash}`
  }

  return (
  <>
  { transactionStore.transactions.map(
                  (transaction, idx) =>

        <Alert severity="info" variant="filled">
            <AlertTitle>{transaction.title}</AlertTitle>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                {transaction.message} <strong>
                                <a target="_blank" href={getTxUrl(transaction.hash)} rel="noreferrer">
                                [{truncateEthAddress(transaction.hash)}]
                                </a>
                                </strong>
            </Typography>
            <LinearProgress />
        </Alert>
    )}
    </>
  );
})

export default TransactionStatus;
