import { Box, StepContent, StepLabel, styled } from "@mui/material";
import { CustomSkeleton } from "components/AppComponents/AppSkeleton/AppSkeleton";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import {
  AppStep,
  AppStepper,
  QontoStepIcon,
  StepContentCounter,
  StepLabelOptionalValue,
} from "components/Vaults/VaultDetail/VaultLockingBar";

const CustomPaper = styled(Box)`
  position: relative;
  width: 100%;
  border-radius: 12px;
  background: #1e2f4d;
  padding: 16px;
  margin-bottom: 20px;
`;

const VaultModalLockingBar = ({
  activeTfPeriod,
  tfVaultDepositEndDate,
  tfVaultLockEndDate,
}: {
  activeTfPeriod: number;
  tfVaultDepositEndDate: string | null;
  tfVaultLockEndDate: string | null;
}) => {
  const steps = [
    {
      label: "Deposit Time",
      date:
        tfVaultDepositEndDate === null
          ? tfVaultDepositEndDate
          : new Date(Number(tfVaultDepositEndDate) * 1000),
    },
    {
      label: "Lock Time",
      date:
        tfVaultLockEndDate === null
          ? tfVaultLockEndDate
          : new Date(Number(tfVaultLockEndDate) * 1000),
    },
  ];
  return (
    <CustomPaper>
      <AppStepper activeStep={activeTfPeriod} orientation="vertical">
        {steps.map((step, index) => (
          <AppStep key={step.label}>
            <AppFlexBox>
              <StepLabel
                StepIconComponent={QontoStepIcon}
                optional={
                  index < activeTfPeriod ? (
                    <StepLabelOptionalValue>Completed</StepLabelOptionalValue>
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
    </CustomPaper>
  );
};

export default VaultModalLockingBar;
