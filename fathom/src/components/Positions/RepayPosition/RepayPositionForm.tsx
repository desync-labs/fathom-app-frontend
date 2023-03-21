import React, { FC } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  InfoLabel,
  InfoValue,
  InfoWrapper,
  Summary,
  WalletBalance,
  WarningBox
} from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ButtonSecondary,
  ManagePositionRepayTypeWrapper,
  MaxButton,
  ButtonsWrapper,
  ManageTypeButton,
} from "components/AppComponents/AppButton/AppButton";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import InfoIcon from "@mui/icons-material/Info";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";

import useClosePositionContext from "context/closePosition";
import { styled } from "@mui/material/styles";
import { ClosePositionDialogPropsType } from "components/Positions/ClosePositionDialog";

const ClosePositionWrapper = styled(Grid)`
  padding-left: 20px;
  width: calc(50% - 1px);
  position: relative;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

const RepayPositionForm: FC<ClosePositionDialogPropsType> = ({
  topUpPosition,
  closePosition,
  setClosePosition,
  setTopUpPosition
}) => {
  const {
    pool,
    collateral,
    balance,
    balanceError,
    disableClosePosition,
    fathomToken,
    handleFathomTokenTextFieldChange,
    handleCollateralTextFieldChange,
    setMax,
    onClose,
    closePositionHandler,
    debtValue,
    switchPosition,
  } = useClosePositionContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ClosePositionWrapper item>
      <Summary>Summary</Summary>
      <ManagePositionRepayTypeWrapper>
        <ManageTypeButton
          sx={{ marginRight: "5px" }}
          className={`${!!topUpPosition ? "active" : null}`}
          onClick={() => !topUpPosition && switchPosition(setTopUpPosition)}
        >
          Top Up Position
        </ManageTypeButton>
        <ManageTypeButton
          className={`${!!closePosition ? "active" : null}`}
          onClick={() => !closePosition && switchPosition(setClosePosition)}
        >
          Repay Position
        </ManageTypeButton>
      </ManagePositionRepayTypeWrapper>
      <Box sx={{ mb: "20px" }}>
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
          placeholder={"0"}
          helperText={
            balanceError ? (
              <Box sx={{ mt: "5px" }}>
                <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                <Typography
                  component={"div"}
                  sx={{ fontSize: "12px", paddingLeft: "22px" }}
                >
                  You don't have enough to repay that amount
                </Typography>
              </Box>
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
        >
          Max
        </MaxButton>
      </AppFormInputWrapper>
      <AppFormInputWrapper>
        <AppFormLabel>Receive</AppFormLabel>
        <AppTextField
          id="outlined-helperText"
          value={collateral}
          onChange={handleCollateralTextFieldChange}
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
      {balanceError && (
        <WarningBox>
          <InfoIcon />
          <Typography>
            Wallet balance is not enough to close this position entirely (repay
            in full).
          </Typography>
        </WarningBox>
      )}
      <ButtonsWrapper
        sx={{ position: "static", float: "right", marginTop: "20px" }}
      >
        {!isMobile && (
          <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
        )}
        <ButtonPrimary
          onClick={closePositionHandler}
          disabled={balanceError || disableClosePosition}
          isLoading={disableClosePosition}
        >
          {disableClosePosition ? (
            <CircularProgress size={20} />
          ) : (
            "Repay this position"
          )}
        </ButtonPrimary>
        {isMobile && <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>}
      </ButtonsWrapper>
    </ClosePositionWrapper>
  );
};

export default RepayPositionForm;
