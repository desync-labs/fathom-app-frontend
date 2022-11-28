import React, { memo, Dispatch, FC, useEffect, useState } from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
import ILockPosition from "stores/interfaces/ILockPosition";
import useStakingView from "hooks/useStakingView";
import { styled } from "@mui/material/styles";
import StakingCountdown from "components/Staking/StakingCountdown";

import InfoIcon from "@mui/icons-material/Info";

import clockSrc from "assets/svg/clock-circle.svg";
import { ButtonSecondary } from "components/AppComponents/AppButton/AppButton";

import { formatNumber } from "utils/format";
import { secondsToTime } from "utils/secondsToTime";
import { getTokenLogoURL } from "utils/tokenLogo";

const RightGrid = styled(Grid)`
  width: calc(50% - 1px);
  padding-left: 20px;
`;

const StakingViewItemWrapper = styled(Box)`
  padding: 16px 20px;
  background: #1d2d49;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const StakingViewItemLabel = styled(Box)`
  font-weight: 700;
  font-size: 13px;
  line-height: 16px;
  color: #6379a1;
  text-transform: uppercase;
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

const NumberCell = styled(Grid)`
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

const CoolDown = styled(Box)`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding-bottom: 3px;

  svg {
    color: #7d91b5;
  }

  span {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #5a81ff;
    padding-left: 5px;

    &.green {
      color: #4dcc33;
    }
  }
`;

const CoolDownCountDown = styled(Box)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #5a81ff;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ButtonGrid = styled(Grid)`
  display: flex;
  align-items: start;
  justify-content: end;

  button:not(.without-margin) {
    margin-right: 20px;
  }
`;

type StakingViewItemPropsType = {
  index: number;
  lockPosition: ILockPosition;
  token: string;
  setUnstake: Dispatch<null | ILockPosition>;
  setEarlyUnstake: Dispatch<null | ILockPosition>;
};

const StakingViewItem: FC<StakingViewItemPropsType> = ({
  lockPosition,
  token,
  setUnstake,
  setEarlyUnstake,
  index,
}) => {
  const [timer, setTimer] = useState();
  const [seconds, setSeconds] = useState(lockPosition.EndTime);

  const { isUnlockable } = useStakingView();

  useEffect(() => {
    if (lockPosition.EndTime <= 0) {
      return setSeconds(0);
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // @ts-ignore
    setTimer(interval);

    return () => {
      clearInterval(timer);
    };
  }, [setTimer, setSeconds]);

  return (
    <StakingViewItemWrapper>
      <Grid container>
        <NumberCell item xs={2}>
          <img src={getTokenLogoURL(token)} alt={token} width={28} />
          <Index>{index + 1}</Index>
        </NumberCell>
        <Grid item xs={2}>
          <Label>Locked Amount</Label>
          <Value>
            {formatNumber(lockPosition.MAINTokenBalance)} {token}
          </Value>
        </Grid>
        <Grid item xs={2}>
          <Label>Voting Power</Label>
          <Value>
            {lockPosition.VOTETokenBalance
              ? `${formatNumber(lockPosition.VOTETokenBalance)} vFTHM`
              : "None"}
          </Value>
        </Grid>
        <Grid item xs={4}>
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
        <Grid item xs={2}>
          <Label>Rewards Accrued</Label>
          <Value className={"green"}>
            {formatNumber(Number(lockPosition.RewardsAvailable) / 10 ** 27!)}{" "}
            {token}
          </Value>
        </Grid>
      </Grid>
      <RewardsUnStakeWrapper>
        <Typography component={"h3"} className={"title"}>
          I want to unstake
        </Typography>
        <Grid container sx={{ width: "100%", height: "100%" }}>
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={12}>
                <TotalLocked>
                  Locked: {formatNumber(lockPosition.MAINTokenBalance)} {token}
                </TotalLocked>
                <TotalLocked>
                  Accrued Rewards:{" "}
                  {formatNumber(Number(lockPosition.RewardsAvailable))} {token}
                </TotalLocked>
                <Penalty className={isUnlockable(seconds) ? "" : "penalty"}>
                  {isUnlockable(seconds)
                    ? "Penalty Fee: No"
                    : "Penalty Fee: Yes (0.1%)"
                  }
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
                  <ButtonSecondary onClick={() => setUnstake(lockPosition)}>
                    Unstake
                  </ButtonSecondary>
                ) : (
                  <ButtonSecondary
                    onClick={() => setUnstake(lockPosition)}
                  >
                    Early Unstake
                  </ButtonSecondary>
                )}
              </ButtonGrid>
            </Grid>
          </Grid>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ margin: "0 0 35px" }}
          ></Divider>
          <RightGrid item>
            <CoolDown>
              Cooling Down <InfoIcon sx={{ fontSize: "18px" }} />{" "}
              <span>200 FTHM</span>
            </CoolDown>
            <CoolDown>
              Available to Withdraw <InfoIcon sx={{ fontSize: "18px" }} />{" "}
              <span className={"green"}>300 FTHM</span>
            </CoolDown>
            <Grid container sx={{ marginTop: "6px" }}>
              <Grid item xs={8}>
                <CoolDownCountDown>
                  Cooldown countdown: 1 day 23 hrs 12 mins left
                </CoolDownCountDown>
              </Grid>
              <ButtonGrid item xs={4}>
                <ButtonSecondary className={"without-margin"}>
                  Withdraw
                </ButtonSecondary>
              </ButtonGrid>
            </Grid>
          </RightGrid>
        </Grid>
      </RewardsUnStakeWrapper>
    </StakingViewItemWrapper>
  );
};

export default memo(StakingViewItem);
