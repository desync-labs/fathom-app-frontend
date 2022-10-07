import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { LogLevel, useLogger } from "../../helpers/Logger";
import IOpenPosition from "../../stores/interfaces/IOpenPosition";
import BigNumber from "bignumber.js";
import { Constants } from "../../helpers/Constants";
import { observer } from "mobx-react";
import ClosePositionDialog from "../Positions/ClosePositionDialog";
import { AppPaper } from "../AppPaper/AppPaper";

const OpenPositionsList = observer(() => {
  const positionStore = useStores().positionStore;
  const poolStore = useStores().poolStore;
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();

  const [approveBtn, setApproveBtn] = useState(true);
  const [approvalPending, setApprovalPending] = useState(false);

  const approvalStatus = useCallback(async () => {
    const approved = await positionStore.approvalStatusStablecoin(account);
    approved ? setApproveBtn(false) : setApproveBtn(true);
  }, [positionStore, account]);

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        // Update the document title using the browser API
        logger.log(LogLevel.info, `fetching open positions. ${account}`);
        positionStore.fetchPositions(account);
        approvalStatus();
      });
    } else {
      positionStore.setPositions([]);
    }
  }, [positionStore, account, chainId, approvalStatus, logger]);

  const getFormattedSaftyBuffer = (safetyBuffer: BigNumber) => {
    return safetyBuffer.div(Constants.WeiPerWad).decimalPlaces(2).toString();
  };

  // const handleClickClosePosition = (
  //   position: IOpenPosition,
  //   pool: ICollatralPool
  // ) => {
  //   logger.log(LogLevel.info, "Close position");
  //   positionStore.closePosition(
  //     position.id,
  //     pool,
  //     account,
  //     position.debtShare.div(Constants.WeiPerWad).toNumber()
  //   );
  // };

  const approve = async () => {
    setApprovalPending(true);
    try {
      await positionStore.approveStablecoin(account);
      handleCloseApproveBtn();
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  };

  const handleCloseApproveBtn = () => {
    setApproveBtn(false);
  };

  return (
    <AppPaper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
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
                    {getFormattedSaftyBuffer(position.debtShare)} FXD
                  </TableCell>
                  <TableCell align="right">
                    {getFormattedSaftyBuffer(position.lockedCollateral)}{" "}
                    {poolStore.getPool(position.pool).name}{" "}
                  </TableCell>
                  <TableCell align="right">
                    $ {getFormattedSaftyBuffer(position.lockedValue)}
                  </TableCell>
                  <TableCell align="right">
                    {position.ltv.toNumber() / 10}%
                  </TableCell>
                  <TableCell align="right">
                    <Grid container>
                      <Grid xs={7}>
                        {approvalPending ? (
                          <Typography display="inline" sx={{ marginRight: 2 }}>
                            Pending ...
                          </Typography>
                        ) : approveBtn ? (
                          <Button
                            variant="outlined"
                            onClick={approve}
                            sx={{ marginRight: 5 }}
                          >
                            Approve FXD
                          </Button>
                        ) : null}
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
      )}
    </AppPaper>
  );
});

export default OpenPositionsList;
