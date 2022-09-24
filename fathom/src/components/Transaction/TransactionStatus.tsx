//import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import {observer} from 'mobx-react'
import { Box, LinearProgress, Paper, Typography } from '@mui/material';
import { useStores } from '../../stores';


const TransactionStatus = observer(() => {
  let transactionStore = useStores().transactionStore



  return (
  <>
  { transactionStore.transactions.map(
                  (transaction, idx) =>
    <Paper
        sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 60,
        }}
        >
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                   Transaction {transaction.hash} is pending  
            </Typography>
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>                
    </Paper>
    )}
    </>
  );
})

export default TransactionStatus;
