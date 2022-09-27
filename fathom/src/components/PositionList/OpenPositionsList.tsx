import React, { useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { LogLevel, useLogger } from "../../helpers/Logger";
import IOpenPosition from "../../stores/interfaces/IOpenPosition";
import BigNumber from "bignumber.js";
import { Constants } from "../../helpers/Constants";
import { Button, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { observer } from "mobx-react";
import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import { UnsupportedChainIdError } from "@web3-react/core";

const OpenPositionsList = observer(() => {
  const rootStore = useStores();
  const positionStore = rootStore.positionStore;
  const poolStore = rootStore.poolStore;
  const { account, chainId, error } = useMetaMask()!;
  const logger = useLogger();
  const unsupportedError = useMemo(() => (error as Error) instanceof UnsupportedChainIdError, [error]);

  useEffect(() => {
    // Update the document title using the browser API
    if (chainId && (!error || !unsupportedError)) {
      logger.log(LogLevel.info, `fetching open positions. ${account}`);
      setTimeout(() => {
        positionStore.fetchPositions(account);
      });
    } else {
      positionStore.setPositions([]);
    }
  }, [positionStore, account, chainId, error, unsupportedError, logger]);

  const getFormattedSaftyBuffer = (safetyBuffer: BigNumber) => {
    return safetyBuffer.div(Constants.WeiPerWad).toString();
  };

  const handleClickClosePosition = (
    position: IOpenPosition,
    pool: ICollatralPool
  ) => {
    logger.log(LogLevel.info, "Close position");
    positionStore.closePosition(
      position.id,
      pool,
      account,
      position.debtShare.div(Constants.WeiPerWad).toNumber()
    );
  };

  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Open Positions
      </Typography>
      {positionStore.positions.length === 0 ? (
        <Typography variant="h6">No positions available</Typography>
      ) : (
        <TableContainer>
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
              {positionStore.positions.map((position: IOpenPosition) => (
                <TableRow
                  key={position.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {position.id}
                  </TableCell>
                  {/* <TableCell align="right">{row.address}</TableCell> */}
                  <TableCell align="right">
                    {poolStore.getPool(position.pool).name}
                  </TableCell>
                  <TableCell align="right">
                    {getFormattedSaftyBuffer(position.debtShare)}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleClickClosePosition(
                          position,
                          poolStore.getPool(position.pool)
                        )
                      }
                    >
                      Close
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
});

export default OpenPositionsList;
