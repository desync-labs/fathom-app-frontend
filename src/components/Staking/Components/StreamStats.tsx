import { FC, useMemo } from "react";
import BigNumber from "bignumber.js";
import { Box, Grid, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import { XDC_ADDRESSES, APOTHEM_ADDRESSES } from "fathom-sdk";

import { formatNumber, formatPercentage } from "utils/format";
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
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

import useConnector from "context/connector";
import useSharedContext from "context/shared";

import ProtocolStats from "./ProtocolStats";

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
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
  }
`;

const NoCooldownText = styled(Box)`
  color: #43fff1;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.5px;
  text-transform: capitalize;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 11px;
  }
`;

const StreamStats: FC = () => {
  const {
    stake,
    seconds,
    protocolStatsInfo,
    totalRewards,
    fthmPriceFormatted,
    processFlow,
    stakesLoading,
  } = useStreamStats();
  const { chainId, account } = useConnector();
  const { isMobile } = useSharedContext();

  const addresses = useMemo(() => {
    return chainId === 50 ? XDC_ADDRESSES : APOTHEM_ADDRESSES;
  }, [chainId]);

  const cooldownInUsd = useMemo(() => {
    return stake ? (stake.claimedAmount / 10 ** 18) * fthmPriceFormatted : 0;
  }, [stake, fthmPriceFormatted]);

  const totalRewardsInUsd = useMemo(() => {
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
      <ProtocolStats
        protocolStatsInfo={protocolStatsInfo}
        fthmPriceFormatted={fthmPriceFormatted}
      />
      <StakingPaperTitle sx={{ paddingTop: "16px", paddingBottom: "10px" }}>
        My Stats
      </StakingPaperTitle>
      <BaseListStakingStats>
        <BaseListItem
          secondaryAction={
            <>
              {stakesLoading ? (
                <CustomSkeleton
                  animation={"wave"}
                  height={20}
                  width={isMobile ? 125 : 175}
                />
              ) : stake ? (
                formatPercentage(stake.accruedVotes / 10 ** 18) + " vFTHM"
              ) : (
                "0 vFTHM"
              )}{" "}
            </>
          }
        >
          <ListItemText primary="Total voting power" />
        </BaseListItem>
        <BaseListItem
          secondaryAction={
            <>
              {stakesLoading ? (
                <CustomSkeleton
                  animation={"wave"}
                  height={20}
                  width={isMobile ? 125 : 175}
                />
              ) : stake ? (
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
              {stakesLoading ? (
                <CustomSkeleton
                  animation={"wave"}
                  height={20}
                  width={isMobile ? 125 : 175}
                />
              ) : stake && BigNumber(totalRewards).isGreaterThan(0.0001) ? (
                <>
                  {formatPercentage(
                    BigNumber(totalRewards)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )}{" "}
                  FTHM
                  <span>${formatNumber(totalRewardsInUsd)}</span>
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
              {stakesLoading ? (
                <CustomSkeleton
                  animation={"wave"}
                  height={20}
                  width={isMobile ? 125 : 175}
                />
              ) : stake && BigNumber(stake.claimedAmount).isGreaterThan(0) ? (
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
          <ListItemText
            primary={
              stakesLoading ? (
                <CustomSkeleton
                  animation={"wave"}
                  height={16}
                  width={isMobile ? 125 : 175}
                />
              ) : BigNumber(Number(seconds)).isGreaterThan(0) ? (
                "Cooldown Amount"
              ) : (
                "Ready to withdraw"
              )
            }
          />
        </BaseListItem>
      </BaseListStakingStats>

      <BaseFlexBox sx={{ paddingTop: isMobile ? "6px" : "12px" }}>
        {stakesLoading ? (
          <>
            <CustomSkeleton
              animation={"wave"}
              height={16}
              width={isMobile ? 125 : 175}
            />
            <CustomSkeleton animation={"wave"} height={16} width={150} />
          </>
        ) : BigNumber(Number(seconds)).isGreaterThan(0) ? (
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
          disabled={BigNumber(totalRewards).isLessThanOrEqualTo(0) || !account}
          onClick={() => processFlow(FlowType.CLAIM)}
        >
          Claim all rewards
        </BaseButtonPrimary>
        <BaseButtonOutlined
          disabled={
            !stake ||
            !BigNumber(Number(seconds)).isLessThanOrEqualTo(0) ||
            !BigNumber(stake.claimedAmount).isGreaterThan(0) ||
            !account
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
