import * as React from 'react';
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
import { Button, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import ICollatralPool from '../../stores/interfaces/ICollatralPool';



const OpenPositionsList = observer(() => {
    let positionStore = useStores().positionStore;
    let poolStore = useStores().poolStore;
    const { account } = useMetaMask()!
    let logger = useLogger();

    let [approveBtn, setApproveBtn] = React.useState(true);


    useEffect(() => {
        // Update the document title using the browser API
        logger.log(LogLevel.info,`fetching open positions. ${account}`);
        positionStore.fetchPositions(account);
        approvalStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[positionStore,account]);

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
            <TableCell align="right">Debt Share</TableCell>
            <TableCell align="right">Close Position</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positionStore.positions.map((position:IOpenPosition) => (
            <TableRow
              key={position.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {position.id}
              </TableCell>
              {/* <TableCell align="right">{row.address}</TableCell> */}
              <TableCell align="right">{poolStore.getPool(position.pool).name}</TableCell>
              <TableCell align="right">{getFormattedSaftyBuffer(position.debtShare)}</TableCell>
              <TableCell align="right">
                { approvalPending 
                  ? <Typography  display="inline" sx={{marginRight: 2}}>
                      Pending ...
                    </Typography>
                  : approveBtn
                  ? <Button variant="outlined" onClick={approve} sx={{marginRight: 2}}>
                      Approve FXD
                    </Button>
                  : null
                }
                <Button variant="outlined" disabled={approveBtn} onClick={() => handleClickClosePosition(position,poolStore.getPool(position.pool))}>
                    Close
                </Button>
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
