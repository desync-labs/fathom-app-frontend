import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import { LogLevel, useLogger } from "helpers/Logger";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import BigNumber from "bignumber.js";
import { Constants } from "helpers/Constants";
import { observer } from "mobx-react";
import ClosePositionDialog from "components/Positions/ClosePositionDialog";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import {
  AppTableHeaderRow,
  AppTableRow,
} from "components/AppComponents/AppTable/AppTable";

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
        approvalStatus();
      });
    } else {
      positionStore.setPositions([]);
    }
  }, [positionStore, account, chainId, approvalStatus, logger]);

  const getFormattedSaftyBuffer = (safetyBuffer: BigNumber) => {
    return safetyBuffer.div(Constants.WeiPerWad).decimalPlaces(2).toString();
  };

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
              <AppTableHeaderRow
                sx={{
                  th: { textAlign: "left", paddingLeft: "10px" },
                }}
              >
                <TableCell>Position Id</TableCell>
                <TableCell>Pool</TableCell>
                <TableCell>FXD Borrowed</TableCell>
                <TableCell>Locked Collateral</TableCell>
                <TableCell>Locked Value</TableCell>
                <TableCell>LTV</TableCell>
                <TableCell></TableCell>
              </AppTableHeaderRow>
            </TableHead>
            <TableBody>
              {positionStore.positions.map((position: IOpenPosition) => (
                <AppTableRow
                  key={position.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    td: { paddingLeft: "10px", textAlign: "left" },
                  }}
                >
                  <TableCell component="td" scope="row">
                    {position.id}
                  </TableCell>
                  <TableCell>
                    {poolStore.getPool(position.pool)?.name}
                  </TableCell>
                  <TableCell>
                    {getFormattedSaftyBuffer(position.debtShare)} FXD
                  </TableCell>
                  <TableCell>
                    {getFormattedSaftyBuffer(position?.lockedCollateral)}{" "}
                    {poolStore.getPool(position.pool)?.name}
                  </TableCell>
                  <TableCell>
                    $ {getFormattedSaftyBuffer(position.lockedValue)}
                  </TableCell>
                  <TableCell>{position.ltv.toNumber() / 10}%</TableCell>
                  <TableCell>
                    <Grid container justifyContent="center">
                      {(approvalPending || approveBtn) && (
                        <Grid xs={7} item>
                          {approvalPending ? (
                            <Typography
                              display="inline"
                              sx={{ marginRight: 2 }}
                            >
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
                      )}
                      <Grid xs={3} item>
                        <ClosePositionDialog position={position} />
                      </Grid>
                    </Grid>
                  </TableCell>
                </AppTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AppPaper>
  );
});

export default OpenPositionsList;
