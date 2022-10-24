import React, { FC, useCallback, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import InfoIcon from "@mui/icons-material/Info";
import {
  Grid,
  CircularProgress,
  IconButton,
  DialogContent,
  Divider,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  AppDialog,
  AppDialogTitle,
} from "components/AppComponents/AppDialog/AppDialog";
import { AppList } from "components/AppComponents/AppList/AppList";
import {
  ApproveBox,
  ApproveBoxTypography,
  OpenPositionLabel,
  OpenPositionValue,
  OpenPositionWrapper,
  Summary,
  WalletBalance,
} from "components/AppComponents/AppTypography/AppTypography";
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
import debounce from "lodash.debounce";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface OpenPositionProps {
  pool: ICollateralPool;
  onClose: () => void;
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

const OpenNewPositionDialog: FC<OpenPositionProps> = ({ pool, onClose }) => {
  const positionStore = useStores().positionStore;
  const poolStore = useStores().poolStore;

  const { account, chainId } = useMetaMask()!;
  const [approveBtn, setApproveBtn] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);
  const [balance, setBalance] = useState(0);
  const [balanceError, setBalanceError] = useState(false);

  const [fathomToken, setFathomToken] = useState(0);
  const [collateral, setCollateral] = useState(0);
  const [collateralToBeLocked, setCollateralToBeLocked] = useState(0);
  const [fxdToBeBorrowed, setFxdToBeBorrowed] = useState(0);
  const [safeMax, setSafeMax] = useState(0);
  const [collateralAvailableToWithdraw, setCollateralAvailableToWithdraw] =
    useState(0);
  const [safetyBuffer, setSafetyBuffer] = useState(0);
  const [debtRatio, setDebtRatio] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [fxdAvailableToBorrow, setFxdAvailableToBorrow] = useState(0);

  const [disableOpenPosition, setDisableOpenPosition] = useState(false);
  const [openPositionLoading, setOpenPositionLoading] = useState(false);

  const approvalStatus = useCallback(
    debounce(async () => {
      let approved = await positionStore.approvalStatus(
        account,
        collateral,
        pool
      );
      approved ? setApproveBtn(false) : setApproveBtn(true);
    }, 1000),
    [positionStore, pool, account, collateral]
  );

  const getBalance = useCallback(async () => {
    const balance = await poolStore.getUserTokenBalance(account, pool);
    setBalance(balance);
  }, [poolStore, account, pool, setBalance]);

  useEffect(() => {
    getBalance();
  }, [chainId, getBalance]);

  useEffect(() => {
    if (chainId) {
      approvalStatus();
    }
  }, [approvalStatus, chainId, collateral]);

  const handleUpdates = useCallback(
    async (collateralInput: number, fathomTokenInput: number) => {
      const availableFathom = parseInt(
        pool.availableFathom.replaceAll(",", "")
      );
      const disable = fathomTokenInput >= availableFathom;
      console.log(
        `Input token ${fathomTokenInput} and Pool Max: ${availableFathom}`
      );
      setDisableOpenPosition(disable);

      // check collateral input
      if (isNaN(collateralInput) || !collateralInput) {
        collateralInput = 0;
      }
      // console.log("COLLATERAL INPUT: ", collateralInput);
      setCollateralToBeLocked(+collateralInput);

      if (isNaN(fathomTokenInput) || !fathomTokenInput) {
        fathomTokenInput = 0;
      }
      // console.log("FXD TO BORROW: ", fxdToBorrow);
      setFxdToBeBorrowed(+fathomTokenInput);

      // GET USER BALANCE
      const balance = await poolStore.getUserTokenBalance(account, pool);
      setBalance(balance);

      // CHECK BALANCE
      // if the user does not have enough collateral -- show them a balance error
      if (+balance / 10 ** 18 < +collateralInput) {
        setBalanceError(true);
        return;
      } else {
        setBalanceError(false);
      }

      // GET PRICE WITH SAFETY MARGIN
      let priceWithSafetyMargin;
      if (pool.name === "USDT") {
        priceWithSafetyMargin = 0.75188;
      } else {
        priceWithSafetyMargin = await poolStore.getPriceWithSafetyMargin(pool);
      }
      // setPriceWithSafetyMargin(+priceWithSafetyMargin);

      // SAFE MAX
      let safeMax;
      if (priceWithSafetyMargin === 0) {
        safeMax = +collateralInput;
      } else {
        safeMax = +collateralInput * priceWithSafetyMargin * 0.99;
      }

      //TODO: TODO...
      safeMax = Math.floor(safeMax);

      setSafeMax(+safeMax);

      if (+fathomTokenInput > safeMax) {
        setFxdToBeBorrowed(0);
        setFathomToken(0);
      }

      let collatralAvailableToWithdraw = 0;
      if (+priceWithSafetyMargin === 0) {
        collatralAvailableToWithdraw = +collateralInput - +fathomTokenInput;
      } else {
        collatralAvailableToWithdraw =
          (+collateralInput * +priceWithSafetyMargin - +fathomTokenInput) /
          +priceWithSafetyMargin;
      }

      setCollateralAvailableToWithdraw(+collatralAvailableToWithdraw);

      // PRICE OF COLLATERAL FROM DEX
      const priceOfCollateralFromDex =
        pool.name === "USDT"
          ? 10 ** 18
          : await poolStore.getDexPrice(pool.collateralContractAddress);

      // DEBT RATIO
      const debtRatio =
        +fathomTokenInput === 0
          ? 0
          : (+fathomTokenInput /
              ((+collateralInput * +priceOfCollateralFromDex) / 10 ** 18)) *
            100;
      setDebtRatio(+debtRatio);

      // FXD AVAILABLE TO BORROW
      const fxdAvailableToBorrow = safeMax - +fathomTokenInput;
      setFxdAvailableToBorrow(fxdAvailableToBorrow);

      // SAFETY BUFFER
      const safetyBuffer = collatralAvailableToWithdraw / +collateralInput;
      setSafetyBuffer(+safetyBuffer);

      // LIQUIDATION PRICE
      let liquidationPrice = 0;
      if (priceWithSafetyMargin === 0) {
        liquidationPrice =
          priceOfCollateralFromDex / 10 ** 18 -
          collatralAvailableToWithdraw / +collateralInput;
      } else {
        liquidationPrice =
          priceOfCollateralFromDex / 10 ** 18 -
          (collatralAvailableToWithdraw * priceWithSafetyMargin) /
            +collateralInput;
      }

      setLiquidationPrice(+liquidationPrice);
    },
    [
      account,
      pool,
      poolStore,
      setLiquidationPrice,
      setSafetyBuffer,
      setFxdAvailableToBorrow,
      setDebtRatio,
      setCollateralAvailableToWithdraw,
      setSafeMax,
      setDisableOpenPosition,
      setCollateralToBeLocked,
      setFxdToBeBorrowed,
      setFathomToken,
      setBalanceError,
      setBalance,
    ]
  );

  const updateFathomAmount = useCallback(() => {
    setFathomToken(safeMax);
    handleUpdates(collateral, safeMax);
  }, [safeMax, collateral, setFathomToken, handleUpdates]);

  const openNewPosition = useCallback(async () => {
    setDisableOpenPosition(true);
    setOpenPositionLoading(true);
    try {
      await positionStore.openPosition(account, pool, collateral, fathomToken);
      onClose();
    } catch (e) {
      console.log(e);
    }
    setDisableOpenPosition(false);
    setOpenPositionLoading(false);
  }, [
    positionStore,
    onClose,
    account,
    pool,
    collateral,
    fathomToken,
    setDisableOpenPosition,
    setOpenPositionLoading
  ]);

  const handleCloseApproveBtn = useCallback(() => {
    setApproveBtn(false);
  }, [setApproveBtn]);

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await positionStore.approve(account, pool);
      handleCloseApproveBtn();
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [
    setApprovalPending,
    setApproveBtn,
    handleCloseApproveBtn,
    account,
    pool,
    positionStore,
  ]);

  const handleCollateralTextFieldChange = useCallback(
    (e: any) => {
      const value = e.target.value;
      if (!isNaN(value)) {
        setCollateral(value);
      }

      handleUpdates(value, fathomToken);
    },
    [handleUpdates, setCollateral, fathomToken]
  );

  const handleFathomTokenTextFieldChange = useCallback(
    (e: any) => {
      const value = e.target.value;
      if (!isNaN(value)) {
        setFathomToken(value);
      }
      handleUpdates(collateral, value);
    },
    [collateral, handleUpdates, setFathomToken]
  );

  const setMax = useCallback(
    (balance: number) => {
      const max = +balance / 10 ** 18;
      setCollateral(max);
      handleUpdates(max, fathomToken);
    },
    [setCollateral, handleUpdates, fathomToken]
  );

  return (
    <AppDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      maxWidth="md"
      open={true}
      color="primary"
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
        Open New Position
      </BootstrapDialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <AppList sx={{ width: "100%" }}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${collateralToBeLocked.toFixed(2)} ${
                  pool.name
                }`}
              >
                <ListItemText primary="Collateral to be Locked" />
              </ListItem>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${collateralAvailableToWithdraw.toFixed(2)} ${
                  pool.name
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
                <ListItemText primary={`Liquidation Price of ${pool.name}`} />
              </ListItem>
              <Divider component="li" sx={{ margin: "20px 20px 20px 5px" }} />
              <ListItem alignItems="flex-start" secondaryAction={`1.73%`}>
                <ListItemText primary={`Lending APR`} />
              </ListItem>
              <ListItem alignItems="flex-start" secondaryAction={`0.22%`}>
                <ListItemText primary={`Fathom Rewards APR`} />
              </ListItem>
              <ListItem alignItems="flex-start" secondaryAction={`0.00%`}>
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
            <AppFormInputWrapper>
              <AppFormLabel>Collateral</AppFormLabel>
              {balance ? (
                <WalletBalance>
                  Wallet Available: {+balance / 10 ** 18} {pool.name}
                </WalletBalance>
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
                        You do not have enough {pool.name}
                      </Typography>
                    </>
                  ) : (
                    "Enter the Collateral."
                  )
                }
                value={collateral}
                onChange={handleCollateralTextFieldChange}
              />
              <AppFormInputLogo src={getTokenLogoURL(pool.name)} />
              <MaxButton onClick={() => setMax(balance)}>Max</MaxButton>
            </AppFormInputWrapper>
            <AppFormInputWrapper>
              <AppFormLabel>Borrow Amount</AppFormLabel>
              <AppTextField
                id="outlined-helperText"
                helperText="Enter the desired FXD."
                value={fathomToken}
                onChange={handleFathomTokenTextFieldChange}
              />
              <AppFormInputLogo src={getTokenLogoURL("FXD")} />
              {safeMax > 0 && !balanceError ? (
                <MaxButton onClick={updateFathomAmount}>Safe Max</MaxButton>
              ) : null}
            </AppFormInputWrapper>
            {collateral ? (
              <OpenPositionWrapper>
                <OpenPositionLabel>Depositing</OpenPositionLabel>
                <OpenPositionValue>
                  {collateral} {pool.name}
                </OpenPositionValue>
              </OpenPositionWrapper>
            ) : null}
            {fathomToken ? (
              <OpenPositionWrapper>
                <OpenPositionLabel>Receive</OpenPositionLabel>
                <OpenPositionValue>{fathomToken} FXD</OpenPositionValue>
              </OpenPositionWrapper>
            ) : null}
            {approveBtn && !!parseInt(String(balance)) && (
              <ApproveBox>
                <InfoIcon
                  sx={{ color: "#7D91B5", float: "left", marginRight: "10px" }}
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
                onClick={openNewPosition}
                disabled={approveBtn || balanceError || disableOpenPosition}
                isLoading={openPositionLoading}
              >
                {openPositionLoading ? (
                  <CircularProgress sx={{ color: "#0D1526" }} size={20} />
                ) : (
                  "Open this position"
                )}
              </ButtonPrimary>
            </OpenPositionsButtonsWrapper>
          </Grid>
        </Grid>
      </DialogContent>
    </AppDialog>
  );
};

export default OpenNewPositionDialog;
