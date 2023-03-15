import React from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import {
  ApproveBox,
  ApproveBoxTypography,
  Summary,
  WalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  ApproveButton,
  ButtonPrimary,
  ButtonSecondary,
  ButtonsWrapper,
  MaxButton,
} from "components/AppComponents/AppButton/AppButton";
import useOpenPositionContext from "context/openPosition";

const OpenPositionFormWrapper = styled(Grid)`
  padding-left: 20px;
  width: calc(50% - 1px);
  position: relative;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

const OpenPositionForm = () => {
  const {
    approveBtn,
    approve,
    approvalPending,
    fxdToBeBorrowed,
    balance,
    safeMax,
    openPositionLoading,
    setMax,
    setSafeMax,
    onSubmit,
    control,
    handleSubmit,
    availableFathomInPool,
    onClose,
    pool,
  } = useOpenPositionContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <OpenPositionFormWrapper item>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <Summary>Summary</Summary>

        <Controller
          control={control}
          name="collateral"
          rules={{
            required: true,
            min: 10,
            max: +balance / 10 ** 18,
            pattern: /^[1-9][0-9]*0$/,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppFormInputWrapper>
              <AppFormLabel>Collateral</AppFormLabel>
              {balance ? (
                <WalletBalance>
                  Wallet Available: {+balance / 10 ** 18} {pool.poolName}
                </WalletBalance>
              ) : null}
              <AppTextField
                error={!!error}
                id="outlined-helperText"
                placeholder={"0"}
                helperText={
                  <>
                    {error && error.type === "pattern" && (
                      <>
                        <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          Allowed staked collateral should be multiple of 10
                        </Box>
                      </>
                    )}

                    {error && error.type === "max" && (
                      <>
                        <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          You do not have enough {pool.poolName}
                        </Box>
                      </>
                    )}
                    {error && error.type === "required" && (
                      <>
                        <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          Collateral amount is required
                        </Box>
                      </>
                    )}
                    {error && error.type === "min" && (
                      <>
                        <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          Minimum collateral amount is 10.
                        </Box>
                      </>
                    )}
                  </>
                }
                value={value}
                type="number"
                onChange={onChange}
              />
              <AppFormInputLogo
                src={getTokenLogoURL(
                  pool?.poolName?.toUpperCase() === "XDC"
                    ? "WXDC"
                    : pool?.poolName
                )}
              />
              <MaxButton onClick={() => setMax(balance)}>Max</MaxButton>
            </AppFormInputWrapper>
          )}
        />
        <Controller
          control={control}
          name="fathomToken"
          rules={{
            required: true,
            validate: (value) => {
              if (Number(value) > availableFathomInPool) {
                return "Not enough FXD in pool";
              }

              if (Number(value) > safeMax) {
                return `You can't borrow more then ${fxdToBeBorrowed}`;
              }

              return true;
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <AppFormInputWrapper>
                <AppFormLabel>Borrow Amount</AppFormLabel>
                <AppTextField
                  error={!!error}
                  id="outlined-helperText"
                  helperText={
                    <>
                      {error && error.type === "validate" && (
                        <>
                          <InfoIcon
                            sx={{
                              float: "left",
                              fontSize: "18px",
                            }}
                          />
                          <Box
                            sx={{ fontSize: "12px", paddingLeft: "6px" }}
                            component={"span"}
                          >
                            {error?.message}
                          </Box>
                        </>
                      )}
                      {(!error || error.type === "required") &&
                        "Enter the desired FXD."}
                    </>
                  }
                  value={value}
                  type="number"
                  placeholder={"0"}
                  onChange={onChange}
                />
                <AppFormInputLogo src={getTokenLogoURL("FXD")} />
                {safeMax > 0 ? (
                  <MaxButton onClick={setSafeMax}>Safe Max</MaxButton>
                ) : null}
              </AppFormInputWrapper>
            );
          }}
        />
        {approveBtn && !!parseInt(balance) && (
          <ApproveBox>
            <InfoIcon
              sx={{
                color: "#7D91B5",
                float: "left",
                marginRight: "10px",
              }}
            />
            <ApproveBoxTypography>
              First-time connect? Please allow token approval in your MetaMask
            </ApproveBoxTypography>
            <ApproveButton onClick={approve}>
              {" "}
              {approvalPending ? (
                <CircularProgress size={20} sx={{ color: "#0D1526" }} />
              ) : (
                "Approve"
              )}{" "}
            </ApproveButton>
          </ApproveBox>
        )}
        <ButtonsWrapper>
          {!isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
          <ButtonPrimary
            type="submit"
            disabled={approveBtn}
            isLoading={openPositionLoading}
          >
            {openPositionLoading ? (
              <CircularProgress sx={{ color: "#0D1526" }} size={20} />
            ) : (
              "Open this position"
            )}
          </ButtonPrimary>
          {isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
        </ButtonsWrapper>
      </Box>
    </OpenPositionFormWrapper>
  );
};

export default OpenPositionForm;
