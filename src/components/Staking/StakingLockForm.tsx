import { FC, useMemo } from "react";
import { Controller } from "react-hook-form";
import { Box, Typography, CircularProgress } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import BigNumber from "bignumber.js";

import useStakingLockForm from "hooks/Staking/useStakingLockForm";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber, formatPercentage } from "utils/format";
import usePricesContext from "context/prices";
import useStakingContext from "context/staking";

import WalletConnectBtn from "components/Common/WalletConnectBtn";
import { BasePaper } from "components/Base/Paper/StyledPaper";
import { StakingPaperTitle } from "components/Base/Typography/StyledTypography";
import PeriodLockInput from "components/Base/Form/PeriodLockInput";
import { BaseErrorBox } from "components/Base/Boxes/StyledBoxes";
import { BaseButtonPrimary } from "components/Base/Buttons/StyledButtons";
import {
  BaseFormInputErrorWrapper,
  BaseFormInputLabel,
  BaseFormInputLogo,
  BaseFormInputUsdIndicator,
  BaseFormInputWrapper,
  BaseFormLabelRow,
  BaseFormSetMaxButton,
  BaseFormTextField,
  BaseFormWalletBalance,
} from "components/Base/Form/StyledForm";

const StakingForm = styled("form")`
  margin-top: 16px;
`;

const StakingLabelWhite = styled("div")`
  color: #fff;
  font-weight: bold;
  width: 100%;
  float: none;
  font-size: 11px;
  text-transform: uppercase;
`;

const StakingLockForm: FC = () => {
  const {
    account,
    balanceError,
    lowInputAmountError,
    lockDays,
    minLockPeriod,
    isLoading,
    approvedBtn,
    approvalPending,
    control,
    handleSubmit,
    onSubmit,
    setMax,
    approveFTHM,
    unlockDate,
    fthmBalance,
  } = useStakingLockForm();

  const { isMaxLockPositionExceeded, maxLockPositions } = useStakingContext();
  const { fthmPrice } = usePricesContext();

  return (
    <BasePaper>
      <StakingPaperTitle>New Stake</StakingPaperTitle>
      <StakingForm onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="stakePosition"
          rules={{ required: true, min: 1 }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <BaseFormInputWrapper>
              <BaseFormLabelRow>
                <BaseFormLabelRow>
                  <BaseFormInputLabel>Staking amount</BaseFormInputLabel>
                </BaseFormLabelRow>
                {fthmBalance ? (
                  <BaseFormWalletBalance>
                    Balance: {formatPercentage(Number(fthmBalance))} FTHM
                  </BaseFormWalletBalance>
                ) : null}
              </BaseFormLabelRow>
              <BaseFormTextField
                error={balanceError || lowInputAmountError || !!error}
                id="outlined-helperText"
                placeholder={"0"}
                type="number"
                helperText={
                  <>
                    {lowInputAmountError && (
                      <BaseFormInputErrorWrapper>
                        <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          Staking amount should be at least 1
                        </Box>
                      </BaseFormInputErrorWrapper>
                    )}
                    {!lowInputAmountError && balanceError && (
                      <BaseFormInputErrorWrapper>
                        <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          You do not have enough FTHM
                        </Box>
                      </BaseFormInputErrorWrapper>
                    )}
                    {!balanceError && !lowInputAmountError && error && (
                      <BaseFormInputErrorWrapper>
                        <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          Field is required
                        </Box>
                      </BaseFormInputErrorWrapper>
                    )}
                  </>
                }
                value={value}
                onChange={onChange}
                data-testid="dao-stakingAmount-input"
              />
              <BaseFormInputUsdIndicator>{`$${formatNumber(
                BigNumber(value || 0)
                  .multipliedBy(fthmPrice)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )}`}</BaseFormInputUsdIndicator>
              <BaseFormInputLogo
                className={"extendedInput"}
                src={getTokenLogoURL("FTHM")}
                alt={"fthm"}
              />
              <BaseFormSetMaxButton onClick={() => setMax(fthmBalance)}>
                Max
              </BaseFormSetMaxButton>
            </BaseFormInputWrapper>
          )}
        />
        <Controller
          control={control}
          name="lockDays"
          rules={{
            required: true,
            min: minLockPeriod,
            max: 365,
            pattern: {
              value: /^[0-9]+$/,
              message: "Value can't be decimal",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <PeriodLockInput
              range={value}
              minLockPeriod={minLockPeriod}
              handleChangeRange={onChange}
              error={error}
            />
          )}
        />

        {useMemo(() => {
          return (
            lockDays && (
              <>
                <StakingLabelWhite sx={{ mt: "8px" }}>
                  Unlock date
                </StakingLabelWhite>
                <Typography fontSize={"12px"} component={"span"}>
                  {unlockDate}
                </Typography>
              </>
            )
          );
        }, [lockDays, unlockDate])}

        {isMaxLockPositionExceeded && (
          <BaseErrorBox sx={{ width: "100%" }}>
            <InfoIcon />
            <Typography>
              Limit of {maxLockPositions} open positions has been exceeded.
              Please close some positions to open new ones.
            </Typography>
          </BaseErrorBox>
        )}

        <Box mt={2}>
          {!account ? (
            <WalletConnectBtn
              fullwidth
              sx={{ height: "48px", fontSize: "17px" }}
              testId="dao-connect-wallet-button"
            />
          ) : (
            <>
              {approvedBtn ? (
                <BaseButtonPrimary
                  onClick={approveFTHM}
                  isLoading={approvalPending}
                  disabled={approvalPending}
                  sx={{ width: "100%", height: "48px", fontSize: "17px" }}
                  data-testid="dao-approve-button"
                >
                  {approvalPending ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Approve FTHM"
                  )}
                </BaseButtonPrimary>
              ) : (
                <BaseButtonPrimary
                  isLoading={isLoading}
                  disabled={isLoading || isMaxLockPositionExceeded}
                  type="submit"
                  sx={{ width: "100%", height: "48px", fontSize: "17px" }}
                  data-testid="dao-stake-button"
                >
                  {isLoading ? <CircularProgress size={30} /> : "Stake"}
                </BaseButtonPrimary>
              )}
            </>
          )}
        </Box>
      </StakingForm>
    </BasePaper>
  );
};

export default StakingLockForm;
