import { Box, Grid, styled } from "@mui/material";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";
import {
  Label,
  StakingViewItemWrapper,
  Value,
} from "components/Staking/StakingViewItem";
import { FC } from "react";
import useSharedContext from "context/shared";

const SkeletonLabel = styled(Label)`
  padding-bottom: 3px;
`;

const StakingViewSkeletonItem = () => {
  return (
    <StakingViewItemWrapper>
      <Grid container spacing={1} alignItems="center">
        <Grid item sm={0.6}>
          <CustomSkeleton animation={"wave"} width={36} height={36} />
        </Grid>
        <Grid item sm={1.4}>
          <SkeletonLabel>Locked Amount</SkeletonLabel>
          <Value>
            <CustomSkeleton animation={"wave"} width={89} height={20} />
          </Value>
        </Grid>
        <Grid item sm={2}>
          <SkeletonLabel>Locking Time</SkeletonLabel>
          <Value className={"orange flex"}>
            <CustomSkeleton animation={"wave"} width={80} height={20} />
          </Value>
        </Grid>
        <Grid item sm={1.55}>
          <Box>
            <SkeletonLabel>Rewards Accrued</SkeletonLabel>
            <Value>
              <CustomSkeleton animation={"wave"} width={100} height={20} />
            </Value>
          </Box>
        </Grid>
        <Grid item sm={1.6}>
          <SkeletonLabel>Voting Power</SkeletonLabel>
          <Value>
            <CustomSkeleton animation={"wave"} width={80} height={20} />
          </Value>
        </Grid>
        <Grid item sm={0.6}></Grid>
        <Grid item sm={4.25}>
          <CustomSkeleton animation={"wave"} width={"100%"} height={68} />
        </Grid>
      </Grid>
    </StakingViewItemWrapper>
  );
};

const StakingViewSkeletonItemMobile = () => {
  return (
    <StakingViewItemWrapper>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={2}>
          <CustomSkeleton animation={"wave"} width={36} height={36} />
        </Grid>
        <Grid item xs={5}>
          <SkeletonLabel>Locked Amount</SkeletonLabel>
          <Value>
            <CustomSkeleton animation={"wave"} width={89} height={20} />
          </Value>
        </Grid>
        <Grid item xs={5}>
          <SkeletonLabel>Locking Time</SkeletonLabel>
          <Value className={"orange flex"}>
            <CustomSkeleton animation={"wave"} width={80} height={20} />
          </Value>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={5}>
          <Box>
            <SkeletonLabel>Rewards Accrued</SkeletonLabel>
            <Value>
              <CustomSkeleton animation={"wave"} width={100} height={20} />
            </Value>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <SkeletonLabel>Voting Power</SkeletonLabel>
          <Value>
            <CustomSkeleton animation={"wave"} width={80} height={20} />
          </Value>
        </Grid>
        <Grid item xs={12}>
          <CustomSkeleton animation={"wave"} width={"100%"} height={116} />
        </Grid>
      </Grid>
    </StakingViewItemWrapper>
  );
};

const StakingViewSkeleton: FC = () => {
  const { isMobile } = useSharedContext();

  return isMobile ? (
    <>
      <StakingViewSkeletonItemMobile />
      <StakingViewSkeletonItemMobile />
    </>
  ) : (
    <>
      <StakingViewSkeletonItem />
      <StakingViewSkeletonItem />
      <StakingViewSkeletonItem />
    </>
  );
};

export default StakingViewSkeleton;
