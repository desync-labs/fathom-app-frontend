import { Grid } from "@mui/material";
import { useMemo } from "react";
import StakingLockForm from "components/Staking/StakingLockForm";
import StreamStats from "components/Staking/Components/StreamStats";
import StakingPositions from "components/Staking/StakingPositions";
import { PageHeader } from "components/Dashboard/PageHeader";
import useSharedContext from "context/shared";

const StakingView = () => {
  const { isMobile } = useSharedContext();
  return (
    <Grid container spacing={3}>
      {useMemo(
        () =>
          !isMobile && (
            <PageHeader
              title="Staking"
              description={`Stake FTHM to get more FTHM rewards and voting power (vFTHM). <br />
               The longer the lock period - the more rewards.`}
            />
          ),
        [isMobile]
      )}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} mt={isMobile ? 3 : 2}>
            <StakingLockForm />
          </Grid>
          <Grid item xs={12} sm={6} mt={isMobile ? 2 : 2}>
            <StreamStats />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <StakingPositions />
      </Grid>
    </Grid>
  );
};

export default StakingView;
