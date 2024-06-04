import {
  Box,
  ListItemText,
  MenuItem,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { FC } from "react";
import { useRootStore } from "apps/lending/store/root";
import { BaseNetworkConfig } from "apps/lending/ui-config/networksConfig";
import { DASHBOARD } from "apps/lending/utils/mixPanelEvents";

import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import {
  availableMarkets,
  CustomMarket,
  MarketDataType,
  marketsData,
  networkConfigs,
  DEV_ENV,
} from "apps/lending/utils/marketsAndNetworksConfig";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

export const getMarketInfoById = (marketId: CustomMarket) => {
  const market: MarketDataType = marketsData[marketId as CustomMarket];
  const network: BaseNetworkConfig = networkConfigs[market.chainId];

  return { market, network };
};

export const getMarketHelpData = (marketName: string) => {
  const testChains = ["Apothem"];
  const arrayName = marketName.split(" ");
  const testChainName = arrayName.filter((el) => testChains.indexOf(el) > -1);
  const marketTitle = arrayName
    .filter((el) => !testChainName.includes(el))
    .join(" ");
  return {
    name: marketTitle,
    testChainName: testChainName[0],
  };
};

export type Market = {
  marketTitle: string;
  networkName: string;
  networkLogo: string;
  selected?: boolean;
};

type MarketLogoProps = {
  size: number;
  logo: string;
  testChainName?: string;
};

export const MarketLogo: FC<MarketLogoProps> = ({
  size,
  logo,
  testChainName,
}) => {
  return (
    <Box sx={{ mr: 1, width: size, height: size, position: "relative" }}>
      <img src={logo} alt="" width="100%" height="100%" />

      {testChainName && (
        <Tooltip title={testChainName} arrow>
          <Box
            sx={{
              bgcolor: "#29B6F6",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              color: "common.white",
              fontSize: "12px",
              lineHeight: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: "-2px",
              bottom: "-2px",
            }}
          >
            {testChainName.split("")[0]}
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export const MarketSwitcher = () => {
  const { currentMarket, setCurrentMarket } = useProtocolDataContext();
  const theme = useTheme();
  const upToLG = useMediaQuery(theme.breakpoints.up("lg"));
  const downToXSM = useMediaQuery(theme.breakpoints.down("xsm"));
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleMarketSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    trackEvent(DASHBOARD.CHANGE_MARKET, { market: e.target.value });
    setCurrentMarket(e.target.value as unknown as CustomMarket);
  };

  return (
    <TextField
      select
      aria-label="select market"
      data-cy="marketSelector"
      value={currentMarket}
      onChange={handleMarketSelect}
      sx={{
        mr: 0.5,
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      }}
      SelectProps={{
        native: false,
        className: "MarketSwitcher__select",
        IconComponent: (props) => (
          <SvgIcon fontSize="large" {...props}>
            <KeyboardArrowDownRoundedIcon />
          </SvgIcon>
        ),
        renderValue: (marketId) => {
          const { market, network } = getMarketInfoById(
            marketId as CustomMarket
          );
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MarketLogo
                size={upToLG ? 32 : 28}
                logo={network.networkLogoPath}
                testChainName={
                  getMarketHelpData(market.marketTitle).testChainName
                }
              />
              <Box
                sx={{
                  mr: 0.5,
                  display: "inline-flex",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant={upToLG ? "display1" : "h1"}
                  sx={{
                    fontSize: downToXSM ? "1.55rem" : undefined,
                    color: "common.white",
                    mr: 0.5,
                  }}
                >
                  {getMarketHelpData(market.marketTitle).name}{" "}
                  {market.isFork ? "Fork" : ""}
                  {upToLG && " Market"}
                </Typography>
              </Box>
            </Box>
          );
        },
        sx: {
          "&.MarketSwitcher__select .MuiSelect-outlined": {
            pl: 0,
            py: 0,
            backgroundColor: "transparent !important",
          },
          ".MuiSelect-icon": { color: "#F1F1F3" },
        },
        MenuProps: {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          PaperProps: {
            style: {
              minWidth: 240,
            },
            variant: "outlined",
            elevation: 0,
          },
        },
      }}
    >
      <Box>
        <Typography
          variant="subheader2"
          color="text.secondary"
          sx={{ px: 2, pt: 1, mb: 1 }}
        >
          {DEV_ENV ? "Select Testnet Market" : "Select Market"}
        </Typography>
      </Box>
      {availableMarkets.map((marketId: CustomMarket) => {
        const { market, network } = getMarketInfoById(marketId);
        const marketNaming = getMarketHelpData(market.marketTitle);
        return (
          <MenuItem
            key={marketId}
            data-cy={`marketSelector_${marketId}`}
            value={marketId}
            sx={{
              ".MuiListItemIcon-root": { minWidth: "unset" },
              display: "flex",
            }}
          >
            <MarketLogo
              size={32}
              logo={network.networkLogoPath}
              testChainName={marketNaming.testChainName}
            />
            <ListItemText sx={{ mr: 0 }}>
              {marketNaming.name} {market.isFork ? "Fork" : ""}
            </ListItemText>
            <ListItemText sx={{ textAlign: "right" }}>
              <Typography color="info.100" variant="description">
                {marketNaming.testChainName}
              </Typography>
            </ListItemText>
          </MenuItem>
        );
      })}
    </TextField>
  );
};
