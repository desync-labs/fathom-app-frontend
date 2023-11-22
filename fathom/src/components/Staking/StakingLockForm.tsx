import React, { FC, useMemo } from "react";
import { Controller } from "react-hook-form";
import { Box, Slider, Grid, Typography, CircularProgress } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { WalletBalance } from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  MaxButton,
} from "components/AppComponents/AppButton/AppButton";
import useStakingLockForm from "hooks/useStakingLockForm";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import Period from "components/Staking/Components/Period";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency, formatNumber, formatPercentage } from "utils/format";

import usePricesContext from "context/prices";
import BigNumber from "bignumber.js";

const StakingLockPaper = styled(AppPaper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 32px 50px;
  gap: 35px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 20px 12px 25px;
  }
  form {
    width: 100%;
  }
`;

const StakingLabelWhite = styled("div")`
  color: #fff;
  font-weight: bold;
  width: 100%;
  float: none;
  font-size: 11px;
  text-transform: uppercase;
`;

const WalletBalanceTypography = styled("h3")`
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  margin-top: 30px;
`;

const WalletBalanceWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const BalanceImg = styled("img")`
  background: #000c24;
  width: 24px;
  height: 24px;
  border-radius: 12px;
`;

const FTHMBalance = styled(Box)`
  font-size: 16px;
  strong {
    font-size: 18px;
  }
`;

const USDBalance = styled(Box)`
  font-size: 14px;
  color: #9fadc6;
`;

const StakingLockFormTitle = styled("h2")`
  font-weight: 600;
  font-size: 28px;
  line-height: 32px;
  width: 100%;
  text-align: left;
  margin: 0;
`;

const StakingLockForm: FC = () => {
  const {
    balanceError,
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
    setPeriod,
    unlockDate,
    fthmBalance,
    fxdBalance,
    xdcBalance,
  } = useStakingLockForm();

  const { fthmPrice, wxdcPrice, fxdPrice } = usePricesContext();

  return (
    <StakingLockPaper>
      <StakingLockFormTitle>New Stake</StakingLockFormTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="stakePosition"
          rules={{ required: true, min: 1 }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <AppFormLabel>Staking amount</AppFormLabel>
              {fthmBalance ? (
                <WalletBalance>
                  Available: {formatPercentage(fthmBalance)} FTHM
                </WalletBalance>
              ) : null}
              <AppFormInputWrapper>
                <AppTextField
                  error={balanceError || !!error}
                  id="outlined-helperText"
                  placeholder={"0"}
                  type="number"
                  helperText={
                    <>
                      {error && (
                        <Box component={"span"} sx={{ fontSize: "12px" }}>
                          Field is required
                        </Box>
                      )}
                      {balanceError && (
                        <>
                          <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                          <Box component={"span"} sx={{ fontSize: "12px" }}>
                            You do not have enough FTHM
                          </Box>
                        </>
                      )}
                    </>
                  }
                  value={value}
                  onChange={onChange}
                />
                <AppFormInputLogo src={getTokenLogoURL("FTHM")} />
                <MaxButton onClick={() => setMax(fthmBalance)}>Max</MaxButton>
              </AppFormInputWrapper>
            </>
          )}
        />
        <Controller
          control={control}
          name="lockDays"
          rules={{ required: true, min: minLockPeriod, max: 365 }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <AppFormInputWrapper>
                <AppFormLabel>Lock period</AppFormLabel>
                <AppTextField
                  error={!!error}
                  sx={{
                    input: {
                      paddingLeft: "10px",
                    },
                  }}
                  helperText={
                    <>
                      {error && error.type === "min" && (
                        <Box component="span" sx={{ fontSize: "12px" }}>
                          Minimum period is {minLockPeriod} days
                        </Box>
                      )}
                      {error && error.type === "max" && (
                        <Box component="span" sx={{ fontSize: "12px" }}>
                          Maximum period is 365 days
                        </Box>
                      )}
                      {error && error.type === "required" && (
                        <Box component={"span"} sx={{ fontSize: "12px" }}>
                          Field is required
                        </Box>
                      )}
                    </>
                  }
                  id="outlined-helperText"
                  value={value}
                  type="number"
                  onChange={onChange}
                />
                <MaxButton sx={{ color: "#6379A1", background: "none" }}>
                  Days
                </MaxButton>
              </AppFormInputWrapper>

              <Box>
                <Slider
                  valueLabelDisplay="auto"
                  step={1}
                  min={minLockPeriod}
                  max={365}
                  value={value}
                  onChange={onChange}
                />
              </Box>
            </>
          )}
        />

        <StakingLabelWhite sx={{ mt: "25px", mb: "12px" }}>
          Recommended period
        </StakingLabelWhite>

        <Period lockDays={lockDays} setPeriod={setPeriod} />

        {useMemo(() => {
          return (
            lockDays && (
              <>
                <StakingLabelWhite sx={{ mt: "25px" }}>
                  Unlock date
                </StakingLabelWhite>
                <Typography fontSize={"12px"} component={"span"}>
                  {unlockDate}
                </Typography>
              </>
            )
          );
        }, [lockDays, unlockDate])}

        <Grid container mt={3}>
          {approvedBtn ? (
            <ButtonPrimary
              onClick={approveFTHM}
              isLoading={approvalPending}
              disabled={approvalPending}
              sx={{ width: "100%", height: "48px" }}
            >
              {approvalPending ? (
                <CircularProgress size={20} />
              ) : (
                "Approve FTHM"
              )}
            </ButtonPrimary>
          ) : (
            <ButtonPrimary
              isLoading={isLoading}
              disabled={isLoading}
              type="submit"
              sx={{ width: "100%", height: "48px" }}
            >
              {isLoading ? <CircularProgress size={30} /> : "Stake"}
            </ButtonPrimary>
          )}

          <Grid item xs={12}>
            <WalletBalanceTypography>My Wallet Balance</WalletBalanceTypography>

            <Grid container spacing={2}>
              <Grid item xs={7}>
                <WalletBalanceWrapper>
                  <BalanceImg
                    src={getTokenLogoURL("FTHM")}
                    alt={"fthm"}
                    width={24}
                  />
                  <Box>
                    <FTHMBalance>
                      <strong>{formatNumber(fthmBalance)}</strong> FTHM
                    </FTHMBalance>
                    <USDBalance>
                      {formatCurrency(
                        BigNumber(fthmBalance)
                          .multipliedBy(fthmPrice)
                          .dividedBy(10 ** 18)
                          .toNumber()
                      )}
                    </USDBalance>
                  </Box>
                </WalletBalanceWrapper>
              </Grid>
              <Grid item xs={5}>
                <WalletBalanceWrapper>
                  <BalanceImg
                    src={getTokenLogoURL("FXD")}
                    alt={"fxd"}
                    width={24}
                  />
                  <Box>
                    <FTHMBalance>
                      <strong>{formatNumber(fxdBalance)}</strong> FXD
                    </FTHMBalance>
                    <USDBalance>
                      {formatCurrency(
                        BigNumber(fxdBalance)
                          .multipliedBy(fxdPrice)
                          .dividedBy(10 ** 18)
                          .toNumber()
                      )}
                    </USDBalance>
                  </Box>
                </WalletBalanceWrapper>
              </Grid>
              <Grid item xs={6}>
                <WalletBalanceWrapper>
                  <BalanceImg
                    src={getTokenLogoURL("WXDC")}
                    alt={"xdc"}
                    width={24}
                  />
                  <Box>
                    <FTHMBalance>
                      <strong>{formatNumber(xdcBalance)}</strong> XDC
                    </FTHMBalance>
                    <USDBalance>
                      {formatCurrency(
                        BigNumber(xdcBalance)
                          .multipliedBy(wxdcPrice)
                          .dividedBy(10 ** 18)
                          .toNumber()
                      )}
                    </USDBalance>
                  </Box>
                </WalletBalanceWrapper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </StakingLockPaper>
  );
};

export default StakingLockForm;
