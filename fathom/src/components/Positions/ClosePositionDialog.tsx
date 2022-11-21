import React, { Dispatch, FC, ReactNode, memo } from "react";
import {
  DialogContent,
  Typography,
  Box,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import {
  ButtonPrimary,
  ButtonSecondary,
  ClosePositionRepayTypeWrapper,
  MaxButton,
  OpenPositionsButtonsWrapper,
  RepayTypeButton,
} from "components/AppComponents/AppButton/AppButton";
import { AppList } from "components/AppComponents/AppList/AppList";
import {
  ClosePositionError,
  ClosePositionErrorMessage,
  InfoLabel,
  InfoValue,
  InfoWrapper,
  Summary,
  WalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import InfoIcon from "@mui/icons-material/Info";
import { getTokenLogoURL } from "utils/tokenLogo";
import useClosePosition, { ClosingType } from "hooks/useClosePosition";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";

export interface DialogTitleProps {
  id: string;
  children?: ReactNode;
  onClose: () => void;
}

export type ClosePositionProps = {
  position: IOpenPosition;
  onClose: () => void;
  closingType: ClosingType;
  setType: Dispatch<ClosingType>;
};

const ClosePositionDialog: FC<ClosePositionProps> = ({
  position,
  onClose,
  closingType,
  setType,
}) => {
  const {
    collateral,
    lockedCollateral,
    price,
    fathomToken,
    pool,
    balance,
    balanceError,
    closePosition,
    disableClosePosition,
    handleFathomTokenTextFieldChange,
    handleTypeChange,
    setMax,
  } = useClosePosition(position, onClose, closingType, setType);

  return (
    <AppDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="md"
      color="primary"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Close Position
      </AppDialogTitle>

      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <AppList sx={{ width: "100%" }}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <>
                    {(lockedCollateral * price).toFixed(6)} FXD{" "}
                    <Box component="span" sx={{ color: "#29C20A" }}>
                      → {(lockedCollateral * price - fathomToken).toFixed(6)}{" "}
                      FXD
                    </Box>
                  </>
                }
              >
                <ListItemText primary="FXD Borrowed" />
              </ListItem>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <>
                    {lockedCollateral.toFixed(6)} {pool.name}{" "}
                    <Box component="span" sx={{ color: "#29C20A" }}>
                      → {(lockedCollateral - +collateral).toFixed(6)}{" "}
                      {pool.name}
                    </Box>
                  </>
                }
              >
                <ListItemText primary="Collateral Locked" />
              </ListItem>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${position.ltv.toNumber() / 10}%`}
              >
                <ListItemText primary="LTV (Loan-to-Value)" />
              </ListItem>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`1 FXD = ${1 / price} ${pool.name}`}
              >
                <ListItemText primary="Liquidation Price" />
              </ListItem>
            </AppList>
          </Grid>
          <Divider
            sx={{ margin: "10px 0 0 0" }}
            orientation="vertical"
            flexItem
          ></Divider>
          <Grid
            item
            sx={{
              paddingLeft: "20px",
              width: "calc(50% - 1px)",
              position: "relative",
            }}
          >
            <Summary>Summary</Summary>
            <ClosePositionRepayTypeWrapper>
              <RepayTypeButton
                sx={{ marginRight: "5px" }}
                className={`${
                  closingType === ClosingType.Full ? "active" : null
                }`}
                onClick={() => handleTypeChange(ClosingType.Full)}
              >
                Repay entirely
              </RepayTypeButton>
              <RepayTypeButton
                className={`${
                  closingType === ClosingType.Partial ? "active" : null
                }`}
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
                {lockedCollateral * price} FXD
              </Box>
            </Box>
            <AppFormInputWrapper>
              <AppFormLabel>Repaying</AppFormLabel>
              {balance ? (
                <WalletBalance>
                  Wallet Available: {+balance / 10 ** 18} FXD
                </WalletBalance>
              ) : null}
              <AppTextField
                error={balanceError}
                id="outlined-helperText"
                disabled={closingType === ClosingType.Full}
                placeholder={'0'}
                helperText={
                  balanceError ? (
                    <>
                      <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                      <Typography
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
              <MaxButton onClick={() => setMax()}>Max</MaxButton>
            </AppFormInputWrapper>
            <AppFormInputWrapper>
              <AppFormLabel>Receive</AppFormLabel>
              <AppTextField
                disabled={true}
                id="outlined-helperText"
                value={collateral}
              />
              <AppFormInputLogo src={getTokenLogoURL(pool.name)} />
              {/*<MaxButton disabled>Safe Max</MaxButton>*/}
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
                  {collateral} {pool.name}
                </InfoValue>
              </InfoWrapper>
            ) : null}
            {closingType === ClosingType.Full && balanceError && (
              <ClosePositionError>
                <InfoIcon
                  sx={{
                    color: "#CE0000",
                    float: "left",
                    marginRight: "10px",
                  }}
                />
                <ClosePositionErrorMessage>
                  Wallet balance is not enough to close this position entirely
                  (repay in full).
                </ClosePositionErrorMessage>
              </ClosePositionError>
            )}
            <OpenPositionsButtonsWrapper
              sx={{ position: "static", float: "right", marginTop: "20px" }}
            >
              <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
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
            </OpenPositionsButtonsWrapper>
          </Grid>
        </Grid>
      </DialogContent>
    </AppDialog>
  );
};

export default memo(ClosePositionDialog);
