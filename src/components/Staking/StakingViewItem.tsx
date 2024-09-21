import { FC, memo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import BigNumber from "bignumber.js";
import { ILockPosition } from "fathom-sdk";

import useStakingItemView from "hooks/Staking/useStakingItemView";
import { FlowType } from "hooks/Staking/useStakingView";
import { formatPercentage } from "utils/format";
import { secondsToTime } from "utils/secondsToTime";

import StakingCountdown from "components/Staking/StakingCountdown";
import BasePopover from "components/Base/Popover/BasePopover";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import { BaseButtonSecondary } from "components/Base/Buttons/StyledButtons";

export const StakingViewItemWrapper = styled(Box)`
  border-radius: 8px;
  border: 1px solid #2c4066;
  background: #132340;
  padding: 16px 24px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 12px;
  }
`;

export const RewardsUnStakeWrapper = styled(BaseFlexBox)`
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  max-width: 380px;
  background: #091433;
  border-radius: 8px;
  padding: 16px 24px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    gap: 16px;
  }
`;

export const Index = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: #2c4066;
  color: #43fff1;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
`;

export const Label = styled(Box)`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #fff;
`;

export const Value = styled(Box)`
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;

  &.flex {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  &.green {
    color: #43fff1;
    text-transform: uppercase;
  }
  &.orange {
    color: #f5953d;
  }

  div {
    color: #fff;
  }

  span {
    display: block;
    font-weight: 400;
    line-height: 12px;
    font-size: 10px;
    color: #9fadc6;
  }
`;

export const Penalty = styled(Typography)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 4px;
  color: #fff;
  &.penalty {
    color: #f76e6e;
  }
`;

export const CoolDownInfo = styled(Box)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #b7c8e5;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    align-items: start;
  }
`;

const StakingViewItemButton = styled(BaseButtonSecondary)`
  height: 32px;
  font-size: 13px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

export const Spacer = styled(Box)`
  margin-top: 12px;
`;

type StakingViewItemPropsType = {
  lockPosition: ILockPosition;
  token: string;
};

const StakingViewItem: FC<StakingViewItemPropsType> = ({
  lockPosition,
  token,
}) => {
  const {
    processFlow,
    isUnlockable,
    penaltyFee,
    seconds,
    rewardsAvailable,
    fthmPriceFormatted,
  } = useStakingItemView(lockPosition);

  return (
    <StakingViewItemWrapper data-testid={`dao-position-${lockPosition.lockId}`}>
      <Grid container spacing={1} alignItems="center">
        <Grid item sm={2} xs={7}>
          <BaseFlexBox sx={{ justifyContent: "flex-start", gap: "20px" }}>
            <Index>{lockPosition.lockId}</Index>
            <Box>
              <Label>Locked Amount</Label>
              <Value
                data-testid={`dao-position-${lockPosition.lockId}-lockedValue`}
              >
                {formatPercentage(lockPosition.amount / 10 ** 18)} {token}
                <span>
                  $
                  {formatPercentage(
                    (lockPosition.amount / 10 ** 18) * fthmPriceFormatted
                  )}
                </span>
              </Value>
            </Box>
          </BaseFlexBox>
        </Grid>
        <Grid item sm={2} xs={5}>
          <Label>Locking Time</Label>
          <Value
            className={"orange flex"}
            data-testid={`dao-position-${lockPosition.lockId}-lockingTimeValue`}
          >
            {seconds > 0 ? (
              <StakingCountdown timeObject={secondsToTime(seconds)} />
            ) : (
              <Box>0 days left</Box>
            )}
          </Value>
          <Spacer />
        </Grid>
        <Grid
          item
          xs={7}
          sm={1.5}
          sx={(theme) => ({
            [theme.breakpoints.only("xs")]: {
              display: "flex",
              gap: "20px",
            },
          })}
        >
          <Box sx={{ width: "36px" }}></Box>
          <Box>
            <Label>Rewards Accrued</Label>
            <Value
              className={"green"}
              data-testid={`dao-position-${lockPosition.lockId}-rewardsAccruedValue`}
            >
              {formatPercentage(
                BigNumber(rewardsAvailable)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )}{" "}
              {token}
              <span>
                $
                {formatPercentage(
                  BigNumber(rewardsAvailable)
                    .dividedBy(10 ** 18)
                    .multipliedBy(fthmPriceFormatted)
                    .toNumber()
                )}
              </span>
            </Value>
          </Box>
        </Grid>
        <Grid item xs={5} sm={1.5}>
          <Label>Voting Power</Label>
          <Value
            data-testid={`dao-position-${lockPosition.lockId}-votingPowerValue`}
          >
            {lockPosition.nVoteToken
              ? `${formatPercentage(lockPosition.nVoteToken / 10 ** 18)} vFTHM`
              : "None"}
            <Spacer />
          </Value>
        </Grid>
        <Grid
          item
          xs={12}
          sm={5}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <RewardsUnStakeWrapper>
            <Box>
              <Penalty
                className={isUnlockable(seconds) ? "" : "penalty"}
                data-testid={`dao-position-${lockPosition.lockId}-penaltyFee`}
              >
                {isUnlockable(seconds)
                  ? "Penalty Fee: No"
                  : `Penalty Fee: Yes (${penaltyFee}%)`}
              </Penalty>
              <CoolDownInfo
                data-testid={`dao-position-${lockPosition.lockId}-cooldownInfo`}
              >
                Cooldown Period: 5 days
                <BasePopover
                  id={`cooldown-info-${lockPosition.lockId}`}
                  text={
                    <>
                      The period of time after which the amount can be
                      withdrawn. <br />
                      Cooldown is implemented as a protection mechanism for the
                      Fathom ecosystem. It prevents malicious behavior, limits
                      the number of withdrawals, and protects the Governance
                      system from being overused and vulnerable to a Sybil
                      attack.
                    </>
                  }
                />
              </CoolDownInfo>
            </Box>
            {isUnlockable(seconds) ? (
              <StakingViewItemButton
                onClick={() => processFlow(FlowType.UNSTAKE, lockPosition)}
                data-testid={`dao-position-${lockPosition.lockId}-unstakeButton`}
              >
                Unstake
              </StakingViewItemButton>
            ) : (
              <StakingViewItemButton
                onClick={() =>
                  processFlow(FlowType.EARLY_UNSTAKE, lockPosition)
                }
                data-testid={`dao-position-${lockPosition.lockId}-earlyUnstakeButton`}
              >
                Early Unstake
              </StakingViewItemButton>
            )}
          </RewardsUnStakeWrapper>
        </Grid>
      </Grid>
    </StakingViewItemWrapper>
  );
};

export default memo(StakingViewItem);
