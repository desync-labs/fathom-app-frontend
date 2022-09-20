import * as React from 'react';
import { Box, TextField, Typography } from '@mui/material';
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

const options = ['Swap USDT', 'Swap Fathom'];


const StableSwap = observer(() => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [placeHolder, setPlaceHolder] = React.useState(options[0]);
    const [inputValue, setInputValue] = React.useState(0);

    let stableSwapStore = useStores().stableSwapStore;
    const { account } = useMetaMask()!
  
    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
      stableSwapStore.swapToken(selectedIndex,account,inputValue);
    };
  
    const handleMenuItemClick = (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>,
      index: number,
    ) => {
      setSelectedIndex(index);
      setOpen(false);
      setPlaceHolder(options[index])
    };
  
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
          label= {placeHolder}
          defaultValue=""
          size="small"
          value={inputValue}
          onChange={handleInputValueTextFieldChange}
          sx={{marginRight: 2}}/>
         
        <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
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
  );
})

export default StableSwap;
