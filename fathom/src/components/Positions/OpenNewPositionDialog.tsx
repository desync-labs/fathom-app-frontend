import React, { FC } from "react";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import InfoIcon from "@mui/icons-material/Info";
import {
  Grid,
  CircularProgress,
  DialogContent,
  Divider,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { AppList } from "components/AppComponents/AppList/AppList";
import {
  ApproveBox,
  ApproveBoxTypography,
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
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  ApproveButton,
  ButtonPrimary,
  ButtonSecondary,
  MaxButton,
  OpenPositionsButtonsWrapper,
} from "components/AppComponents/AppButton/AppButton";
import useOpenPosition from "hooks/useOpenPosition";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { Controller } from "react-hook-form";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

export type OpenPositionProps = {
  pool: ICollateralPool;
  onClose: () => void;
};

const OpenNewPositionDialog: FC<OpenPositionProps> = ({ pool, onClose }) => {
  const {
    approveBtn,
    approve,
    approvalPending,

    collateralToBeLocked,
    collateralAvailableToWithdraw,
    fxdAvailableToBorrow,
    debtRatio,
    fxdToBeBorrowed,
    balance,
    safetyBuffer,
    liquidationPrice,
    collateral,
    fathomToken,
    safeMax,
    openPositionLoading,

    setMax,
    setSafeMax,
    onSubmit,

    control,
    handleSubmit,

    availableFathomInPool,
  } = useOpenPosition(pool, onClose);

  return (
    <AppDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      maxWidth="md"
      open={true}
      color="primary"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Open New Position
      </AppDialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <AppList sx={{ width: "100%" }}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${collateralToBeLocked.toFixed(2)} ${
                  pool.poolName
                }`}
              >
                <ListItemText primary="Collateral to be Locked" />
              </ListItem>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${collateralAvailableToWithdraw.toFixed(2)} ${
                  pool.poolName
                }`}
              >
                <ListItemText primary="Estimated Collateral Available to Withdraw" />
              </ListItem>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${fxdToBeBorrowed.toFixed(2)} FXD`}
              >
                <ListItemText primary="FXD to be Borrowed" />
              </ListItem>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${fxdAvailableToBorrow.toFixed(2)} FXD`}
              >
                <ListItemText primary="FXD Available to Borrow" />
              </ListItem>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${debtRatio.toFixed(2)} %`}
              >
                <ListItemText primary="LTV" />
              </ListItem>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${(safetyBuffer * 100).toFixed(2)} %`}
              >
                <ListItemText primary="Safety Buffer" />
              </ListItem>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`$${liquidationPrice.toFixed(2)}`}
              >
                <ListItemText primary={`Liquidation Price of ${pool.poolName}`} />
              </ListItem>
              <Divider component="li" sx={{ margin: "20px 20px 20px 5px" }} />
              <ListItem alignItems="flex-start" secondaryAction={`1.73%`}>
                <ListItemText primary={`Lending APR`} />
              </ListItem>
              <ListItem alignItems="flex-start" secondaryAction={`0.22%`}>
                <ListItemText primary={`Fathom Rewards APR`} />
              </ListItem>
              <ListItem alignItems="flex-start" secondaryAction={`${pool.stabilityFeeRate}%`}>
                <ListItemText primary={`Stability Fee`} />
              </ListItem>
              <ListItem alignItems="flex-start" secondaryAction={`1.96%`}>
                <ListItemText primary={`Total APR`} />
              </ListItem>
              <ListItem alignItems="flex-start" secondaryAction={`1.98%`}>
                <ListItemText primary={`Total APY`} />
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
                  max: +balance / 10 ** 18,
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
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
                        error && error.type === "max" ? (
                          <>
                            <InfoIcon
                              sx={{ float: "left", fontSize: "18px" }}
                            />
                            <Typography
                              sx={{ fontSize: "12px", paddingLeft: "22px" }}
                            >
                              You do not have enough {pool.poolName}
                            </Typography>
                          </>
                        ) : (
                          "Enter the Collateral."
                        )
                      }
                      value={value}
                      type="number"
                      onChange={onChange}
                    />
                    <AppFormInputLogo src={getTokenLogoURL(pool.poolName)} />
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
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  return (
                    <AppFormInputWrapper>
                      <AppFormLabel>Borrow Amount</AppFormLabel>
                      <AppTextField
                        error={!!error}
                        id="outlined-helperText"
                        helperText={
                          <>
                            {error && error.type === "validate" && <>
                              <InfoIcon
                                sx={{ float: "left", fontSize: "18px", marginRight: '5px' }}
                              />
                              <Typography
                                sx={{ fontSize: "12px", paddingLeft: "22px" }}
                              >
                                {error?.message}
                              </Typography>
                            </>}
                            {(!error || error.type === 'required') && "Enter the desired FXD."}
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
                  )
                }}
              />

              {collateral ? (
                <InfoWrapper>
                  <InfoLabel>Depositing</InfoLabel>
                  <InfoValue>
                    {collateral} {pool.poolName}
                  </InfoValue>
                </InfoWrapper>
              ) : null}
              {fathomToken ? (
                <InfoWrapper>
                  <InfoLabel>Receive</InfoLabel>
                  <InfoValue>{fathomToken} FXD</InfoValue>
                </InfoWrapper>
              ) : null}
              {approveBtn && !!parseInt(String(balance)) && (
                <ApproveBox>
                  <InfoIcon
                    sx={{
                      color: "#7D91B5",
                      float: "left",
                      marginRight: "10px",
                    }}
                  />
                  <ApproveBoxTypography>
                    First-time connect? Please allow token approval in your
                    MetaMask
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
              <OpenPositionsButtonsWrapper>
                <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
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
              </OpenPositionsButtonsWrapper>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </AppDialog>
  );
};

export default OpenNewPositionDialog;
