import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  DialogContent,
  Typography,
  Box,
  Divider,
  Grid,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { Constants } from "helpers/Constants";
import {
  AppDialog,
  AppDialogTitle,
} from "components/AppComponents/AppDialog/AppDialog";
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
} from "components/AppComponents/AppTypography/AppTypography";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import InfoIcon from "@mui/icons-material/Info";
import { getTokenLogoURL } from "utils/tokenLogo";

export interface DialogTitleProps {
  id: string;
  children?: ReactNode;
  onClose: () => void;
}

interface ClosePositionProps {
  position: IOpenPosition;
  onClose: () => void;
}

enum ClosingType {
  Full,
  Partial,
}

const BootstrapDialogTitle: FC<DialogTitleProps> = ({
  children,
  onClose,
  ...other
}) => {
  return (
    <AppDialogTitle {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </AppDialogTitle>
  );
};

const ClosePositionDialog: FC<ClosePositionProps> = ({ position, onClose }) => {
  const { positionStore, poolStore } = useStores();
  const [collateral, setCollateral] = useState(0);
  const [fathomToken, setFathomToken] = useState(0);
  const [price, setPrice] = useState(0);
  const [closingType, setType] = useState(ClosingType.Full);

  const [balance, setBalance] = useState(0);
  const [balanceError, setBalanceError] = useState(false);
  const [disableClosePosition, setDisableClosePosition] = useState(false);

  const { account } = useMetaMask()!;

  const pool = useMemo(
    () => poolStore.getPool(position.pool),
    [position.pool, poolStore]
  );

  const lockedCollateral = useMemo(
    () => position.lockedCollateral.div(Constants.WeiPerWad).toNumber(),
    [position]
  );

  const getBalance = useCallback(async () => {
    const balance = (await positionStore.balanceStablecoin(account)) || 0;
    setBalance(balance!);
  }, [positionStore, account, setBalance]);

  const handleOnOpen = useCallback(async () => {
    const priceWithSafetyMargin = await poolStore.getPriceWithSafetyMargin(
      pool
    );

    setType(ClosingType.Full);
    setPrice(priceWithSafetyMargin);
    setFathomToken(priceWithSafetyMargin * lockedCollateral);
    setCollateral(lockedCollateral);
  }, [
    pool,
    poolStore,
    lockedCollateral,
    setType,
    setPrice,
    setFathomToken,
    setCollateral,
  ]);

  useEffect(() => {
    getBalance();
    handleOnOpen();
  }, [getBalance, handleOnOpen]);

  useEffect(() => {
    balance / 10 ** 18 < fathomToken
      ? setBalanceError(true)
      : setBalanceError(false);
  }, [fathomToken, balance]);

  const closePosition = useCallback(async () => {
    setDisableClosePosition(true);
    try {
      await positionStore.partialyClosePosition(
        position,
        pool,
        account,
        fathomToken,
        collateral
      );
      onClose();
    } catch (e) {}
    setDisableClosePosition(true);
  }, [
    position,
    pool,
    account,
    fathomToken,
    collateral,
    positionStore,
    onClose,
    setDisableClosePosition,
  ]);

  const handleFathomTokenTextFieldChange = useCallback(
    (e: any) => {
      const maxAllowed = lockedCollateral * price;
      let { value } = e.target;
      value = Number(value);

      value = value > maxAllowed ? maxAllowed : value;

      if (isNaN(value)) {
        return;
      }

      const walletBalance = Number(balance) / 10 ** 18;

      if (value > walletBalance) {
        setBalanceError(true);
      } else {
        setBalanceError(false);
      }

      setFathomToken(value);
      setCollateral(value / price);
    },
    [
      price,
      lockedCollateral,
      balance,
      setFathomToken,
      setCollateral,
      setBalanceError,
    ]
  );

  const handleTypeChange = useCallback(
    (type: ClosingType) => {
      console.log("handleTypeChange");
      if (type === ClosingType.Full) {
        setFathomToken(lockedCollateral * price);
        setCollateral(lockedCollateral);
      }
      setType(type);
    },
    [price, lockedCollateral, setFathomToken, setType, setCollateral]
  );

  const setMax = useCallback(() => {
    const walletBalance = balance / 10 ** 18;
    const maxBalance = lockedCollateral * price;

    const setBalance = walletBalance < maxBalance ? walletBalance : maxBalance;

    setFathomToken(setBalance);
    setCollateral(setBalance / price);
  }, [price, lockedCollateral, balance, setFathomToken, setCollateral]);

  return (
    <>
      <AppDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={true}
        fullWidth
        maxWidth="md"
        color="primary"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          Close Position
        </BootstrapDialogTitle>
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
              sx={{ margin: "10px  0 0 0" }}
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
                >
                  Close this position
                </ButtonPrimary>
              </OpenPositionsButtonsWrapper>
            </Grid>
          </Grid>
        </DialogContent>
      </AppDialog>
    </>
  );
};

export default ClosePositionDialog;
