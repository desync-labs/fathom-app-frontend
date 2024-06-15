import { FC, useMemo } from "react";

import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";

import { ButtonSecondary } from "components/AppComponents/AppButton/AppButton";
import StakingCountdown from "components/Staking/StakingCountdown";

import { formatCompact, formatNumber, formatPercentage } from "utils/format";

import PercentSrc from "assets/svg/percent.svg";
import LockedSrc from "assets/svg/locked.svg";
import RewardsSrc from "assets/svg/rewards.svg";

import { secondsToTime } from "utils/secondsToTime";
import useStreamStats from "hooks/Staking/useStreamStats";
import BigNumber from "bignumber.js";
import useSharedContext from "context/shared";
import { FlowType } from "hooks/Staking/useStakingView";

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
  padding: 15px 0 30px 0;
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
  flex-direction: column;
  align-items: flex-start;
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
    stake,
    seconds,
    protocolStatsInfo,
    totalRewards,
    fthmPriceFormatted,
    processFlow,
  } = useStreamStats();

  const cooldownInUsd = useMemo(() => {
    return stake ? (stake.claimedAmount / 10 ** 18) * fthmPriceFormatted : 0;
  }, [stake, fthmPriceFormatted]);

  const totalrewardsInUsd = useMemo(() => {
    return totalRewards
      ? BigNumber(totalRewards)
          .dividedBy(10 ** 18)
          .multipliedBy(fthmPriceFormatted)
          .toNumber()
      : 0;
  }, [totalRewards, fthmPriceFormatted]);

  const { isMobile } = useSharedContext();

  return (
    <Box sx={{ padding: isMobile ? "10px" : "0 10px" }}>
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

      {stake && (
        <>
          <StatsTypography
            sx={{ padding: isMobile ? "40px 0 30px 0" : "30px 0" }}
          >
            My Stats
          </StatsTypography>
          <MyStatsBlocks>
            <MyStatsBlock>
              <StatsLabel>Staked Balance</StatsLabel>
              {stake && (
                <MyStatsValue>
                  <strong>
                    {formatPercentage(stake.totalStaked / 10 ** 18)} FTHM
                  </strong>
                  <span>
                    $
                    {formatPercentage(
                      (stake.totalStaked / 10 ** 18) * fthmPriceFormatted
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
                {stake && (
                  <MyStatsValue>
                    <strong>
                      {formatPercentage(stake.accruedVotes / 10 ** 18)} vFTHM
                    </strong>
                  </MyStatsValue>
                )}
                <span>(1 staked FTHM for 365 days = 1 vFTHM)</span>
              </MyStatsBlock>
            )}

            {isMobile && (
              <>
                {BigNumber(Number(seconds)).isGreaterThan(0) && (
                  <MyStatsBlock>
                    <CooldownInProgress>
                      Cooldown in progress
                    </CooldownInProgress>
                    <CooldownCountDown>
                      <StakingCountdown
                        timeObject={secondsToTime(Number(seconds))}
                      />
                    </CooldownCountDown>
                    <MyStatsValue>
                      <strong>
                        {formatPercentage(stake.claimedAmount / 10 ** 18)} FTHM
                      </strong>
                      {BigNumber(cooldownInUsd).isGreaterThan(1 / 10 ** 6) ? (
                        <span>${formatPercentage(cooldownInUsd)}</span>
                      ) : null}
                    </MyStatsValue>
                  </MyStatsBlock>
                )}
                {BigNumber(Number(seconds)).isLessThanOrEqualTo(0) &&
                stake &&
                BigNumber(stake.claimedAmount).isGreaterThan(0) ? (
                  <MyStatsBlock>
                    <Grid container>
                      <Grid item xs={6}>
                        <StatsLabel>
                          Ready to withdraw
                          <InfoIcon sx={{ fontSize: "18px" }} />
                        </StatsLabel>
                        <MyStatsValue className={"green"}>
                          <strong>
                            {formatPercentage(
                              Number(stake.claimedAmount) / 10 ** 18
                            )}{" "}
                            FTHM
                          </strong>
                          {BigNumber(cooldownInUsd).isGreaterThan(
                            1 / 10 ** 6
                          ) ? (
                            <span>${formatPercentage(cooldownInUsd)}</span>
                          ) : null}
                        </MyStatsValue>
                      </Grid>
                      <ButtonGrid item xs={6}>
                        <StatsButton
                          onClick={() => processFlow(FlowType.WITHDRAW)}
                        >
                          Withdraw
                        </StatsButton>
                      </ButtonGrid>
                    </Grid>
                  </MyStatsBlock>
                ) : null}
              </>
            )}

            <MyStatsBlock>
              <Grid container>
                <Grid item xs={8}>
                  <StatsLabel>
                    Claimable rewards <InfoIcon sx={{ fontSize: "18px" }} />
                  </StatsLabel>
                  {stake && (
                    <MyStatsValue className={"blue"}>
                      <strong>
                        {formatPercentage(
                          BigNumber(totalRewards)
                            .dividedBy(10 ** 18)
                            .toNumber()
                        )}{" "}
                        FTHM
                      </strong>
                      {BigNumber(totalRewards).isGreaterThan(0.0001) ? (
                        <span>${formatPercentage(totalrewardsInUsd)} </span>
                      ) : null}
                    </MyStatsValue>
                  )}
                </Grid>
                {BigNumber(totalRewards).isGreaterThan(0) ? (
                  <ButtonGrid item xs={4}>
                    <StatsButton onClick={() => processFlow(FlowType.CLAIM)}>
                      Claim
                    </StatsButton>
                  </ButtonGrid>
                ) : null}
              </Grid>
            </MyStatsBlock>

            {!isMobile && (
              <MyStatsBlock>
                <StatsLabel>
                  Voting power <InfoIcon sx={{ fontSize: "18px" }} />
                </StatsLabel>
                {stake && (
                  <MyStatsValue>
                    <strong>
                      {formatNumber(stake.accruedVotes / 10 ** 18)} vFTHM
                    </strong>
                  </MyStatsValue>
                )}
                <span>(1 staked FTHM for 365 days = 1 vFTHM)</span>
              </MyStatsBlock>
            )}

            {!isMobile && (
              <MyStatsBlock>
                {BigNumber(Number(seconds)).isGreaterThan(0) && (
                  <>
                    <CooldownInProgress>
                      Cooldown in progress
                    </CooldownInProgress>
                    <CooldownCountDown>
                      <StakingCountdown
                        timeObject={secondsToTime(Number(seconds))}
                      />
                    </CooldownCountDown>
                    <MyStatsValue>
                      <strong>
                        {formatPercentage(stake.claimedAmount / 10 ** 18)} FTHM
                      </strong>
                      <span>${formatPercentage(cooldownInUsd)}</span>
                    </MyStatsValue>
                  </>
                )}
                {BigNumber(Number(seconds)).isLessThanOrEqualTo(0) &&
                stake &&
                BigNumber(stake.claimedAmount).isGreaterThan(0) ? (
                  <Grid container>
                    <Grid item xs={6}>
                      <StatsLabel>
                        Ready to withdraw
                        <InfoIcon sx={{ fontSize: "18px" }} />
                      </StatsLabel>
                      <MyStatsValue className={"green"}>
                        <strong>
                          {formatPercentage(
                            Number(stake.claimedAmount) / 10 ** 18
                          )}{" "}
                          FTHM
                        </strong>
                        <span>${formatPercentage(cooldownInUsd)}</span>
                      </MyStatsValue>
                    </Grid>
                    <ButtonGrid item xs={6}>
                      <StatsButton
                        onClick={() => processFlow(FlowType.WITHDRAW)}
                      >
                        Withdraw
                      </StatsButton>
                    </ButtonGrid>
                  </Grid>
                ) : null}
              </MyStatsBlock>
            )}
          </MyStatsBlocks>
        </>
      )}
    </Box>
  );
};

export default StreamStats;
