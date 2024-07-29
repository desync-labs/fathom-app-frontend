import { Grid } from "@mui/material";
import useSharedContext from "context/shared";
import StakingLockForm from "components/Staking/StakingLockForm";
import StreamStats from "components/Staking/Components/StreamStats";
import StakingPositions from "components/Staking/StakingPositions";
import BasePageHeader from "components/Base/PageHeader";
import BasePageContainer from "components/Base/PageContainer";

const StakingView = () => {
  const { isMobile } = useSharedContext();
  return (
    <BasePageContainer>
      <BasePageHeader
        title="Staking"
        description={`Stake FTHM to get more FTHM rewards and voting power (vFTHM). <br />
               The longer the lock period - the more rewards.`}
      />
      <Grid container spacing={1.5}>
        <Grid item xs={12} sm={6} mt={isMobile ? 3 : 2}>
          <StakingLockForm />
        </Grid>
        <Grid item xs={12} sm={6} mt={isMobile ? 2 : 2}>
          <StreamStats />
        </Grid>
      </Grid>
      <StakingPositions />
    </BasePageContainer>
  );
};

export default StakingView;
