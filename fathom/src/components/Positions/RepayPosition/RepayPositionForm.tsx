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
  ApproveBox,
  ApproveBoxTypography,
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
  ManagePositionRepayTypeWrapper,
  MaxButton,
  ButtonsWrapper,
  ManageTypeButton,
  ApproveButton,
} from "components/AppComponents/AppButton/AppButton";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import InfoIcon from "@mui/icons-material/Info";

import useRepayPositionContext from "context/repayPosition";
import { styled } from "@mui/material/styles";
import { ClosePositionDialogPropsType } from "components/Positions/RepayPositionDialog";

import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";

const ClosePositionWrapper = styled(Grid)`
  padding-left: 20px;
  width: calc(50% - 1px);
  position: relative;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

const RepayApproveBox = styled(ApproveBox)`
  margin-bottom: 20px;
`;

const RepayApproveButton = styled(ApproveButton)`
  margin-left: 0;
`;

const RepayPositionForm: FC<ClosePositionDialogPropsType> = ({
  topUpPosition,
  closePosition,
  setClosePosition,
  setTopUpPosition,
}) => {
  const {
    pool,
    collateral,
    balance,
    balanceError,
    balanceErrorNotFilled,
    fathomTokenIsDirty,
    disableClosePosition,
    fathomToken,
    handleFathomTokenTextFieldChange,
    handleCollateralTextFieldChange,
    setMax,
    onClose,
    closePositionHandler,
    debtValue,
    switchPosition,
    approveBtn,
    approvalPending,
    approve,
  } = useRepayPositionContext();

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
          <WalletBalance>Wallet Available: {formatPercentage(balance)} FXD</WalletBalance>
        )}
        <AppTextField
          error={balanceError || balanceErrorNotFilled}
          id="outlined-helperText"
          placeholder={"0"}
          helperText={
            <>
              {balanceError ? (
                <Box
                  sx={{ mt: "5px", display: "inline-block" }}
                  component={"span"}
                >
                  <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                  <Typography
                    component={"span"}
                    sx={{ fontSize: "12px", paddingLeft: "10px" }}
                  >
                    You don't have enough to repay that amount
                  </Typography>
                </Box>
              ) : balanceErrorNotFilled && fathomTokenIsDirty ? (
                <Box
                  sx={{ mt: "5px", display: "inline-block" }}
                  component={"span"}
                >
                  <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                  <Typography
                    component={"span"}
                    sx={{ fontSize: "12px", paddingLeft: "10px" }}
                  >
                    Please fill repaying amount
                  </Typography>
                </Box>
              ) : (
                "Enter the Repaying."
              )}
            </>
          }
          value={fathomToken}
          onChange={handleFathomTokenTextFieldChange}
        />
        <AppFormInputLogo src={getTokenLogoURL("FXD")} />
        <MaxButton onClick={() => setMax()}>Max</MaxButton>
      </AppFormInputWrapper>
      {approveBtn && (
        <RepayApproveBox>
          <InfoIcon
            sx={{
              color: "#7D91B5",
              float: "left",
              marginRight: "10px",
            }}
          />
          <ApproveBoxTypography>
            Please allow token approval in your MetaMask
          </ApproveBoxTypography>
          <RepayApproveButton onClick={approve} disabled={approvalPending}>
            {" "}
            {approvalPending ? (
              <CircularProgress size={20} sx={{ color: "#0D1526" }} />
            ) : (
              "Approve"
            )}{" "}
          </RepayApproveButton>
        </RepayApproveBox>
      )}
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
          <InfoValue>{formatPercentage(fathomToken)} FXD</InfoValue>
        </InfoWrapper>
      ) : null}
      {fathomToken ? (
        <InfoWrapper>
          <InfoLabel>Receive</InfoLabel>
          <InfoValue>
            {formatPercentage(collateral)} {pool.poolName}
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
          disabled={balanceError || balanceErrorNotFilled || disableClosePosition}
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
