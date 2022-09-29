import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { LogLevel, useLogger } from "../../helpers/Logger";
import { useCallback, useEffect } from "react";
import { observer } from "mobx-react";
import ILockPosition from "../../stores/interfaces/ILockPosition";

const StakingView = observer(() => {
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const rootStore = useStores();

  const stakingStore = rootStore.stakingStore;

  const fetchAll = useCallback(
    (account: string, chainId: number) => {
      console.log("HERRRRREEEE... fetcgALL");
      stakingStore.fetchLocks(account, chainId);
      stakingStore.fetchVOTEBalance(account, chainId);
      stakingStore.fetchWalletBalance(account, chainId);
      stakingStore.fetchAPR(chainId);
    },
    [stakingStore]
  );

  useEffect(() => {
    if (chainId) {
      logger.log(LogLevel.info, "fetching lock positions.");
      fetchAll(account, chainId);
      console.log("stakingStore.lockPositions: ");
      console.log(stakingStore.lockPositions);
    } else {
      stakingStore.setLocks([]);
    }
  }, [account, logger, stakingStore, chainId, fetchAll]);

  const createLock = useCallback(() => {
    stakingStore.createLock(account, 500, 365, chainId);
    fetchAll(account, chainId);
  }, [stakingStore, account, chainId, fetchAll]);

  const claimRewards = useCallback(() => {
    stakingStore.handleClaimRewards(account, chainId);
  }, [stakingStore, account, chainId]);

  const withdrawRewards = useCallback(() => {
    stakingStore.handleWithdrawRewards(account, chainId);
  }, [stakingStore, account, chainId]);

  const handleEarlyWithdrawal = useCallback(
    (lockId: number) => {
      stakingStore.handleEarlyWithdrawal(account, lockId, chainId);
    },
    [stakingStore, account, chainId]
  );

  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Proposals
      </Typography>
      <Button variant="outlined" onClick={() => createLock()}>
        Create Lock
      </Button>

      <Button variant="outlined" onClick={() => claimRewards()}>
        Claim Rewards
      </Button>

      <Button variant="outlined" onClick={() => withdrawRewards()}>
        Withdraw Rewards
      </Button>
      {stakingStore.lockPositions.length === 0 ? (
        <Typography variant="h6">No proposals available</Typography>
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Lock Position</TableCell>
                <TableCell>Vote Balance:</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stakingStore.lockPositions.map((lockPosition: ILockPosition) => (
                <TableRow
                  key={lockPosition.lockId}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {lockPosition.MAINTokenBalance}
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {lockPosition.VOTETokenBalance}
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

export default StakingView;
