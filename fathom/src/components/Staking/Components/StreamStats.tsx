import React, { FC } from "react";

import { Box, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import RiseLabel from "components/AppComponents/AppLabel/RiseLabel";
import InfoIcon from "@mui/icons-material/Info";

import { formatCompact, formatCurrency, formatNumber } from "utils/format";
import { ButtonSecondary } from "components/AppComponents/AppButton/AppButton";

import PercentSrc from "assets/svg/percent.svg";
import LockedSrc from "assets/svg/locked.svg";
import RewardsSrc from "assets/svg/rewards.svg";
import StakingCountdown from "components/Staking/StakingCountdown";

import { secondsToTime } from "utils/secondsToTime";
import useStreamStats from "hooks/useStreamStats";
import useStakingContext from "context/staking";

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
  ${({ theme }) => theme.breakpoints.down("sm")} {
    grid-template-columns: 1fr;
  }
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

const StreamStats: FC = () => {
  const {
    staker,
    seconds,
    protocolStatsInfo,
    totalRewards,
    fthmPriceFormatted,
    processFlow,
  } = useStreamStats();

  const { isMobile } = useStakingContext();

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
            {protocolStatsInfo && (
              <StatsValue>
                <strong>
                  {formatNumber(protocolStatsInfo.stakingAPR / 10 ** 18)}%
                </strong>
                <RiseLabel>3.45%</RiseLabel>
              </StatsValue>
            )}
          </Box>
        </StatsBlock>

        <StatsBlock>
          <img src={LockedSrc} alt={"locked"} />
          <Box>
            <StatsLabel>Total Value Locked</StatsLabel>
            {protocolStatsInfo && (
              <StatsValue>
                <strong>
                  {formatNumber(protocolStatsInfo.totalStakeFTHM / 10 ** 18)}
                </strong>
                FTHM
                <span>
                  $
                  {formatCompact(
                    (protocolStatsInfo.totalStakeFTHM / 10 ** 18) *
                      fthmPriceFormatted
                  )}
                </span>
              </StatsValue>
            )}
          </Box>
        </StatsBlock>
        <StatsBlock>
          <img src={RewardsSrc} alt={"rewards"} />
          <Box>
            <StatsLabel>
              Daily rewards <InfoIcon sx={{ fontSize: "18px" }} />
            </StatsLabel>
            {protocolStatsInfo && (
              <StatsValue>
                <strong>
                  {formatNumber(protocolStatsInfo.oneDayRewards / 10 ** 18)}
                </strong>
                FTHM
                <span>
                  $
                  {formatCompact(
                    (protocolStatsInfo.oneDayRewards / 10 ** 18) *
                      fthmPriceFormatted
                  )}
                </span>
              </StatsValue>
            )}
          </Box>
        </StatsBlock>
      </StatsBlocks>

      {staker && (
        <>
          <StatsTypography sx={{ padding: "30px 0" }}>My Stats</StatsTypography>
          <MyStatsBlocks>
            <MyStatsBlock>
              <StatsLabel>Staked Balance</StatsLabel>
              {staker && (
                <MyStatsValue>
                  <strong>
                    {formatNumber(staker.totalStaked / 10 ** 18)} FTHM
                  </strong>
                  <span>
                    {formatCurrency(
                      (staker.totalStaked / 10 ** 18) * fthmPriceFormatted
                    )}
                  </span>
                </MyStatsValue>
              )}
            </MyStatsBlock>

            {isMobile && (
              <MyStatsBlock>
                <StatsLabel>
                  Voting power <InfoIcon sx={{ fontSize: "18px" }} />
                </StatsLabel>
                {staker && (
                  <MyStatsValue>
                    <strong>
                      {formatNumber(staker.accruedVotes / 10 ** 18)} vFTHM
                    </strong>
                  </MyStatsValue>
                )}
                <span>(1 staked FTHM for 365 days = 1 vFTHM)</span>
              </MyStatsBlock>
            )}

            {isMobile && (
              <MyStatsBlock>
                {seconds > 0 && (
                  <>
                    <CooldownInProgress>
                      Cooldown in progress
                    </CooldownInProgress>
                    <CooldownCountDown>
                      <StakingCountdown timeObject={secondsToTime(seconds)} />
                    </CooldownCountDown>
                    <MyStatsValue>
                      <strong>
                        {formatNumber(staker.claimedAmount / 10 ** 18)} FTHM
                      </strong>
                      <span>
                        {formatCurrency(
                          (staker.claimedAmount / 10 ** 18) * fthmPriceFormatted
                        )}
                      </span>
                    </MyStatsValue>
                  </>
                )}
                {seconds <= 0 && staker && Number(staker.claimedAmount) > 0 && (
                  <Grid container>
                    <Grid item xs={6}>
                      <StatsLabel>
                        Ready to withdraw
                        <InfoIcon sx={{ fontSize: "18px" }} />
                      </StatsLabel>
                      <MyStatsValue className={"green"}>
                        <strong>
                          {formatNumber(
                            Number(staker.claimedAmount) / 10 ** 18
                          )}{" "}
                          FTHM
                        </strong>
                        <span>
                          {formatCurrency(
                            (staker.claimedAmount / 10 ** 18) *
                              fthmPriceFormatted
                          )}
                        </span>
                      </MyStatsValue>
                    </Grid>
                    <ButtonGrid item xs={6}>
                      <StatsButton onClick={() => processFlow("withdraw")}>
                        Withdraw
                      </StatsButton>
                    </ButtonGrid>
                  </Grid>
                )}
              </MyStatsBlock>
            )}

            <MyStatsBlock>
              <Grid container>
                <Grid item xs={8}>
                  <StatsLabel>
                    Claimable rewards <InfoIcon sx={{ fontSize: "18px" }} />
                  </StatsLabel>
                  {staker && (
                    <MyStatsValue className={"blue"}>
                      <strong>
                        {formatNumber(totalRewards / 10 ** 18)} FTHM
                      </strong>
                      <span>
                        {formatCurrency(
                          (totalRewards / 10 ** 18) * fthmPriceFormatted
                        )}{" "}
                      </span>
                    </MyStatsValue>
                  )}
                </Grid>
                {totalRewards > 0 && (
                  <ButtonGrid item xs={4}>
                    <StatsButton onClick={() => processFlow("claim")}>
                      Claim
                    </StatsButton>
                  </ButtonGrid>
                )}
              </Grid>
            </MyStatsBlock>

            {!isMobile && (
              <MyStatsBlock>
                <StatsLabel>
                  Voting power <InfoIcon sx={{ fontSize: "18px" }} />
                </StatsLabel>
                {staker && (
                  <MyStatsValue>
                    <strong>
                      {formatNumber(staker.accruedVotes / 10 ** 18)} vFTHM
                    </strong>
                  </MyStatsValue>
                )}
                <span>(1 staked FTHM for 365 days = 1 vFTHM)</span>
              </MyStatsBlock>
            )}

            {!isMobile && (
              <MyStatsBlock>
                {seconds > 0 && (
                  <>
                    <CooldownInProgress>
                      Cooldown in progress
                    </CooldownInProgress>
                    <CooldownCountDown>
                      <StakingCountdown timeObject={secondsToTime(seconds)} />
                    </CooldownCountDown>
                    <MyStatsValue>
                      <strong>
                        {formatNumber(staker.claimedAmount / 10 ** 18)} FTHM
                      </strong>
                      <span>
                        {formatCurrency(
                          (staker.claimedAmount / 10 ** 18) * fthmPriceFormatted
                        )}
                      </span>
                    </MyStatsValue>
                  </>
                )}
                {seconds <= 0 && staker && Number(staker.claimedAmount) > 0 && (
                  <Grid container>
                    <Grid item xs={6}>
                      <StatsLabel>
                        Ready to withdraw
                        <InfoIcon sx={{ fontSize: "18px" }} />
                      </StatsLabel>
                      <MyStatsValue className={"green"}>
                        <strong>
                          {formatNumber(
                            Number(staker.claimedAmount) / 10 ** 18
                          )}{" "}
                          FTHM
                        </strong>
                        <span>
                          {formatCurrency(
                            (staker.claimedAmount / 10 ** 18) *
                              fthmPriceFormatted
                          )}
                        </span>
                      </MyStatsValue>
                    </Grid>
                    <ButtonGrid item xs={6}>
                      <StatsButton onClick={() => processFlow("withdraw")}>
                        Withdraw
                      </StatsButton>
                    </ButtonGrid>
                  </Grid>
                )}
              </MyStatsBlock>
            )}
          </MyStatsBlocks>
        </>
      )}
    </Box>
  );
};

export default StreamStats;
