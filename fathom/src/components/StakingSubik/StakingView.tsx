import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Container,
  Paper,
  Toolbar,
  Typography,
  Button
} from "@mui/material";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { LogLevel, useLogger } from "../../helpers/Logger";
import { useEffect } from "react";
import { observer } from "mobx-react";
import AlertMessages from "../Common/AlertMessages";
import TransactionStatus from "../Transaction/TransactionStatus";
import ILockPosition from "../../stores/interfaces/ILockPosition";
import { toJS } from "mobx";

const StakingView = observer(() => {
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const rootStore = useStores();

  const stakingStore = rootStore.stakingStore;

  useEffect(() => {
    logger.log(LogLevel.info, "fetching lock positions.");
    stakingStore.fetchLocks(account,chainId)
    stakingStore.fetchVOTEBalance(account,chainId)
    stakingStore.fetchWalletBalance(account,chainId)
    stakingStore.fetchAPR(chainId)
    console.log("stakingStore.lockPositions: ")
    console.log(stakingStore.lockPositions)
  }, [account, logger, stakingStore, chainId]);

  const fetchAll = (account: string, chainId: number) => {
    console.log("HERRRRREEEE... fetcgALL")
    stakingStore.fetchLocks(account,chainId)
    stakingStore.fetchVOTEBalance(account,chainId)
    stakingStore.fetchWalletBalance(account,chainId)
    stakingStore.fetchAPR(chainId)
  }
  const createLock = () => {
    stakingStore.createLock(account,500,365,chainId)
    fetchAll(account,chainId)
  }

  const claimRewards = () => {
    stakingStore.handleClaimRewards(account,chainId)
  }

  const withdrawRewards = () => {
    stakingStore.handleWithdrawRewards(account,chainId)
  }

  const handleEarlyWithdrawal = (lockId:number) => {
    stakingStore.handleEarlyWithdrawal(account,lockId,chainId)
  }
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "#000",
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <AlertMessages />
      <TransactionStatus />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Proposals
          </Typography>
          <Button
                      variant="outlined"
                      onClick={() =>
                        createLock()
                      }
                    >create Lock </Button>

      <Button
                      variant="outlined"
                      onClick={() =>
                        claimRewards()
                      }
                    >claim rewards</Button>

<Button
                      variant="outlined"
                      onClick={() =>
                        withdrawRewards()
                      }
                    >withdraw rewards</Button>
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
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
      </Container>
    </Box>
  );
});

export default StakingView;
