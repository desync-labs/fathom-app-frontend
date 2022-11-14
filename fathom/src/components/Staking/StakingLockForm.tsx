import {
  Box,
  Slider,
  Grid,
  Typography,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Controller } from "react-hook-form";
import React, { FC, useMemo } from "react";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { WalletBalance } from "components/AppComponents/AppBox/AppBox";
import InfoIcon from "@mui/icons-material/Info";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  ButtonPrimary,
  MaxButton,
} from "components/AppComponents/AppButton/AppButton";
import useStakingLockForm from "hooks/useStakingLockForm";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import { styled } from "@mui/material/styles";

export type StakingLockFormPropsType = {
  fetchOverallValues: (account: string) => Promise<void>;
};

const StakingLockPaper = styled(AppPaper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  gap: 24px;

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

const StakingChip = styled(Chip)<{ active: boolean }>`
  background: ${({ active }) =>
    active ? "transparent" : "rgba(79, 101, 140, 0.2)"};
  border-radius: 6px;
  width: 19%;
  cursor: pointer;
  border: ${({ active }) =>
    active ? "1px solid rgba(79, 101, 140, 0.2)" : "none"};

  &:active {
    border: 1px solid rgba(79, 101, 140, 0.2);
    background: transparent;
  }
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

const StakingLockFormTitle = styled('h2')`
  font-weight: 600;
  font-size: 28px;
  line-height: 32px;
  width: 100%;
  text-align: left;
  margin: 0;
`

const StakingLockForm: FC<StakingLockFormPropsType> = ({
  fetchOverallValues,
}) => {
  const {
    balanceError,
    lockDays,
    approvedBtn,
    approvalPending,
    control,
    handleSubmit,
    onSubmit,
    setMax,
    approveFTHM,
    setPeriod,
    unlockDate,
    walletBalance,
  } = useStakingLockForm(fetchOverallValues);

  return (
    <StakingLockPaper>
      <StakingLockFormTitle>New Stake</StakingLockFormTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="stakePosition"
          rules={{ required: true, min: 1 }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppFormInputWrapper>
              <AppFormLabel>Staking amount</AppFormLabel>
              {walletBalance ? (
                <WalletBalance>Available: {walletBalance} FTHM</WalletBalance>
              ) : null}
              <AppTextField
                error={balanceError}
                id="outlined-helperText"
                helperText={
                  balanceError ? (
                    <>
                      <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                      <Typography
                        sx={{ fontSize: "12px", paddingLeft: "22px" }}
                      >
                        You do not have enough FTHM
                      </Typography>
                    </>
                  ) : null
                }
                value={value}
                onChange={onChange}
              />
              <AppFormInputLogo src={getTokenLogoURL("FTHM")} />
              <MaxButton onClick={() => setMax(walletBalance)}>Max</MaxButton>
            </AppFormInputWrapper>
          )}
        />
        <Controller
          control={control}
          name="lockDays"
          rules={{ required: true, min: 1, max: 365 }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <AppFormInputWrapper>
                <AppFormLabel>Lock period</AppFormLabel>
                <AppTextField
                  sx={{
                    input: {
                      paddingLeft: "10px",
                    },
                  }}
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
                  min={0}
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

        {useMemo(
          () => (
            <Stack direction="row" spacing={1}>
              <StakingChip
                active={lockDays === 30}
                label="1-Month"
                onClick={() => setPeriod(30)}
              />
              <StakingChip
                active={lockDays === 60}
                label="2-Month"
                onClick={() => setPeriod(60)}
              />
              <StakingChip
                active={lockDays === 90}
                label="3-Month"
                onClick={() => setPeriod(90)}
              />
              <StakingChip
                active={lockDays === 180}
                label="Half-Year"
                onClick={() => setPeriod(180)}
              />
              <StakingChip
                active={lockDays === 360}
                label="1-Year"
                onClick={() => setPeriod(360)}
              />
            </Stack>
          ),
          [lockDays, setPeriod]
        )}

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
          <ButtonPrimary type="submit" sx={{ width: "100%", height: "48px" }}>
            Stake
          </ButtonPrimary>

          <Grid item xs={12}>
            <WalletBalanceTypography>My Wallet Balance</WalletBalanceTypography>

            <WalletBalanceWrapper>
              <BalanceImg
                src={getTokenLogoURL("FTHM")}
                alt={"fthm"}
                width={24}
              />
              <Box>
                <FTHMBalance>
                  <strong>{walletBalance}</strong> FTHM
                </FTHMBalance>
                <USDBalance>$123.00</USDBalance>
              </Box>
            </WalletBalanceWrapper>
          </Grid>

          <Grid xs={7} item>
            {approvedBtn ? (
              <ButtonPrimary onClick={approveFTHM} sx={{ mt: 3 }}>
                {approvalPending ? (
                  <CircularProgress size={20} />
                ) : (
                  "Approve FTHM"
                )}
              </ButtonPrimary>
            ) : null}
          </Grid>
        </Grid>
      </form>
    </StakingLockPaper>
  );
};

export default StakingLockForm;
