import React from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ErrorBox,
  ErrorMessage,
  InfoLabel,
  InfoValue,
  InfoWrapper,
  Summary,
  WalletBalance,
  WarningBox,
} from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ButtonSecondary,
  ClosePositionRepayTypeWrapper,
  MaxButton,
  ButtonsWrapper,
  RepayTypeButton,
} from "components/AppComponents/AppButton/AppButton";
import { ClosingType } from "hooks/useClosePosition";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import InfoIcon from "@mui/icons-material/Info";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";
import { getToken } from "utils/explorer";

import useClosePositionContext from "context/closePosition";
import { styled } from "@mui/material/styles";

const ClosePositionWrapper = styled(Grid)`
  padding-left: 20px;
  width: calc(50% - 1px);
  position: relative;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

const ClosePositionForm = () => {
  const {
    chainId,
    pool,
    collateral,
    balance,
    balanceError,
    disableClosePosition,
    closingType,
    fathomToken,
    handleFathomTokenTextFieldChange,
    handleTypeChange,
    setMax,
    onClose,
    closePosition,
    debtValue,
    aXDCcTokenAddress,
  } = useClosePositionContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ClosePositionWrapper item>
      <Summary>Summary</Summary>
      <ClosePositionRepayTypeWrapper>
        <RepayTypeButton
          sx={{ marginRight: "5px" }}
          className={`${closingType === ClosingType.Full ? "active" : null}`}
          onClick={() => handleTypeChange(ClosingType.Full)}
        >
          Repay entirely
        </RepayTypeButton>
        <RepayTypeButton
          className={`${closingType === ClosingType.Partial ? "active" : null}`}
          onClick={() => handleTypeChange(ClosingType.Partial)}
        >
          Repay partially
        </RepayTypeButton>
      </ClosePositionRepayTypeWrapper>
      <Box sx={{ marginBottom: "20px" }}>
        <Box
          sx={{
            fontWeight: "bold",
            fontSize: "10px",
            textTransform: "uppercase",
            color: "#9FADC6",
          }}
        >
          Total debt:
        </Box>
        <Box sx={{ fontWeight: "bold", fontSize: "14px" }}>
          {formatPercentage(debtValue)} FXD
        </Box>
      </Box>
      <AppFormInputWrapper>
        <AppFormLabel>Repaying</AppFormLabel>
        {balance && (
          <WalletBalance>Wallet Available: {balance} FXD</WalletBalance>
        )}
        <AppTextField
          error={balanceError}
          id="outlined-helperText"
          disabled={closingType === ClosingType.Full}
          placeholder={"0"}
          helperText={
            balanceError ? (
              <>
                <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                <Typography
                  component={"div"}
                  sx={{ fontSize: "12px", paddingLeft: "22px" }}
                >
                  You don't have enough to repay that amount
                </Typography>
              </>
            ) : (
              "Enter the Repaying."
            )
          }
          value={fathomToken}
          onChange={handleFathomTokenTextFieldChange}
        />
        <AppFormInputLogo src={getTokenLogoURL("FXD")} />
        <MaxButton
          onClick={() => setMax()}
          disabled={closingType === ClosingType.Full ? true : false}
        >
          Max
        </MaxButton>
      </AppFormInputWrapper>
      <AppFormInputWrapper>
        <AppFormLabel>Receive</AppFormLabel>
        <AppTextField
          disabled={true}
          id="outlined-helperText"
          value={collateral}
        />
        <AppFormInputLogo
          src={getTokenLogoURL(
            pool?.poolName === "XDC" ? "WXDC" : pool?.poolName
          )}
        />
      </AppFormInputWrapper>
      {fathomToken ? (
        <InfoWrapper>
          <InfoLabel>Repaying</InfoLabel>
          <InfoValue>{fathomToken} FXD</InfoValue>
        </InfoWrapper>
      ) : null}
      {fathomToken ? (
        <InfoWrapper>
          <InfoLabel>Receive</InfoLabel>
          <InfoValue>
            {collateral} {pool.poolName}
          </InfoValue>
        </InfoWrapper>
      ) : null}
      {closingType === ClosingType.Full && balanceError && (
        <ErrorBox>
          <InfoIcon />
          <ErrorMessage>
            Wallet balance is not enough to close this position entirely (repay
            in full).
          </ErrorMessage>
        </ErrorBox>
      )}

      <WarningBox sx={{ mt: 3 }}>
        <InfoIcon sx={{ width: "16px", color: "#F5953D", height: "16px" }} />
        <Typography>
          After Close Position you will receive{" "}
          <a
            target="_blank"
            href={getToken(aXDCcTokenAddress, chainId)}
            rel="noreferrer"
          >
            aXDCc
          </a>{" "}
          token
        </Typography>
      </WarningBox>
      <ButtonsWrapper
        sx={{ position: "static", float: "right", marginTop: "20px" }}
      >
        {!isMobile && (
          <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
        )}
        <ButtonPrimary
          onClick={closePosition}
          disabled={balanceError || disableClosePosition}
          isLoading={disableClosePosition}
        >
          {disableClosePosition ? (
            <CircularProgress size={20} />
          ) : (
            "Close this position"
          )}
        </ButtonPrimary>
        {isMobile && <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>}
      </ButtonsWrapper>
    </ClosePositionWrapper>
  );
};

export default ClosePositionForm;
