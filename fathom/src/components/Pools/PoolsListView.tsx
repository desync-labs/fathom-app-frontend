import { useEffect, useMemo } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useStores } from '../../stores';
import useMetaMask from '../../hooks/metamask';
import { LogLevel, useLogger } from '../../helpers/Logger';
import { Paper, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import ICollatralPool from '../../stores/interfaces/ICollatralPool';
import {
  UnsupportedChainIdError,
  useWeb3React
} from "@web3-react/core";
import CustomizedDialogs from "../Positions/OpenNewPositionDialog";

const PoolsListView = observer(() => {
    let poolStore = useStores().poolStore;
    const { account } = useMetaMask()!
    let logger = useLogger();
    const { chainId, error } = useWeb3React()
    const unsupportedError = useMemo(() => (error as Error) instanceof UnsupportedChainIdError, [error]);



    useEffect(() => {
      if (chainId && (!error || !unsupportedError)) {
        setTimeout(() => {
          // Update the document title using the browser API
          logger.log(LogLevel.info,`fetching open positions. ${account}`);
          poolStore.fetchPools();
        })
      } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[poolStore, account, chainId, error, unsupportedError]);


  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column',  height: 360}} >
      {/* <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Pools
      </Typography> */}
      {poolStore.pools.length === 0 ?
        <Typography variant='h6'>No Pool Available!</Typography> :
        <TableContainer >
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            {/* <TableHead>
              <TableRow>
                <TableCell align="left">Pool Info.</TableCell>
                <TableCell align="left">APR/APY</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead> */}
            <TableBody>
              {poolStore.pools.map((pool: ICollatralPool) => (
                <TableRow
                  key={pool.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left" style={{ verticalAlign: 'top' }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom> 
                        {pool.name}
                    </Typography>
                    <Typography  variant="body2"  > 
                         Available : {pool.availableFathom}
                    </Typography> 
                    <Typography  variant="body2"  > 
                         Borrowed : {pool.borrowedFathom}
                    </Typography> 
                  </TableCell>
                  <TableCell align="left">
                    <Typography  color="text.secondary" > 
                        Lending APR  : 2.60%
                    </Typography> 
                    <Typography  color="text.secondary" > 
                        Staking APR : 0.23%
                    </Typography> 
                    <Typography  color="text.secondary"  > 
                         Total APY : 1.04%
                    </Typography> 
                  </TableCell>
                  <TableCell align="left">
                    {pool.allowOpenPosition && <CustomizedDialogs pool={pool} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </Paper>
  );
})

export default PoolsListView;