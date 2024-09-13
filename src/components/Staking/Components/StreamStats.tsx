import { FC, useMemo } from "react";
import BigNumber from "bignumber.js";
import { Box, Grid, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import { XDC_ADDRESSES, APOTHEM_ADDRESSES } from "fathom-sdk";

import { formatCompact, formatNumber, formatPercentage } from "utils/format";
import { secondsToTime } from "utils/secondsToTime";
import useStreamStats from "hooks/Staking/useStreamStats";
import { FlowType } from "hooks/Staking/useStakingView";

import StakingCountdown from "components/Staking/StakingCountdown";
import { BasePaper } from "components/Base/Paper/StyledPaper";
import { StakingPaperTitle } from "components/Base/Typography/StyledTypography";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import {
  BaseListItem,
  BaseListStakingStats,
} from "components/Base/List/StyledList";
import {
  BaseButtonOutlined,
  BaseButtonPrimary,
  BaseButtonPrimaryLink,
} from "components/Base/Buttons/StyledButtons";

import PercentSrc from "assets/svg/percent.svg";
import LockedSrc from "assets/svg/locked.svg";
import RewardsSrc from "assets/svg/rewards.svg";
import PriceSrc from "assets/svg/price.svg";
import useConnector from "context/connector";

const StatsBlocks = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px 8px;
  width: 100%;
  padding: 16px 0;
  border-bottom: 1px solid #1d2d49;
`;

const StatsBlock = styled(Box)`
  display: flex;
  align-items: center;
  width: calc(50% - 4px);
  gap: 8px;
  padding: 0;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: calc(45% - 4px);
    &:nth-child(2n) {
        width: 52%;
    },
  }
`;

const StatsLabel = styled("span")`
  display: inline-block;
  color: #b7c8e5;
  font-size: 11px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-bottom: 8px;
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

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    align-items: start;
    gap: 0;
  }
`;

const BulkActionBtnWrapper = styled(Grid)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;

  & > button {
    width: 100%;
    font-size: 14px;
  }
`;

const CooldownCountDown = styled(Box)`
  color: #f5953d;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

const NoCooldownText = styled(Box)`
  color: #43fff1;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.5px;
  text-transform: capitalize;
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
  const { chainId } = useConnector();

  const addresses = useMemo(() => {
    return chainId === 50 ? XDC_ADDRESSES : APOTHEM_ADDRESSES;
  }, [chainId]);

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

  return (
    <BasePaper>
      <BaseFlexBox>
        <StakingPaperTitle>FTHM Stream</StakingPaperTitle>
        <BaseButtonPrimaryLink
          href={`#/swap?inputCurrency=${addresses["FXD"]}&outputCurrency=${addresses["FTHM_TOKEN"]}`}
        >
          Buy FTHM on DEX
        </BaseButtonPrimaryLink>
      </BaseFlexBox>
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
                <Box>
                  <strong>
                    {formatNumber(protocolStatsInfo.totalStakeFTHM / 10 ** 18)}
                  </strong>{" "}
                  FTHM
                </Box>
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
            <StatsLabel>Daily rewards</StatsLabel>
            {protocolStatsInfo && (
              <StatsValue>
                <Box>
                  <strong>
                    {formatNumber(protocolStatsInfo.oneDayRewards / 10 ** 18)}
                  </strong>{" "}
                  FTHM
                </Box>
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
        <StatsBlock>
          <img src={PriceSrc} alt={"price"} />
          <Box>
            <StatsLabel>Price</StatsLabel>
            {protocolStatsInfo && (
              <StatsValue>
                <strong>
                  $
                  {fthmPriceFormatted
                    ? formatPercentage(fthmPriceFormatted)
                    : 0}
                </strong>
              </StatsValue>
            )}
          </Box>
        </StatsBlock>
      </StatsBlocks>

      <StakingPaperTitle sx={{ paddingTop: "16px", paddingBottom: "10px" }}>
        My Stats
      </StakingPaperTitle>
      <BaseListStakingStats>
        <BaseListItem
          secondaryAction={
            <>
              {stake ? formatPercentage(stake.accruedVotes / 10 ** 18) : "0"}{" "}
              vFTHM
            </>
          }
        >
          <ListItemText primary="Total voting power" />
        </BaseListItem>
        <BaseListItem
          secondaryAction={
            <>
              {stake ? (
                <>
                  {formatPercentage(stake.totalStaked / 10 ** 18)} FTHM
                  <span>
                    $
                    {formatNumber(
                      (stake.totalStaked / 10 ** 18) * fthmPriceFormatted
                    )}
                  </span>
                </>
              ) : (
                "0 FTHM"
              )}
            </>
          }
        >
          <ListItemText primary="Total locked" />
        </BaseListItem>
        <BaseListItem
          secondaryAction={
            <>
              {stake && BigNumber(totalRewards).isGreaterThan(0.0001) ? (
                <>
                  {formatPercentage(
                    BigNumber(totalRewards)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )}{" "}
                  FTHM
                  <span>${formatNumber(totalrewardsInUsd)}</span>
                </>
              ) : (
                "0 FTHM"
              )}
            </>
          }
        >
          <ListItemText primary="Total claimable rewards" />
        </BaseListItem>
        <BaseListItem
          secondaryAction={
            <>
              {BigNumber(Number(seconds)).isLessThanOrEqualTo(0) &&
              stake &&
              BigNumber(stake.claimedAmount).isGreaterThan(0) ? (
                <>
                  {formatPercentage(Number(stake.claimedAmount) / 10 ** 18)}{" "}
                  FTHM <span>${formatNumber(cooldownInUsd)}</span>
                </>
              ) : (
                "0 FTHM"
              )}
            </>
          }
        >
          <ListItemText primary="Ready to withdraw" />
        </BaseListItem>
      </BaseListStakingStats>

      <BaseFlexBox sx={{ paddingTop: "16px" }}>
        {BigNumber(Number(seconds)).isGreaterThan(0) ? (
          <>
            <NoCooldownText>Cooldown in progress</NoCooldownText>
            <CooldownCountDown>
              <StakingCountdown timeObject={secondsToTime(Number(seconds))} />
            </CooldownCountDown>
          </>
        ) : (
          <NoCooldownText>You have no cooldown</NoCooldownText>
        )}
      </BaseFlexBox>

      <BulkActionBtnWrapper>
        <BaseButtonPrimary
          disabled={BigNumber(totalRewards).isLessThanOrEqualTo(0)}
          onClick={() => processFlow(FlowType.CLAIM)}
        >
          Claim all rewards
        </BaseButtonPrimary>
        <BaseButtonOutlined
          disabled={
            !stake ||
            !BigNumber(Number(seconds)).isLessThanOrEqualTo(0) ||
            !BigNumber(stake.claimedAmount).isGreaterThan(0)
          }
          onClick={() => processFlow(FlowType.WITHDRAW)}
        >
          Withdraw
        </BaseButtonOutlined>
      </BulkActionBtnWrapper>
    </BasePaper>
  );
};

export default StreamStats;
