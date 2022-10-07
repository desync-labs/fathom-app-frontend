import { useCallback, useEffect, useState, useRef } from "react";
import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { observer } from "mobx-react";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { useWeb3React } from "@web3-react/core";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";

const options = ["USDT To FXD", "FXD To USDT"];

const StableSwap = observer(() => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [inputValue, setInputValue] = useState(0);
  const [approveFxdBtn, setApproveFxdBtn] = useState(false);
  const [approveUsdtBtn, setApproveUsdtBtn] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);

  const { chainId } = useWeb3React();

  const stableSwapStore = useStores().stableSwapStore;
  const { account } = useMetaMask()!;

  const approvalStatus = useCallback(async () => {
    let input = inputValue || 0;
    let approved;
    if (selectedIndex === 0) {
      // usdt
      approved = await stableSwapStore.approvalStatusUsdt(account, input);
      approved ? setApproveUsdtBtn(false) : setApproveUsdtBtn(true);
    } else {
      // fxd
      approved = await stableSwapStore.approvalStatusStablecoin(account, input);
      approved ? setApproveFxdBtn(false) : setApproveFxdBtn(true);
    }
  }, [inputValue, stableSwapStore, account, selectedIndex, setApproveUsdtBtn]);

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        approvalStatus();
      });
    }
  }, [chainId, approvalStatus]);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
    stableSwapStore.swapToken(selectedIndex, account, inputValue);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    if (index === 0) {
      setApproveFxdBtn(false);
    } else {
      setApproveUsdtBtn(false);
    }
    setSelectedIndex(index);
    setOpen(false);
  };

  const approveFxd = useCallback(async () => {
    setApprovalPending(true);
    try {
      // approve fxd
      await stableSwapStore.approveStablecoin(account);
      setApproveFxdBtn(false);
    } catch (e) {
      setApproveFxdBtn(true);
    }

    setApprovalPending(false);
  }, [setApprovalPending, setApproveFxdBtn, stableSwapStore, account]);

  const approveUsdt = useCallback(async () => {
    setApprovalPending(true);
    try {
      // approve usdt
      await stableSwapStore.approveUsdt(account, inputValue);
      setApproveUsdtBtn(false);
    } catch (e) {
      setApproveUsdtBtn(true);
    }

    setApprovalPending(false);
  }, [
    stableSwapStore,
    setApprovalPending,
    setApproveUsdtBtn,
    account,
    inputValue,
  ]);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  const handleClose = useCallback(
    (event: Event) => {
      if (
        anchorRef.current &&
        anchorRef.current.contains(event.target as HTMLElement)
      ) {
        return;
      }

      setOpen(false);
    },
    [anchorRef, setOpen]
  );

  const handleInputValueTextFieldChange = useCallback(
    (e: any) => {
      setInputValue(e.target.value);
    },
    [setInputValue]
  );

  return (
    <AppPaper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Stable Swap
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Stableswap. This module keeps the stablecoin pegged to 1 USD. When the
        stablecoin price depegs from 1 USD, an arbitrage can be performed using
        this module.
      </Typography>
      <Box sx={{ marginTop: 2 }}>
        <TextField
          id="outlined-start-adornment"
          label={"Amount"}
          defaultValue=""
          size="small"
          value={inputValue}
          onChange={handleInputValueTextFieldChange}
          sx={{ marginRight: 2 }}
        />

        {approvalPending ? (
          <Typography display="inline" sx={{ marginRight: 2 }}>
            Pending ...
          </Typography>
        ) : approveFxdBtn ? (
          <Button
            variant="outlined"
            onClick={approveFxd}
            sx={{ marginRight: 2 }}
          >
            Approve FXD
          </Button>
        ) : approveUsdtBtn ? (
          <Button
            variant="outlined"
            onClick={approveUsdt}
            sx={{ marginRight: 2 }}
          >
            Approve USDT
          </Button>
        ) : null}

        <ButtonGroup
          variant="contained"
          ref={anchorRef}
          aria-label="split button"
        >
          <Button
            disabled={approveUsdtBtn || approveFxdBtn || approvalPending}
            onClick={handleClick}
          >
            {options[selectedIndex]}
          </Button>
          <Button
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
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
                  placement === "bottom" ? "center top" : "center bottom",
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
    </AppPaper>
  );
});

export default StableSwap;
