import { memo, useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Step,
  StepContent,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import useSharedContext from "context/shared";
import useVaultContext from "context/vault";
import { getPeriodInDays } from "utils/getPeriodInDays";
import { VaultPaper } from "components/AppComponents/AppPaper/AppPaper";
import { AppFlexBox, WarningBox } from "components/AppComponents/AppBox/AppBox";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";
import BasePopover from "components/Base/Popover/BasePopover";
import { InfoIcon } from "components/Governance/Propose";

import LockAquaSrc from "assets/svg/lock-aqua.svg";
import StepperItemIcon from "assets/svg/icons/stepper-item-icon.svg";
import StepperItemIconActive from "assets/svg/icons/stepper-item-icon-active.svg";

const SummaryWrapper = styled(AppFlexBox)`
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const CustomPaper = styled(Box)`
  width: 100%;
  border-radius: 12px;
  background: #1e2f4d;
  padding: 16px;

  &.withdraw-btn {
    display: flex;
    align-items: center;
    width: fit-content;
    height: inherit;
    padding: 24px;

    button {
      height: 48px;
      width: 274px;
      font-size: 17px;
      padding: 8px 16px;
    }
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    &.withdraw-btn {
      width: 100%;

      button {
        width: 100%;
      }
    }
  }
`;

export const AppStepper = styled(Stepper)`
  & .MuiStepConnector-root {
    margin-left: 8px;
  }
  & .MuiStepConnector-line {
    border-color: #3d5580;
    border-left-width: 2px;
    min-height: 12px;
  }
`;

export const AppStep = styled(Step)`
  position: relative;
  & .MuiStepLabel-root {
    padding: 2px 0;
  }
  & .MuiStepLabel-label {
    color: #b7c8e5;
    font-size: 13px;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.5px;

    &.Mui-completed {
      color: #b7c8e5;
      font-weight: 600;
    }
    &.Mui-active {
      color: #b7c8e5;
      font-weight: 600;
    }
  }

  & .MuiStepContent-root {
    color: #f5953d;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    border: none;
    padding: 0;
    margin: 0;
  }
`;

export const StepLabelOptionalValue = styled("div")`
  position: absolute;
  right: 0;
  top: 1px;
  height: 20px;
  color: #43fff1;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  border: none;
  padding: 0;
  margin: 0;
`;

export const CounterIndicator = styled("div")`
  color: #f5953d;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

export const LockWrapper = styled(Box)`
  display: flex;
  gap: 4px;
`;

export const QontoStepIconRoot = styled("div")<{
  ownerState: { active?: boolean };
}>(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
}));

export const QontoStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <img
          src={StepperItemIconActive}
          alt={"step-active"}
          width={18}
          height={18}
        />
      ) : (
        <img src={StepperItemIcon} alt={"step"} width={18} height={18} />
      )}
    </QontoStepIconRoot>
  );
};

export const calculateTimeLeft = (date: Date | null) => {
  if (!date) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const difference = +date - +new Date();
  let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export const StepContentCounter = memo(({ date }: { date: Date }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <CounterIndicator>
      {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M :{" "}
      {timeLeft.seconds}S
    </CounterIndicator>
  );
});

const VaultLockingBar = () => {
  const { isMobile } = useSharedContext();
  const {
    vaultPosition,
    tfVaultDepositEndDate,
    tfVaultLockEndDate,
    activeTfPeriod,
    handleWithdrawAll,
    isWithdrawAllLoading,
    showWithdrawAllButton,
    isShowWithdrawAllButtonLoading,
    tfVaultDepositEndTimeLoading,
    tfVaultLockEndTimeLoading,
  } = useVaultContext();

  const [lockPeriodsLoading, setLockPeriodsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLockPeriodsLoading(
        tfVaultDepositEndTimeLoading || tfVaultLockEndTimeLoading
      );
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    tfVaultDepositEndTimeLoading,
    tfVaultLockEndTimeLoading,
    setLockPeriodsLoading,
  ]);

  const steps = useMemo(() => {
    return [
      {
        key: "deposit-time", // added key to the object
        label: (
          <LockWrapper>
            Deposit Time
            <BasePopover
              id={"deposit-time"}
              text={
                <>
                  Deposit Time - the period when users are allowed to deposit
                  and withdraw funds.
                </>
              }
              iconSize={"14px"}
            />
          </LockWrapper>
        ),
        date:
          lockPeriodsLoading || !tfVaultDepositEndDate
            ? null
            : new Date(Number(tfVaultDepositEndDate) * 1000),
      },
      {
        key: "lock-time", // added key to the object
        label: (
          <LockWrapper>
            Lock Time (
            {getPeriodInDays(tfVaultDepositEndDate, tfVaultLockEndDate)} days)
            <BasePopover
              id={"lock-time"}
              text={
                <>
                  Lock Time - the period of time when deposited funds are used
                  to generate yield according to the strategy. <br />
                  Users can’t withdraw and deposit any funds within this period.{" "}
                  After the lock period ends, users can withdraw funds.
                </>
              }
              iconSize={"14px"}
            />
          </LockWrapper>
        ),
        date:
          lockPeriodsLoading || !tfVaultLockEndDate
            ? null
            : new Date(Number(tfVaultLockEndDate) * 1000),
      },
    ];
  }, [tfVaultDepositEndDate, tfVaultLockEndDate, lockPeriodsLoading]);

  return (
    <VaultPaper sx={{ marginBottom: isMobile ? "20px" : "24px" }}>
      <SummaryWrapper>
        <img src={LockAquaSrc} alt={"locked-active"} width={24} height={24} />
        <Typography variant="h3" sx={{ fontSize: isMobile ? "14px" : "16px" }}>
          Locking Period
        </Typography>
      </SummaryWrapper>
      <AppFlexBox
        mt="12px"
        sx={{
          flexDirection: isMobile ? "column" : "row",
          alignItems: "stretch",
        }}
      >
        <CustomPaper>
          <AppStepper activeStep={activeTfPeriod} orientation="vertical">
            {steps.map((step, index) => (
              <AppStep key={step.key}>
                <AppFlexBox>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    optional={
                      index < activeTfPeriod ? (
                        <StepLabelOptionalValue>
                          Completed
                        </StepLabelOptionalValue>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    {step.date === null ? (
                      <CustomSkeleton
                        animation={"wave"}
                        variant={"rounded"}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <StepContentCounter date={step.date} />
                    )}
                  </StepContent>
                </AppFlexBox>
              </AppStep>
            ))}
          </AppStepper>
          {activeTfPeriod === 2 &&
            !showWithdrawAllButton &&
            !isShowWithdrawAllButtonLoading && (
              <WarningBox sx={{ margin: "10px 0 0" }}>
                <InfoIcon
                  sx={{ width: "20px", color: "#F5953D", height: "20px" }}
                />
                <Box flexDirection="column">
                  <Typography width="100%">
                    Please wait for funds to be processed by counterparty.
                  </Typography>
                </Box>
              </WarningBox>
            )}
        </CustomPaper>
        {activeTfPeriod > 0 && (
          <CustomPaper className="withdraw-btn">
            <ButtonPrimary
              type="button"
              disabled={
                !vaultPosition ||
                vaultPosition.balanceShares === "0" ||
                !vaultPosition.balanceShares ||
                activeTfPeriod < 2 ||
                isWithdrawAllLoading ||
                !showWithdrawAllButton
              }
              onClick={handleWithdrawAll}
              isLoading={isWithdrawAllLoading}
            >
              {isWithdrawAllLoading ? (
                <CircularProgress sx={{ color: "#0D1526" }} size={20} />
              ) : (
                "Withdraw all"
              )}
            </ButtonPrimary>
          </CustomPaper>
        )}
      </AppFlexBox>
    </VaultPaper>
  );
};

export default memo(VaultLockingBar);
