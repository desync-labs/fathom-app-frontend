import React, { memo, FC, useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import ILockPosition from "stores/interfaces/ILockPosition";
import { styled } from "@mui/material/styles";
import StakingCountdown from "components/Staking/StakingCountdown";

import InfoIcon from "@mui/icons-material/Info";

import clockSrc from "assets/svg/clock-circle.svg";
import { ButtonSecondary } from "components/AppComponents/AppButton/AppButton";

import { formatNumber } from "utils/format";
import { secondsToTime } from "utils/secondsToTime";
import { getTokenLogoURL } from "utils/tokenLogo";
import useStakingContext from "context/staking";

const StakingViewItemWrapper = styled(Grid)`
  &.MuiGrid-item {
    padding: 16px 20px;
    background: #1d2d49;
    border-radius: 8px;
    max-width: calc(50% - 6px);
  }
`;

const HeaderWrapper = styled(Box)`
  display: flex;
  align-items: start;
  justify-content: start;
  gap: 15px;
`;

const RewardsUnStakeWrapper = styled(Box)`
  margin-top: 20px;
  height: 166px;
  background: #061023;
  border-radius: 12px;
  align-items: center;
  padding: 20px 24px;

  .title {
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: #fff;
    padding-bottom: 15px;
  }
`;

const Index = styled(Box)`
  width: 23px;
  height: 28px;
  border-radius: 6px;
  background: #3665ff;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NumberCell = styled(Box)`
  display: flex;
  align-items: start;
  justify-content: start;
  gap: 10px;
  margin-top: 5px;
`;

const Label = styled(Box)`
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  color: #6379a1;
  text-transform: uppercase;
  padding-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 7px;

  svg {
    cursor: pointer;
  }
`;

const Value = styled(Box)`
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;

  &.green {
    color: #4dcc33;
    text-transform: uppercase;
  }
  &.orange {
    color: #f5953d;
  }

  div {
    color: #fff;
  }
`;

const TotalLocked = styled(Typography)`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

const Penalty = styled(Typography)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  &.penalty {
    color: #f76e6e;
  }
`;

const CoolDownInfo = styled(Box)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #7d91b5;
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  height: 100%;
`;

const ButtonGrid = styled(Grid)`
  display: flex;
  align-items: start;
  justify-content: end;
`;

const InfoWrapper = styled(Box)``;

type StakingViewItemPropsType = {
  lockPosition: ILockPosition;
  token: string;
};

const StakingViewItem: FC<StakingViewItemPropsType> = ({
  lockPosition,
  token,
}) => {
  const [seconds, setSeconds] = useState(lockPosition.end - Date.now() / 1000);

  const { processFlow } = useStakingContext();

  const { isUnlockable } = useStakingContext();

  useEffect(() => {
    if (lockPosition.end - Date.now() / 1000 <= 0) {
      return setSeconds(0);
    } else {
      return setSeconds(lockPosition.end - Date.now() / 1000);
    }
  }, [lockPosition, setSeconds]);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    }
  }, [seconds, setSeconds]);

  useEffect(() => {

  })

  return (
    <StakingViewItemWrapper item xs={6}>
      <HeaderWrapper>
        <NumberCell>
          <img src={getTokenLogoURL(token)} alt={token} width={28} />
          <Index>{lockPosition.lockId}</Index>
        </NumberCell>
        <InfoWrapper>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Label>Locked Amount</Label>
              <Value>
                {formatNumber(lockPosition.amount / 10 ** 18)} {token}
              </Value>
            </Grid>
            <Grid item xs={4}>
              <Label>Voting Power</Label>
              <Value>
                {lockPosition.nVoteToken
                  ? `${formatNumber(lockPosition.nVoteToken / 10 ** 18)} vFTHM`
                  : "None"}
              </Value>
            </Grid>
            <Grid item xs={8}>
              <Label>Locking Time</Label>
              <Value className={"orange"}>
                <img src={clockSrc} alt={"clock-circle"} />
                {seconds > 0 ? (
                  <StakingCountdown timeObject={secondsToTime(seconds)} />
                ) : (
                  <Box>0 days left</Box>
                )}
              </Value>
            </Grid>
            <Grid item xs={4}>
              <Label>Rewards Accrued</Label>
              <Value className={"green"}>
                {formatNumber(lockPosition.rewardsAvailable / 10 ** 18)} {token}
              </Value>
            </Grid>
          </Grid>
        </InfoWrapper>
      </HeaderWrapper>
      <RewardsUnStakeWrapper>
        <Typography component={"h3"} className={"title"}>
          I want to unstake
        </Typography>
        <Grid container sx={{ width: "100%", height: "100%" }}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <TotalLocked>
                  Locked: {formatNumber(lockPosition.amount / 10 ** 18)} {token}
                </TotalLocked>
                <TotalLocked>
                  Accrued Rewards:{" "}
                  {formatNumber(lockPosition.rewardsAvailable / 10 ** 18)}{" "}
                  {token}
                </TotalLocked>
                <Penalty className={isUnlockable(seconds) ? "" : "penalty"}>
                  {isUnlockable(seconds)
                    ? "Penalty Fee: No"
                    : "Penalty Fee: Yes (0.1%)"}
                </Penalty>
              </Grid>

              <Grid item xs={6}>
                <CoolDownInfo>
                  Cooldown Period: 2 days
                  <InfoIcon sx={{ fontSize: "18px" }} />
                </CoolDownInfo>
              </Grid>
              <ButtonGrid item xs={6}>
                {isUnlockable(seconds) ? (
                  <ButtonSecondary
                    onClick={() => processFlow("unstake", lockPosition)}
                  >
                    Unstake
                  </ButtonSecondary>
                ) : (
                  <ButtonSecondary
                    onClick={() => processFlow("early", lockPosition)}
                  >
                    Early Unstake
                  </ButtonSecondary>
                )}
              </ButtonGrid>
            </Grid>
          </Grid>
        </Grid>
      </RewardsUnStakeWrapper>
    </StakingViewItemWrapper>
  );
};

export default memo(StakingViewItem);
