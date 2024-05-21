import { Controller } from "react-hook-form";
import BigNumber from "bignumber.js";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
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
import {
  ApproveButton,
  ButtonPrimary,
  ButtonSecondary,
  ButtonsWrapper,
  MaxButton,
} from "components/AppComponents/AppButton/AppButton";
import useOpenPositionContext from "context/openPosition";
import { FXD_MINIMUM_BORROW_AMOUNT } from "utils/Constants";
import { ErrorBox, ErrorMessage } from "components/AppComponents/AppBox/AppBox";
import { WarningBox } from "components/AppComponents/AppBox/AppBox";
import useConnector from "context/connector";

import { formatPercentage } from "utils/format";
import { getTokenLogoURL } from "utils/tokenLogo";
import useSharedContext from "context/shared";

const OpenPositionFormWrapper = styled(Grid)`
  padding-left: 20px;
  width: calc(50% - 1px);
  position: relative;
  padding-bottom: 40px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

const DangerErrorBox = styled(ErrorBox)`
  margin-bottom: 30px;
  margin-top: 0;
`;

const OpenPositionApproveBox = styled(ApproveBox)`
  margin-bottom: 25px;
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
    dangerSafetyBuffer,
    errors,
    maxBorrowAmount,
    proxyWalletExists,
  } = useOpenPositionContext();
  const { isMobile } = useSharedContext();

  const { isOpenPositionWhitelisted, chainId } = useConnector();

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
            min: chainId === 11155111 ? 0.0000001 : 1,
            max: BigNumber(balance)
              .dividedBy(10 ** 18)
              .toString(),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppFormInputWrapper>
              <AppFormLabel>Collateral</AppFormLabel>
              {balance ? (
                <WalletBalance>
                  Wallet Available:{" "}
                  {formatPercentage(
                    BigNumber(balance)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )}{" "}
                  {pool?.poolName}
                </WalletBalance>
              ) : null}
              <AppTextField
                error={!!error}
                id="outlined-helperText"
                placeholder={"0"}
                helperText={
                  <>
                    {error && error.type === "max" && (
                      <>
                        <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          You do not have enough {pool?.poolName}
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
                          Minimum collateral amount is 1.
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
            min: FXD_MINIMUM_BORROW_AMOUNT,
            max: maxBorrowAmount,
            validate: (value) => {
              if (BigNumber(value).isGreaterThan(availableFathomInPool)) {
                return "Not enough FXD in pool";
              }

              if (BigNumber(value).isGreaterThan(safeMax)) {
                return `You can't borrow more than ${fxdToBeBorrowed}`;
              }

              return true;
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <AppFormInputWrapper>
                <AppFormLabel>Borrow Amount</AppFormLabel>
                <AppTextField
                  error={!!error || dangerSafetyBuffer}
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
                      {error && error.type === "min" && (
                        <>
                          <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                          <Box
                            component={"span"}
                            sx={{ fontSize: "12px", paddingLeft: "6px" }}
                          >
                            Minimum borrow amount is {FXD_MINIMUM_BORROW_AMOUNT}
                            .
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
                            Maximum borrow amount is {maxBorrowAmount}.
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
                {BigNumber(safeMax).isGreaterThan(0) ? (
                  <MaxButton onClick={setSafeMax}>Safe Max</MaxButton>
                ) : null}
              </AppFormInputWrapper>
            );
          }}
        />
        {!isOpenPositionWhitelisted && (
          <WarningBox>
            <InfoIcon />
            <Typography>
              Your wallet address is not whitelisted for open position.
              <br />
              <a
                href={
                  "https://docs.google.com/forms/d/e/1FAIpQLSdyQkwpYPAAUc5llJxk09ymMdjSSSjjiY3spwvRvCwfV08h2A/viewform"
                }
                target={"_blank"}
                rel="noreferrer"
              >
                Apply for being added to the whitelist to borrow FXD.
              </a>
            </Typography>
          </WarningBox>
        )}
        {!proxyWalletExists && (
          <WarningBox>
            <InfoIcon />
            <Typography>
              Your wallet address has no proxy wallet. <br />
              First transaction will be creation of proxy wallet.
            </Typography>
          </WarningBox>
        )}
        {approveBtn && !!balance && (
          <OpenPositionApproveBox>
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
          </OpenPositionApproveBox>
        )}
        {dangerSafetyBuffer ? (
          <DangerErrorBox>
            <InfoIcon
              sx={{ width: "16px", color: "#F5953D", height: "16px" }}
            />
            <ErrorMessage>
              Safety Buffer is moved into the danger zone. We recommend
              borrowing a lesser amount of FXD. Otherwise, your position may be
              at risk of liquidation if the price of collateral will drop.
            </ErrorMessage>
          </DangerErrorBox>
        ) : null}
        <ButtonsWrapper>
          {!isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
          <ButtonPrimary
            type="submit"
            disabled={
              openPositionLoading ||
              approveBtn ||
              !!Object.keys(errors).length ||
              !isOpenPositionWhitelisted
            }
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
