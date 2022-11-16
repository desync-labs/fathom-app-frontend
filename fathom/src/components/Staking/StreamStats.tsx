import { observer } from "mobx-react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import PercentSrc from "assets/svg/percent.svg";
import CheckmarkSrc from "assets/svg/check-mark.svg";
import LockedSrc from "assets/svg/locked.svg";
import RewardsSrc from "assets/svg/rewards.svg";
import RiseLabel from "components/AppComponents/AppLabel/RiseLabel";
import InfoIcon from "@mui/icons-material/Info";
import React from "react";

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
  font-weight: 700;
  font-size: 13px;
  line-height: 16px;
  color: #9fadc6;
  text-transform: uppercase;
  padding-bottom: 7px;
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

const MyStatsBlocks = styled(Box)`
  display: flex;
  align-items: start;
`;

const MyStatsBlock = styled(Box)`
  width: 33.33%;
`;

const StatsUSDPrice = styled(Box)`
  font-size: 14px;
  line-height: 20px;
  color: #9fadc6;
`;

const StreamStats = observer((props: any) => {
  return (
    <Box sx={{ padding: "0 10px" }}>
      <FTHMStreamHeader>FTHM Stream</FTHMStreamHeader>
      <StatsTypography>Network Stats</StatsTypography>
      <StatsTypographyDescription>
        FTHM stream rewards in FTHM and VeFTHM as Voting power.
      </StatsTypographyDescription>

      <StatsBlocks>
        <StatsBlock>
          <img src={PercentSrc} alt={"percent"} />
          <Box>
            <StatsLabel>APR</StatsLabel>
            <StatsValue>
              <strong>{props.apr}%</strong>
              <RiseLabel>3.45%</RiseLabel>
            </StatsValue>
          </Box>
        </StatsBlock>

        <StatsBlock>
          <img src={CheckmarkSrc} alt={"checkmark"} />
          <Box>
            <StatsLabel>
              Voting power <InfoIcon sx={{ fontSize: "18px" }} />
            </StatsLabel>
            <StatsValue>
              <strong>{props.voteBalance}</strong>vFTHM
              <span>(1 staked FTHM = 1 vFTHM)</span>
            </StatsValue>
          </Box>
        </StatsBlock>

        <StatsBlock>
          <img src={LockedSrc} alt={"locked"} />
          <Box>
            <StatsLabel>Total value locked</StatsLabel>
            <StatsValue>
              <strong>{props.stakedBalance}</strong>FTHM
              <span>$99M</span>
            </StatsValue>
          </Box>
        </StatsBlock>

        <StatsBlock>
          <img src={RewardsSrc} alt={"rewards"} />
          <Box>
            <StatsLabel>Daily rewards <InfoIcon sx={{ fontSize: "18px" }} /></StatsLabel>
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
          <StatsValue>
            <strong>400</strong>FTHM
          </StatsValue>
          <StatsUSDPrice>$500.00</StatsUSDPrice>
        </MyStatsBlock>

        <MyStatsBlock>
          <StatsLabel>Rewards <InfoIcon sx={{ fontSize: "18px" }} /></StatsLabel>
          <StatsValue>
            <strong>100</strong>FTHM
          </StatsValue>
          <StatsUSDPrice>$153.00</StatsUSDPrice>
        </MyStatsBlock>

        <MyStatsBlock>
          <StatsLabel>Voting power <InfoIcon sx={{ fontSize: "18px" }} /></StatsLabel>
          <StatsValue>
            <strong>2</strong>vFTHM
          </StatsValue>
        </MyStatsBlock>
      </MyStatsBlocks>
    </Box>
  );
});

export default StreamStats;
