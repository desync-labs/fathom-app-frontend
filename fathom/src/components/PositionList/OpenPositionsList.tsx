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
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { observer } from 'mobx-react';

const OpenPositionsList = observer(() => {
    let positionStore = useStores().positionStore;
    const { account } = useMetaMask()!
    let logger = useLogger();

    useEffect(() => {
        // Update the document title using the browser API
        logger.log(LogLevel.info,`fetching open positions. ${account}`);
        positionStore.fetchPositions(account);
    },[positionStore,account,logger]);

    const getFormattedSaftyBuffer = (safetyBuffer:BigNumber) => {
        return safetyBuffer.div(Constants.WeiPerWad).toString()
    }

    const handleClickClosePosition = (position:IOpenPosition) => {
        logger.log(LogLevel.info, 'Close position')
        positionStore.closePosition(position.id,account,position.debtShare.div(Constants.WeiPerWad).toNumber())
    };
   

  return (
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
              <TableCell align="right">USDT</TableCell>
              <TableCell align="right">{getFormattedSaftyBuffer(position.debtShare)}</TableCell>
              <TableCell align="right">
                    <Button variant="outlined" onClick={() => handleClickClosePosition(position)}>
                        Close
                    </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
})

export default OpenPositionsList;
