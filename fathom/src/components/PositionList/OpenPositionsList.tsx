import React, { useEffect, useMemo } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useStores } from '../../stores';
import useMetaMask from '../../hooks/metamask';
import { LogLevel, useLogger } from '../../helpers/Logger';
import IOpenPosition from '../../stores/interfaces/IOpenPosition';
import BigNumber from 'bignumber.js';
import { Constants } from '../../helpers/Constants';
import { Button, Grid, Paper, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import ICollatralPool from '../../stores/interfaces/ICollatralPool';
import ClosePositionDialog from "../Positions/ClosePositionDialog";
import {
  UnsupportedChainIdError,
  useWeb3React
} from "@web3-react/core";

const OpenPositionsList = observer(() => {
    let positionStore = useStores().positionStore;
    let poolStore = useStores().poolStore;
    const { account } = useMetaMask()!
    let logger = useLogger();
    const { chainId, error } = useWeb3React()

    let [approveBtn, setApproveBtn] = React.useState(true);
    const unsupportedError = useMemo(() => (error as Error) instanceof UnsupportedChainIdError, [error]);



    useEffect(() => {
      if (chainId && (!error || !unsupportedError)) {
        setTimeout(() => {
          // Update the document title using the browser API
          logger.log(LogLevel.info,`fetching open positions. ${account}`);
          positionStore.fetchPositions(account);
          approvalStatus();
        })
      } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[positionStore, account, chainId, error, unsupportedError]);

    const [approvalPending, setApprovalPending] = React.useState(false);

    const approvalStatus = async () => {
      let approved = await positionStore.approvalStatusStablecoin(account)
      approved ? setApproveBtn(false) : setApproveBtn(true)
    }

    const getFormattedSaftyBuffer = (safetyBuffer:BigNumber) => {
        return safetyBuffer.div(Constants.WeiPerWad).toString()
    }

    const handleClickClosePosition = (position:IOpenPosition, pool: ICollatralPool) => {
        logger.log(LogLevel.info, 'Close position')
        positionStore.closePosition(position.id,pool,account,position.debtShare.div(Constants.WeiPerWad).toNumber())
    };
  
    const approve = async () => {
      setApprovalPending(true)
      try{
        await  positionStore.approveStablecoin(account)
        handleCloseApproveBtn()        
      } catch(e) {
        setApproveBtn(true)
      }
  
      setApprovalPending(false)
    }

    const handleCloseApproveBtn = () => {
      setApproveBtn(false)
    }

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Open Positions
      </Typography>
      {positionStore.positions.length === 0 ?
        <Typography variant='h6'>No positions available</Typography> :
        <TableContainer >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Position Id</TableCell>
                {/* <TableCell align="right">Address</TableCell> */}
                <TableCell align="right">Pool</TableCell>
                <TableCell align="right">FXD Borrowed</TableCell>
                <TableCell align="right">Locked Collateral</TableCell>
                <TableCell align="right">Locked Value</TableCell>
                <TableCell align="right">LTV</TableCell>
                <TableCell align="right">Close Position</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positionStore.positions.map((position: IOpenPosition) => (
                <TableRow
                  key={position.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {position.id}
                  </TableCell>
                  {/* <TableCell align="right">{row.address}</TableCell> */}
                  <TableCell align="right">{poolStore.getPool(position.pool).name}</TableCell>
                  <TableCell align="right">{getFormattedSaftyBuffer(position.debtShare)} FXD</TableCell>
                  <TableCell align="right">{getFormattedSaftyBuffer(position.lockedCollateral)} {poolStore.getPool(position.pool).name} </TableCell>
                  <TableCell align="right">$ {getFormattedSaftyBuffer(position.lockedValue)}</TableCell>
                  <TableCell align="right">{(position.ltv.toNumber() / 10)}%</TableCell>
                  <TableCell align="right">
                    <Grid container >
                     <Grid xs={7} > 
                        {approvalPending
                          ? <Typography display="inline" sx={{ marginRight: 2 }}>
                            Pending ...
                          </Typography>
                          : approveBtn
                            ? <Button variant="outlined" onClick={approve} sx={{ marginRight: 5 }}>
                              Approve FXD
                            </Button>
                            : null
                        }
                      </Grid>
                      <Grid xs={3}>
                        <ClosePositionDialog position={position} />
                      </Grid>
                    </Grid>
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

export default OpenPositionsList;