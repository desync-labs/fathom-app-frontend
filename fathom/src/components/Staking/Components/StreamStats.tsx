import React, { FC } from "react";
import useStakingContext from "context/staking";

import { Box, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import RiseLabel from "components/AppComponents/AppLabel/RiseLabel";
import InfoIcon from "@mui/icons-material/Info";

import { formatNumber } from "utils/format";
import { ButtonSecondary } from "components/AppComponents/AppButton/AppButton";

import PercentSrc from "assets/svg/percent.svg";
import LockedSrc from "assets/svg/locked.svg";
import RewardsSrc from "assets/svg/rewards.svg";

const FTHMStreamHeader = styled("h3")`
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
  color: #3665ff;
  margin-top: 0;
`;

const StatsTypography = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  padding: 4px 0;
`;

const StatsTypographyDescription = styled(Typography)`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

const StatsBlocks = styled(Box)`
  padding: 15px 0;
  border-bottom: 1px solid #1d2d49;
`;

const StatsBlock = styled(Box)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
`;

const StatsLabel = styled(Box)`
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

const StatsValue = styled(Box)`
  display: flex;
  align-items: center;
  gap: 7px;
  strong {
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #9fadc6;
  }
`;

const MyStatsValue = styled(StatsValue)`
  strong {
    font-size: 14px;
  }

  &.blue {
    strong {
      color: #5a81ff;
    }
  }
  &.green {
    strong {
      color: #4dcc33;
    }
  }
`;

const MyStatsBlocks = styled(Box)`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  align-items: start;
  gap: 25px;
`;

const MyStatsBlock = styled(Box)`
  width: 100%;

  span:last-of-type {
    color: #9fadc6;
    font-size: 14px;
  }
`;

const StatsButton = styled(ButtonSecondary)`
  height: 32px;
`;

const ButtonGrid = styled(Grid)`
  display: flex;
  align-items: end;
  justify-content: end;
`;

const CooldownInProgress = styled(Box)`
  background: #3665ff;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 8px;
  width: 170px;
  text-align: center;
`;

const CooldownCountDown = styled(Box)`
  color: #5a81ff;
  font-size: 14px;
  padding: 10px 0;
`;

type StreamStatsPropsType = {
  stakedBalance: number;
  voteBalance: number;
  apr: number;
};

const StreamStats: FC<StreamStatsPropsType> = ({
  stakedBalance,
  voteBalance,
  apr,
}) => {
  const { processFlow } = useStakingContext();

  return (
    <Box sx={{ padding: "0 10px" }}>
      <FTHMStreamHeader>FTHM Stream</FTHMStreamHeader>
      <StatsTypography>Network Stats</StatsTypography>
      <StatsTypographyDescription>
        FTHM stream rewards in FTHM and vFTHM as Voting power.
      </StatsTypographyDescription>

      <StatsBlocks>
        <StatsBlock>
          <img src={PercentSrc} alt={"percent"} />
          <Box>
            <StatsLabel>APR</StatsLabel>
            <StatsValue>
              <strong>{apr}%</strong>
              <RiseLabel>3.45%</RiseLabel>
            </StatsValue>
          </Box>
        </StatsBlock>

        <StatsBlock>
          <img src={LockedSrc} alt={"locked"} />
          <Box>
            <StatsLabel>Total Value Locked</StatsLabel>
            <StatsValue>
              <strong>{formatNumber(stakedBalance)}</strong>FTHM
              <span>$99M</span>
            </StatsValue>
          </Box>
        </StatsBlock>

        <StatsBlock>
          <img src={RewardsSrc} alt={"rewards"} />
          <Box>
            <StatsLabel>
              Daily rewards <InfoIcon sx={{ fontSize: "18px" }} />
            </StatsLabel>
            <StatsValue>
              <strong>500K</strong>FTHM
              <span>$670k</span>
            </StatsValue>
          </Box>
        </StatsBlock>
      </StatsBlocks>

      <StatsTypography sx={{ padding: "30px 0" }}>My Stats</StatsTypography>

      <MyStatsBlocks>
        <MyStatsBlock>
          <StatsLabel>Staked Balance</StatsLabel>
          <MyStatsValue>
            <strong>400 FTHM</strong>
            <span>$500.00</span>
          </MyStatsValue>
        </MyStatsBlock>

        <MyStatsBlock>
          <Grid container>
            <Grid item xs={6}>
              <StatsLabel>
                Claimable rewards <InfoIcon sx={{ fontSize: "18px" }} />
              </StatsLabel>
              <MyStatsValue className={"blue"}>
                <strong>100 FTHM</strong>
                <span>$153.00</span>
              </MyStatsValue>
            </Grid>
            <ButtonGrid item xs={6}>
              <StatsButton onClick={() => processFlow("claim")}>
                Claim
              </StatsButton>
            </ButtonGrid>
          </Grid>
        </MyStatsBlock>

        <MyStatsBlock>
          <StatsLabel>
            Voting power <InfoIcon sx={{ fontSize: "18px" }} />
          </StatsLabel>
          <MyStatsValue>
            <strong>1,500 vFTHM</strong>
          </MyStatsValue>
          <span>(1 staked FTHM = 1 vFTHM)</span>
        </MyStatsBlock>

        <MyStatsBlock>
          <CooldownInProgress>Cooldown in progress</CooldownInProgress>
          <CooldownCountDown>
            1 Day : 10 Hours : 30 Mins : 17 Secs
          </CooldownCountDown>
          <MyStatsValue>
            <strong>400 FTHM</strong>
            <span>$500.00</span>
          </MyStatsValue>
          <Grid container>
            <Grid item xs={6}>
              <StatsLabel>
                Ready to withdraw
                <InfoIcon sx={{ fontSize: "18px" }} />
              </StatsLabel>
              <MyStatsValue className={"green"}>
                <strong>400 FTHM</strong>
              </MyStatsValue>
            </Grid>
            <ButtonGrid item xs={6} onClick={() => processFlow('withdraw')}>
              <StatsButton>Withdraw</StatsButton>
            </ButtonGrid>
          </Grid>
        </MyStatsBlock>
      </MyStatsBlocks>
    </Box>
  );
};

export default StreamStats;
