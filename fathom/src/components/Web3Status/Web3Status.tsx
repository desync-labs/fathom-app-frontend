import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import {
  RightNetwork,
  WrongNetwork,
} from "components/AppComponents/AppBox/AppBox";
import {
  XDC_CHAIN_IDS,
  NETWORK_LABELS,
  ChainId,
  XDC_NETWORK_SETTINGS,
} from "connectors/networks";
import { getTokenLogoURL } from "utils/tokenLogo";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import React, {
  ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { styled } from "@mui/material/styles";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import Web3 from "web3";

const NetworkPaper = styled(AppPaper)`
  background: #253656;
  border: 1px solid #4f658c;
  box-shadow: 0px 12px 32px #000715;
  border-radius: 8px;
  padding: 4px;

  ul {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
    li {
      padding: 6px 12px;
      font-size: 13px;
      border-radius: 6px;

      &:hover {
        background: #324567;
      }
    }
  }
`;

export const Web3Status = () => {
  const { error, account, chainId } = useWeb3React();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  let button: null | ReactElement = null;

  const options = useMemo(() => {
    return Object.entries(NETWORK_LABELS).filter(([filterChainId]) => {
      return Number(filterChainId) !== chainId;
    });
  }, [chainId]);

  const requestChangeNetwork = useCallback(
    async (chainId: string) => {
      setOpen(false);

      if (window.ethereum) {
        try {
          // @ts-ignore
          await window!.ethereum?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: Web3.utils.toHex(chainId) }],
          });
        } catch (err: any) {
          if (err.code === 4902) {
            // @ts-ignore
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              // @ts-ignore
              params: [XDC_NETWORK_SETTINGS[chainId]],
            });
          }
        }
      }
    },
    [setOpen]
  );

  if (XDC_CHAIN_IDS.includes(chainId!)) {
    button = (
      <RightNetwork onClick={() => setOpen(!open)}>
        <>
          <img src={getTokenLogoURL("WXDC")} alt={"xdc"} width={16} />
          {NETWORK_LABELS[chainId as ChainId]}
          <ArrowDropDownIcon />
        </>
      </RightNetwork>
    );
  } else if (error) {
    button = (
      <WrongNetwork onClick={() => setOpen(!open)}>
        <>
          {error instanceof UnsupportedChainIdError
            ? "Wrong Network"
            : !account
            ? "Wallet Request Permissions Error"
            : "Error"}
          <ArrowDropDownIcon />
        </>
      </WrongNetwork>
    );
  }

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        {button}
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
              transformOrigin: "center bottom",
            }}
          >
            <NetworkPaper>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map(([chainId, chainName]) => (
                    <MenuItem
                      onClick={() => requestChangeNetwork(chainId)}
                      key={chainId}
                    >
                      {chainName}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </NetworkPaper>
          </Grow>
        )}
      </Popper>
    </>
  );

  return null;
};
