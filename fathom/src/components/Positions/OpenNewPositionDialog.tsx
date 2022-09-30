import React, { useEffect, useMemo } from "react";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { TextField} from '@mui/material';
import { useStores } from '../../stores';
import useMetaMask from '../../hooks/metamask';
import ICollatralPool from '../../stores/interfaces/ICollatralPool';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {
  UnsupportedChainIdError,
  useWeb3React
} from "@web3-react/core";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface PoolProps {
    pool: ICollatralPool;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};




export default function CustomizedDialogs(this: any, props: PoolProps) {
  let positionStore = useStores().positionStore;
  let poolStore = useStores().poolStore;

  const { account } = useMetaMask()!

  const { chainId, error } = useWeb3React()
  const unsupportedError = useMemo(() => (error as Error) instanceof UnsupportedChainIdError, [error]);


  const [open, setOpen] = React.useState(false);
  const [approveBtn, setApproveBtn] = React.useState(true);
  const [approvalPending, setApprovalPending] = React.useState(false);
  const [balance, setBalance]  = React.useState(0);
  const [balanceError, setBalanceError]  = React.useState(false);

  const [fathomToken, setFathomToken] = React.useState(0);
  const [collatral, setCollatral] = React.useState(0);
  const [collatralToBeLocked, setCollatralToBeLocked] = React.useState(0);
  const [fxdToBeBorrowed, setFxdToBeBorrowed] = React.useState(0);
  const [safeMax, setSafeMax] = React.useState(0);
  const [collatralAvailableToWithdraw, setCollatralAvailableToWithdraw] = React.useState(0);
  const [priceWithSafetyMargin, setPriceWithSafetyMargin] = React.useState(0);
  const [safetyBuffer, setSafetyBuffer] = React.useState(0);
  const [debtRatio, setDebtRatio] = React.useState(0);
  const [liquidationPrice, setLiquidationPrice] = React.useState(0);
  const [fxdAvailableToBorrow, setFxdAvailableToBorrow] = React.useState(0);

  useEffect(() => {
    if (chainId && (!error || !unsupportedError)) {
      setTimeout(() => {
        approvalStatus()
      })
    }
  }, [])

  const handleUpdates = async (collateralInput:number, fathomTokenInput:number) => {
     // check collateral input 
    if (isNaN(collateralInput) || !collateralInput) {
      collateralInput = 0;
    }
    // console.log("COLLATERAL INPUT: ", collateralInput);
    setCollatralToBeLocked(+collateralInput)

    
    if (isNaN(fathomTokenInput) || !fathomTokenInput) {
      fathomTokenInput = 0;
    }
    // console.log("FXD TO BORROW: ", fxdToBorrow);
    setFxdToBeBorrowed(+fathomTokenInput);
  
    // GET USER BALANCE
    const balance = await poolStore.getUserTokenBalance(account, props.pool);
    setBalance(balance);

    // CHECK BALANCE
    // if the user does not have enough collateral -- show them a balance error
    if ((+balance / 10**18) < +collateralInput) {
      setBalanceError(true);
      return
    } else { 
      setBalanceError(false);
    }

    // GET PRICE WITH SAFETY MARGIN  
   let  priceWithSafetyMargin =  await poolStore.getPriceWithSafetyMargin(props.pool);
    setPriceWithSafetyMargin(+priceWithSafetyMargin);
    
    // SAFE MAX
    let safeMax = 0;
    if (priceWithSafetyMargin == 0) {
      safeMax = +collateralInput;
    } else {
        safeMax = +collateralInput * priceWithSafetyMargin;
    }
    setSafeMax(+safeMax);

    if (+fathomTokenInput > safeMax) {
      setFxdToBeBorrowed(0)
      setFathomToken(0)
    }

    let collatralAvailableToWithdraw = 0;
    if (+priceWithSafetyMargin == 0) {
      collatralAvailableToWithdraw  = (+collateralInput - +fathomTokenInput);
    } else {
      collatralAvailableToWithdraw =  (+collateralInput * +priceWithSafetyMargin - +fathomTokenInput) / +priceWithSafetyMargin;
    }
   
    setCollatralAvailableToWithdraw(+collatralAvailableToWithdraw);

    // PRICE OF COLLATERAL FROM DEX
    const priceOfCollateralFromDex = (props.pool.name === "USDT") ? 10**18 : await poolStore.getDexPrice();

    // DEBT RATIO
    const debtRatio = (+fathomTokenInput == 0) ? 0 : +fathomTokenInput / (+collateralInput * +priceOfCollateralFromDex / 10**18) * 100;
    setDebtRatio(+debtRatio);

    // FXD AVAILABLE TO BORROW 
    const fxdAvailableToBorrow = safeMax - +fathomTokenInput;
    setFxdAvailableToBorrow(fxdAvailableToBorrow);
    console.log("FXD AVAILABLE TO BORROW ", fxdAvailableToBorrow)

    // SAFETY BUFFER
    const safetyBuffer = collatralAvailableToWithdraw / +collateralInput;
    setSafetyBuffer(+safetyBuffer);
    console.log("SAFETY BUFFER : ", safetyBuffer);


    // LIQUIDATION PRICE 
    let liquidationPrice = 0;
    if (priceWithSafetyMargin == 0) { 
      liquidationPrice  = (priceOfCollateralFromDex / 10**18) - (collatralAvailableToWithdraw  / +collateralInput);
    } else { 
      liquidationPrice  = (priceOfCollateralFromDex / 10**18) - ((collatralAvailableToWithdraw * priceWithSafetyMargin) / +collateralInput);

    }
    
    setLiquidationPrice(+liquidationPrice);
  }

  const updateFathomAmount = () => {
    setFathomToken(safeMax)
    handleUpdates(collatral, safeMax)
  }

  const approvalStatus = async () => {
    let approved = await positionStore.approvalStatus(account, collatral, props.pool)
    approved ? setApproveBtn(false) : setApproveBtn(true)
  }

  const openNewPosition = () => {
    positionStore.openPosition(account,props.pool,collatral,fathomToken)
    setOpen(false);
  }

  const approve = async () => {
    setApprovalPending(true)
    try{
      await  positionStore.approve(account,props.pool)
      handleCloseApproveBtn()        
    } catch(e) {
      setApproveBtn(true)
    }

    setApprovalPending(false)
  }

  const handleCloseApproveBtn = () => {
    setApproveBtn(false)
  }

  const handleClickOpen = async () => {
    // get user balance 
    let balance = await poolStore.getUserTokenBalance(account, props.pool)
    setBalance(balance)

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCollatralTextFieldChange = (e:any) => {
    let value = e.target.value;
    if (!isNaN(value)) {
      setCollatral(value)
    }
    
    handleUpdates(value, fathomToken)
  }

  const handlefathomTokenTextFieldChange = (e:any) => {
    let value = e.target.value;
    if (!isNaN(value)) {
      setFathomToken(value)
    }
    handleUpdates(collatral, value)
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open New Position
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Open New Position
        </BootstrapDialogTitle>

        <Grid container spacing={2}>
          <Grid item xs={7}>
              <Container>
                  <Grid container spacing={2}>
                      <Grid item xs={7}>
                          <Typography gutterBottom>Collateral to be Locked</Typography>
                      </Grid>
                      <Grid item xs={5}>
                          <Typography gutterBottom>{collatralToBeLocked.toFixed(2)} {props.pool.name}</Typography>
                      </Grid>
                      <Grid item xs={7}>
                          <Typography gutterBottom>Estimated Collateral Available to Withdraw </Typography>
                      </Grid>
                      <Grid item xs={5}>
                          <Typography gutterBottom>{collatralAvailableToWithdraw.toFixed(2)} {props.pool.name}</Typography>
                      </Grid>
                      <Grid item xs={7}>
                          <Typography gutterBottom>FXD to be Borrowed</Typography>
                      </Grid>
                      <Grid item xs={5}>{fxdToBeBorrowed.toFixed(2)} FXD</Grid>
                      <Grid item xs={7}>
                          <Typography gutterBottom>FXD Available to Borrow</Typography>
                      </Grid>
                      <Grid item xs={5}>{fxdAvailableToBorrow.toFixed(2)} FXD</Grid>
                      <Grid item xs={7}>
                          <Typography gutterBottom>LTV</Typography>
                      </Grid>
                      <Grid item xs={5}>{debtRatio.toFixed(2)} %</Grid>
                      <Grid item xs={7}>
                          <Typography gutterBottom>Safety Buffer</Typography>
                      </Grid>
                      {/* <Grid item xs={5}>{(safetyBuffer * 100).toFixed(2)} % </Grid> */}
                      <Grid item xs={5}>{(safetyBuffer * 100).toFixed(2)}  % </Grid>
                      <Grid item xs={7}>
                          <Typography gutterBottom>Liquidation Price of {props.pool.name}</Typography>
                      </Grid>
                      <Grid item xs={5}>${liquidationPrice.toFixed(2)}</Grid>


                      <Grid item xs={7}>
                          <Typography gutterBottom></Typography>
                      </Grid>
                      <Grid item xs={5}></Grid>



                      <Grid item xs={7}>
                          <Typography gutterBottom>Lending APR</Typography>
                      </Grid>
                      <Grid item xs={5}>1.73%</Grid>
                      <Grid item xs={7}>
                          <Typography gutterBottom>Fathom Rewards APR</Typography>
                      </Grid>
                      <Grid item xs={5}>0.22%</Grid>
                      <Grid item xs={7}>
                          <Typography gutterBottom>Stability Fee</Typography>
                      </Grid>
                      <Grid item xs={5}>0.00%</Grid>
                      <Grid item xs={7}>
                          <Typography gutterBottom>Total APR</Typography>
                      </Grid>
                      <Grid item xs={5}>1.96%</Grid>
                      <Grid item xs={7}>
                          <Typography gutterBottom>Total APY</Typography>
                      </Grid>
                      <Grid item xs={5}>1.98%</Grid>
                  </Grid>
              </Container>
          </Grid>
          <Grid item xs={5} >
            <Grid item xs={7}>
                <Typography sx={{marginLeft: 3}}>{props.pool.name} balance: {(balance / 10**18).toFixed(2)}</Typography>
            </Grid>
                        
            <TextField
            id="outlined-helperText"
            label="Collateral Amount"
            defaultValue="Default Value"
            helperText="Enter the Collateral."
            sx={{ m: 3 }}
            value={collatral}
            onChange={handleCollatralTextFieldChange}
          />
            {safeMax > 0 && !balanceError
              ? <Button sx={{ marginBottom: -2, marginTop: -2, marginLeft: 4 }} onClick={updateFathomAmount}>
                Use Safe Max: {safeMax.toFixed(2)}
              </Button>
            : null
          }
            <TextField
            id="outlined-helperText"
            label="FXD"
            defaultValue="Default Value"
            helperText="Enter the desired FXD."
            sx={{ m: 3 }}
            value={fathomToken}
            onChange={handlefathomTokenTextFieldChange}
          />
          {balanceError 
            ? <Typography color="red" gutterBottom>
                You do not have enough {props.pool.name}
              </Typography>
            : null
          }
          <Grid item xs={8}>
            <DialogActions>
              { approvalPending 
                ? <Typography display="inline">
                    Pending ...
                  </Typography>
                : approveBtn
                ? <Button onClick={approve}>
                    Approve {props.pool.name}
                  </Button>
                : null
              }
                                    
              <Button onClick={openNewPosition} disabled={approveBtn || balanceError}>
                Open
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Grid>
      </BootstrapDialog>
    </div>
  );
}