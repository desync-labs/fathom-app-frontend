import * as React from 'react';
import { Box, Container, TextField, Toolbar, Typography} from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { observer } from 'mobx-react';
import { useStores } from '../../stores';
import useMetaMask from '../../hooks/metamask';
import AlertMessages from '../Common/AlertMessages';
import TransactionStatus from '../Transaction/TransactionStatus';

const options = ['USDT To FXD', 'FXD To USDT'];

const StableSwap = observer(() => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
//    const [placeHolder, setPlaceHolder] = React.useState(options[0]);
    const [inputValue, setInputValue] = React.useState(0);
    const [approveFxdBtn, setApproveFxdBtn] = React.useState(false);
    const [approveUsdtBtn, setApproveUsdtBtn] = React.useState(false);
    const [approvalPending, setApprovalPending] = React.useState(false);


    let stableSwapStore = useStores().stableSwapStore;
    const { account } = useMetaMask()!


    React.useEffect(() => {
      approvalStatus()
    })

    const approvalStatus = async () => {
      let input = inputValue;
      if (!input) {
        input = 0;
      }
      let approved;
      if (selectedIndex == 0) {
        // usdt 
        approved = await stableSwapStore.approvalStatusUsdt(account, input)
        approved ? setApproveUsdtBtn(false) : setApproveUsdtBtn(true)
      } else {
        // fxd
        approved = await stableSwapStore.approvalStatusStablecoin(account, input)
        approved ? setApproveFxdBtn(false) : setApproveFxdBtn(true)
      }      
    }

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
      stableSwapStore.swapToken(selectedIndex,account,inputValue);
    };
  
    const handleMenuItemClick = (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>,
      index: number,
    ) => {
      if (index == 0) {
        setApproveFxdBtn(false)
      } else {
        setApproveUsdtBtn(false)
      }
      setSelectedIndex(index);
      setOpen(false);
    };

    const approveFxd = async () => {
      setApprovalPending(true)
      try{
        // approve fxd
        await stableSwapStore.approveStablecoin(account)
        setApproveFxdBtn(false)        
      } catch(e) {
        setApproveFxdBtn(true)        
      }
  
      setApprovalPending(false)
    }

    const approveUsdt = async () => {
      setApprovalPending(true)
      try{
        // approve usdt
        await stableSwapStore.approveUsdt(account, inputValue)
        setApproveUsdtBtn(false)    
      } catch(e) {
        setApproveUsdtBtn(true)    
      }
  
      setApprovalPending(false)
    }

  
    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
  
    const handleClose = (event: Event) => {
      if (
        anchorRef.current &&
        anchorRef.current.contains(event.target as HTMLElement)
      ) {
        return;
      }
  
      setOpen(false);
    };

    const handleInputValueTextFieldChange = (e:any) => {
        setInputValue(e.target.value)
      }
  

  return (
    <Box 
    component="main"
    sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    }}
  >
    <Toolbar />
    <AlertMessages/>
    <TransactionStatus/>
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      Stable Swap
    </Typography>
    <Typography color="text.secondary" sx={{ flex: 1 }}>
    Stableswap module is the stablity module to keep stablecoin pegged to it's original value. Arbitrauger uses it to earn profile in case Stablecoin value depagged, that results value reset back to it's original peg.
    </Typography>
    <Box  sx={{marginTop: 2}}>
        <TextField
          id="outlined-start-adornment"
          label= {'Amount'}
          defaultValue=""
          size="small"
          value={inputValue}
          onChange={handleInputValueTextFieldChange}
          sx={{marginRight: 2}}/>

          { approvalPending 
            ? <Typography display="inline" sx={{marginRight: 2}}>
                Pending ...
              </Typography>
            : approveFxdBtn
            ? <Button  variant="outlined" onClick={approveFxd} sx={{marginRight: 2}}>
                Approve FXD
              </Button>
            : approveUsdtBtn
            ? <Button  variant="outlined" onClick={approveUsdt} sx={{marginRight: 2}}>
                Approve USDT
              </Button>
            : null
          }
         
        <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button disabled={approveUsdtBtn || approveFxdBtn || approvalPending} onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      </Box>
</Paper>
</Container>
</Box>
  );
})

export default StableSwap;
