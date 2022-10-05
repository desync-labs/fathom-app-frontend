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
  Box,
  Grid,
  TextField,
  Slider,
  CircularProgress,
} from "@mui/material";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { LogLevel, useLogger } from "../../helpers/Logger";
import { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react";
import ILockPosition from "../../stores/interfaces/ILockPosition";
import StakingModal from "./StakingModal";
import StakingViewItem from "./StakingViewItem";

export type StakingViewItemMethodsPropsType = {
  handleEarlyWithdrawal: (lockId: number) => void;
  isItUnlockable: (lockId: number) => boolean;
  handleUnlock: (lockId: number) => void;
};

export type ActionType = { type: string; id: number | null };

const StakingView = observer(() => {
  const [lockDays, setLockDays] = useState(0);
  const [stakePosition, setStakePosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<ActionType>();
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const rootStore = useStores();

  const stakingStore = rootStore.stakingStore;

  const fetchAll = useCallback(
    async (account: string, chainId: number) => {
      setIsLoading(true);
      Promise.all([
        stakingStore.fetchLocks(account, chainId),
        stakingStore.fetchVOTEBalance(account, chainId),
        stakingStore.fetchWalletBalance(account, chainId),
        stakingStore.fetchAPR(chainId),
      ]).then(() => {
        setIsLoading(false);
      });
    },
    [stakingStore, setIsLoading]
  );

  useEffect(() => {
    if (chainId) {
      logger.log(LogLevel.info, "Fetching lock positions.");
      fetchAll(account, chainId);
    } else {
      stakingStore.setLocks([]);
    }
  }, [account, logger, stakingStore, chainId, fetchAll]);

  const createLock = useCallback(async () => {
    await stakingStore.createLock(account, stakePosition, lockDays, chainId);
    setStakePosition(0);
    setLockDays(0);
    fetchAll(account, chainId);
  }, [
    stakingStore,
    account,
    chainId,
    stakePosition,
    lockDays,
    fetchAll,
    setStakePosition,
    setLockDays,
  ]);

  const claimRewards = useCallback(async () => {
    setAction({ type: "claim", id: null });
    try {
      await stakingStore.handleClaimRewards(account, chainId);
      fetchAll(account, chainId);
    } catch (e) {
      logger.log(LogLevel.error, "Claim error");
    }
    setAction(undefined);
  }, [stakingStore, account, chainId, fetchAll, setAction]);

  const withdrawRewards = useCallback(async () => {
    setAction({ type: "withdraw", id: null });
    try {
      await stakingStore.handleWithdrawRewards(account, chainId);
      fetchAll(account, chainId);
    } catch (e) {
      logger.log(LogLevel.error, "Withdraw error");
    }
    setAction(undefined);
  }, [stakingStore, account, chainId, fetchAll, setAction]);

  const handleEarlyWithdrawal = useCallback(
    async (lockId: number) => {
      setAction({
        type: "early",
        id: lockId,
      });
      await stakingStore.handleEarlyWithdrawal(account, lockId, chainId);
      setAction(undefined);
      fetchAll(account, chainId);
    },
    [stakingStore, account, chainId, fetchAll, setAction]
  );

  const handleUnlock = useCallback(
    async (lockId: number) => {
      setAction({
        type: "unlock",
        id: lockId,
      });
      await stakingStore.handleUnlock(account, lockId, chainId);
      setAction(undefined);
      fetchAll(account, chainId);
    },
    [stakingStore, account, chainId, fetchAll, setAction]
  );

  const isItUnlockable = useCallback(
    (lockId: number) => {
      const remainingTime = stakingStore.lockPositions[lockId - 1].EndTime;
      const isItUnlockable = remainingTime <= 0;
      return isItUnlockable;
    },
    [stakingStore.lockPositions]
  );

  const handleStakeChange = useCallback((e: any) => {
    setStakePosition(e.target.value);
  }, []);

  const handleSliderChange = useCallback((e: any) => {
    setLockDays(e.target.value);
  }, []);

  const stakingViewItemProps: StakingViewItemMethodsPropsType = {
    handleEarlyWithdrawal,
    isItUnlockable,
    handleUnlock,
  };

  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        STAKING
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            id="outlined-helperText"
            label="Stake Position"
            defaultValue="Default Value"
            helperText="FTHM to stake"
            sx={{ m: 3 }}
            value={stakePosition}
            onChange={handleStakeChange}
          />
          <Box sx={{ m: 3, mr: 10 }}>
            Unlock Period:
            <Slider
              aria-label="Temperature"
              defaultValue={30}
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={365}
              value={lockDays}
              onChange={handleSliderChange}
            />
            {lockDays} days
          </Box>
        </Grid>
        <Grid item xs={4}>
          <StakingModal
            apr={100}
            stakedBalance={stakingStore.totalStakedPosition}
            voteBalance={stakingStore.voteBalance}
          />
        </Grid>
      </Grid>
      <div>
        <Button
          sx={{ m: 3, mr: 10 }}
          variant="outlined"
          onClick={() => createLock()}
        >
          Create Lock
        </Button>
      </div>
      <br />

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell component="th" sx={{ fontSize: "1rem" }}>
                Lock Position
              </TableCell>
              <TableCell component="th" sx={{ fontSize: "1rem" }}>
                Vote Tokens Received
              </TableCell>
              <TableCell component="th" sx={{ fontSize: "1rem" }}>
                Stream Rewards
              </TableCell>
              <TableCell
                component="th"
                sx={{ textAlign: "center", fontSize: "1rem" }}
              >
                Remaining Period
              </TableCell>
              <TableCell component="th" sx={{ fontSize: "1rem" }}>
                Unlock
              </TableCell>
              <TableCell component="th" sx={{ fontSize: "1rem" }}>
                Early Unlock
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell align="center" colSpan={6}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              stakingStore.lockPositions.map((lockPosition: ILockPosition) => (
                <StakingViewItem
                  key={lockPosition.lockId}
                  lockPosition={lockPosition}
                  action={action}
                  {...stakingViewItemProps}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <br />

      <Button variant="outlined" onClick={claimRewards}>
        {action?.type === "claim" ? (
          <CircularProgress size={30} />
        ) : (
          "Claim Stream Rewards"
        )}
      </Button>
      <br />
      <Button variant="outlined" onClick={withdrawRewards}>
        {action?.type === "withdraw" ? (
          <CircularProgress size={30} />
        ) : (
          "Withdraw All Rewards and Remaining Unlocked FTHM"
        )}
      </Button>
      <br />
    </Paper>
  );
});

export default StakingView;
