import * as React from "react";
import {
  Grid,
} from "@mui/material";
import { useMemo } from "react";
import { observer } from "mobx-react";
import StakingLockForm from "components/Staking/StakingLockForm";
import { PageHeader } from "components/Dashboard/PageHeader";
import useStakingView from "hooks/useStakingView";
import StreamStats from "components/Staking/StreamStats";
import StakingPositions from "./StakingPositions";

const StakingView = observer(() => {
  const {
    stakingStore,
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
            <StreamStats
              apr={100}
              stakedBalance={stakingStore.totalStakedPosition}
              voteBalance={stakingStore.voteBalance}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <StakingPositions />
      </Grid>
    </Grid>
  );
});

export default StakingView;
