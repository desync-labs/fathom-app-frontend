import { UnsupportedChainIdError } from "@web3-react/core";
import {
  RightNetwork,
  WrongNetwork,
  WrongNetworkMobile,
  WrongNetworkMobileIcon,
} from "components/AppComponents/AppBox/AppBox";
import {
  ChainId,
  NETWORK_SETTINGS,
  supportedChainIds,
} from "connectors/networks";
import { getTokenLogoURL } from "utils/tokenLogo";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { ReactElement, useMemo, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import { Box } from "@mui/material";
import useConnector from "context/connector";
import useSharedContext from "context/shared";
import { DEFAULT_CHAIN_ID } from "utils/Constants";
import BasePopover, { PopoverType } from "components/Base/Popover/BasePopover";

const NetworkPaper = styled(AppPaper)`
  background: #253656;
  border: 1px solid #4f658c;
  box-shadow: 0 12px 32px #000715;
  border-radius: 8px;
  padding: 4px;

  ul {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;

    li {
      padding: 6px 8px 6px 6px;
      font-size: 13px;
      border-radius: 6px;

      &:hover {
        background: #324567;
      }
    }
  }
`;

const EmptyButtonWrapper = styled(Box)`
  padding: 3px;
  border-radius: 8px;
  margin-right: 10px;
  cursor: auto;
  background: #253656;
  &.error {
    background: transparent;
    margin-right: 0;
  }
`;

const SelectNetworkMenuItem = styled(MenuItem)`
  display: flex;
  align-items: center;
  padding: 4px 6px;
  gap: 7px;
`;

const Web3Status = () => {
  const { error, account, chainId, requestChangeNetwork } = useConnector();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { isMobile } = useSharedContext();

  let button: null | ReactElement = null;

  const options = useMemo(
    () =>
      Object.entries(NETWORK_SETTINGS).filter(([filterChainId]) => {
        return Number(filterChainId) !== chainId;
      }),
    [chainId]
  );

  const showNetworkSelector =
    (chainId || error instanceof UnsupportedChainIdError) && options.length;

  const isError = error || (chainId && !supportedChainIds.includes(chainId));

  if (supportedChainIds.includes(chainId)) {
    button = (
      <RightNetwork onClick={() => setOpen(!open)}>
        <>
          <img
            src={
              NETWORK_SETTINGS[chainId as ChainId]
                ? getTokenLogoURL(NETWORK_SETTINGS[chainId as ChainId].logoName)
                : getTokenLogoURL(
                    NETWORK_SETTINGS[DEFAULT_CHAIN_ID as ChainId].logoName
                  )
            }
            alt={"xdc"}
            width={16}
          />
          {!isMobile &&
            (NETWORK_SETTINGS[chainId as ChainId].chainName ||
              NETWORK_SETTINGS[DEFAULT_CHAIN_ID as ChainId].chainName)}
          {showNetworkSelector ? <ArrowDropDownIcon /> : null}
        </>
      </RightNetwork>
    );
  } else if (isError) {
    button = isMobile ? (
      <WrongNetworkMobile onClick={() => setOpen(!open)}>
        <BasePopover
          id={"wrong-network"}
          type={PopoverType.Error}
          text={<>Select XDC network in your wallet.</>}
          element={<WrongNetworkMobileIcon />}
        />
        {showNetworkSelector ? <ArrowDropDownIcon /> : null}
      </WrongNetworkMobile>
    ) : (
      <WrongNetwork
        onClick={() => setOpen(!open)}
        sx={{ padding: showNetworkSelector ? "4px 12px" : "6px 16px" }}
      >
        <>
          {error instanceof UnsupportedChainIdError ||
          !supportedChainIds.includes(chainId)
            ? "Wrong Network"
            : !account
            ? "Wallet Request Permissions Error"
            : "Error"}
          {showNetworkSelector ? <ArrowDropDownIcon /> : null}
        </>
      </WrongNetwork>
    );
  }

  return (chainId ||
    error instanceof UnsupportedChainIdError ||
    !supportedChainIds.includes(chainId)) &&
    options.length ? (
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
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "center bottom",
            }}
          >
            <NetworkPaper>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map(([chainId, chainData]) => (
                    <SelectNetworkMenuItem
                      onClick={() => {
                        setOpen(false);
                        requestChangeNetwork(Number(chainId));
                      }}
                      key={chainId}
                    >
                      <img
                        src={
                          NETWORK_SETTINGS[chainId as unknown as ChainId]
                            ? getTokenLogoURL(
                                NETWORK_SETTINGS[chainId as unknown as ChainId]
                                  .logoName
                              )
                            : getTokenLogoURL(
                                NETWORK_SETTINGS[DEFAULT_CHAIN_ID as ChainId]
                                  .logoName
                              )
                        }
                        alt={"xdc"}
                        width={16}
                      />{" "}
                      {chainData.chainName}
                    </SelectNetworkMenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </NetworkPaper>
          </Grow>
        )}
      </Popper>
    </>
  ) : button ? (
    <EmptyButtonWrapper className={`empty-box ${isError ? "error" : ""}`}>
      {button}
    </EmptyButtonWrapper>
  ) : null;
};

export default Web3Status;
