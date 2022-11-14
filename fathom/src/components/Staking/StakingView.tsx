import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useMemo } from "react";
import { observer } from "mobx-react";
import ILockPosition from "stores/interfaces/ILockPosition";
import StakingModal from "components/Staking/FTHMStream";
import StakingViewItem from "components/Staking/StakingViewItem";
import StakingLockForm from "components/Staking/StakingLockForm";
import { AppTableHeaderRow } from "components/AppComponents/AppTable/AppTable";
import { PageHeader } from "components/Dashboard/PageHeader";
import useStakingView from "hooks/useStakingView";
import FTHMStream from "components/Staking/FTHMStream";

export type StakingViewItemMethodsPropsType = {
  handleEarlyWithdrawal: (lockId: number) => void;
  isItUnlockable: (remainingTime: number) => boolean;
  handleUnlock: (lockId: number) => void;
};

export type ActionType = { type: string; id: number | null };

const StakingView = observer(() => {
  const {
    stakingStore,
    action,
    isLoading,
    stakingViewItemProps,
    withdrawRewards,
    claimRewards,
    fetchOverallValues,
  } = useStakingView();

  return (
    <Grid container spacing={3}>
      {useMemo(
        () => (
          <PageHeader
            title="Staking"
            description={
              "Stake XDC, borrow FXD and earn an attractive yield on FXD in the form of liquid staking rewards."
            }
          />
        ),
        []
      )}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <StakingLockForm fetchOverallValues={fetchOverallValues} />
          </Grid>
          <Grid item xs={6}>
            <FTHMStream
              apr={100}
              stakedBalance={stakingStore.totalStakedPosition}
              voteBalance={stakingStore.voteBalance}
            />
          </Grid>
        </Grid>
      </Grid>
      <TableContainer sx={{ my: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <AppTableHeaderRow>
              <TableCell component="th">Lock Position</TableCell>
              <TableCell component="th">Vote Tokens Received</TableCell>
              <TableCell component="th">Stream Rewards</TableCell>
              <TableCell component="th">Remaining Period</TableCell>
              <TableCell component="th">Unlock</TableCell>
              <TableCell component="th">Early Unlock</TableCell>
            </AppTableHeaderRow>
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

      <Button variant="outlined" onClick={claimRewards} sx={{ my: 2 }}>
        {action?.type === "claim" ? (
          <CircularProgress size={30} />
        ) : (
          "Claim Stream Rewards"
        )}
      </Button>
      <Button variant="outlined" onClick={withdrawRewards}>
        {action?.type === "withdraw" ? (
          <CircularProgress size={30} />
        ) : (
          "Withdraw All Rewards and Remaining Unlocked FTHM"
        )}
      </Button>
    </Grid>
  );
});

export default StakingView;
