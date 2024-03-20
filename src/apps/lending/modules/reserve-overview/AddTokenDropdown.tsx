import { Box, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import * as React from "react";
import { FC, memo, useEffect, useState } from "react";
import { CircleIcon } from "apps/lending/components/CircleIcon";
import { WalletIcon } from "apps/lending/components/icons/WalletIcon";
import {
  Base64Token,
  TokenIcon,
} from "apps/lending/components/primitives/TokenIcon";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { ERC20TokenType } from "apps/lending/libs/web3-data-provider/Web3Provider";
import { useRootStore } from "apps/lending/store/root";
import { RESERVE_DETAILS } from "apps/lending/utils/mixPanelEvents";

interface AddTokenDropdownProps {
  poolReserve: ComputedReserveData;
  downToSM: boolean;
  switchNetwork: (chainId: number) => Promise<void>;
  addERC20Token: (args: ERC20TokenType) => Promise<boolean>;
  currentChainId: number;
  connectedChainId: number;
  hideFmToken?: boolean;
}

export const AddTokenDropdown: FC<AddTokenDropdownProps> = memo(
  ({
    poolReserve,
    downToSM,
    switchNetwork,
    addERC20Token,
    currentChainId,
    connectedChainId,
    hideFmToken,
  }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [changingNetwork, setChangingNetwork] = useState<boolean>(false);
    const [underlyingBase64, setUnderlyingBase64] = useState<string>("");
    const [fmTokenBase64, setFmTokenBase64] = useState<string>("");
    const open = Boolean(anchorEl);
    const trackEvent = useRootStore((store) => store.trackEvent);
    const theme = useTheme();

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    // The switchNetwork function has no return type, so to detect if a user successfully switched networks before adding token to wallet, check the selected vs connected chain id
    useEffect(() => {
      if (changingNetwork && currentChainId === connectedChainId) {
        addERC20Token({
          address: poolReserve.underlyingAsset,
          decimals: poolReserve.decimals,
          symbol: poolReserve.symbol,
          image: !/_/.test(poolReserve.iconSymbol)
            ? underlyingBase64
            : undefined,
        });
        setChangingNetwork(false);
      }
    }, [
      currentChainId,
      connectedChainId,
      changingNetwork,
      addERC20Token,
      poolReserve?.underlyingAsset,
      poolReserve?.decimals,
      poolReserve?.symbol,
      poolReserve?.iconSymbol,
      underlyingBase64,
    ]);

    if (!poolReserve) {
      return null;
    }

    return (
      <>
        {/* Load base64 token symbol for adding underlying and fmTokens to wallet */}
        {poolReserve?.symbol && !/_/.test(poolReserve.symbol) && (
          <>
            <Base64Token
              symbol={poolReserve.iconSymbol}
              onImageGenerated={setUnderlyingBase64}
              fmToken={false}
            />
            {!hideFmToken && (
              <Base64Token
                symbol={poolReserve.iconSymbol}
                onImageGenerated={setFmTokenBase64}
                fmToken={true}
              />
            )}
          </>
        )}
        <Box onClick={handleClick}>
          <CircleIcon tooltipText="Add token to wallet" downToSM={downToSM}>
            <Box
              onClick={() => {
                trackEvent(RESERVE_DETAILS.ADD_TOKEN_TO_WALLET_DROPDOWN, {
                  asset: poolReserve.underlyingAsset,
                  assetName: poolReserve.name,
                });
              }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                "&:hover": {
                  ".Wallet__icon": { opacity: "0 !important" },
                  ".Wallet__iconHover": { opacity: "1 !important" },
                },
                cursor: "pointer",
              }}
            >
              <WalletIcon
                sx={{
                  width: "14px",
                  height: "14px",
                  stroke: theme.palette.other.fathomAccentMute,
                  "&:hover": { stroke: theme.palette.other.fathomAccent },
                }}
              />
            </Box>
          </CircleIcon>
        </Box>
        <Menu
          sx={{ "& .MuiMenu-paper": { minWidth: "220px !important" } }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          keepMounted={true}
          data-cy="addToWaletSelector"
        >
          <Box sx={{ px: 2, pt: "6px", pb: "6px" }}>
            <Typography variant="secondary12" color="text.secondary">
              Underlying token
            </Typography>
          </Box>

          <MenuItem
            key="underlying"
            value="underlying"
            divider
            sx={{ px: 2, pt: "4px", pb: "4px", minHeight: "40px !important" }}
            onClick={() => {
              if (currentChainId !== connectedChainId) {
                switchNetwork(currentChainId).then(() => {
                  setChangingNetwork(true);
                });
              } else {
                trackEvent(RESERVE_DETAILS.ADD_TO_WALLET, {
                  type: "Underlying token",
                  asset: poolReserve.underlyingAsset,
                  assetName: poolReserve.name,
                });

                addERC20Token({
                  address: poolReserve.underlyingAsset,
                  decimals: poolReserve.decimals,
                  symbol: poolReserve.symbol,
                  image: !/_/.test(poolReserve.symbol)
                    ? underlyingBase64
                    : undefined,
                });
              }
              handleClose();
            }}
          >
            <TokenIcon
              symbol={poolReserve.iconSymbol}
              sx={{ fontSize: "20px" }}
            />
            <Typography
              variant="subheader1"
              sx={{ ml: 2 }}
              noWrap
              data-cy={`assetName`}
            >
              {poolReserve.symbol}
            </Typography>
          </MenuItem>
          {!hideFmToken && (
            <Box>
              <Box sx={{ px: 2, pt: "6px", pb: "6px" }}>
                <Typography variant="secondary12" color="text.secondary">
                  fmToken
                </Typography>
              </Box>
              <MenuItem
                sx={{
                  px: 2,
                  pt: "4px",
                  pb: "4px",
                  minHeight: "40px !important",
                }}
                key="fmtoken"
                value="fmtoken"
                onClick={() => {
                  if (currentChainId !== connectedChainId) {
                    switchNetwork(currentChainId).then(() => {
                      setChangingNetwork(true);
                    });
                  } else {
                    trackEvent(RESERVE_DETAILS.ADD_TO_WALLET, {
                      asset: poolReserve.underlyingAsset,
                      assetName: poolReserve.name,
                    });

                    addERC20Token({
                      address: poolReserve.fmTokenAddress,
                      decimals: poolReserve.decimals,
                      symbol: `fm${poolReserve.symbol}`,
                      image: !/_/.test(poolReserve.symbol)
                        ? fmTokenBase64
                        : undefined,
                    });
                  }
                  handleClose();
                }}
              >
                <TokenIcon
                  symbol={poolReserve.iconSymbol}
                  sx={{ fontSize: "20px" }}
                  fmToken={true}
                />
                <Typography
                  variant="subheader1"
                  sx={{ ml: 2 }}
                  noWrap
                  data-cy={`assetName`}
                >
                  {`fm${poolReserve.symbol}`}
                </Typography>
              </MenuItem>
            </Box>
          )}
        </Menu>
      </>
    );
  }
);
