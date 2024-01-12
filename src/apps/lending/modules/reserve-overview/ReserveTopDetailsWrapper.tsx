import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackOutlined";
import {
  Box,
  Button,
  Divider,
  Skeleton,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  getMarketInfoById,
  MarketLogo,
} from "apps/lending/components/MarketSwitcher";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";

import { TopInfoPanel } from "apps/lending/components/TopInfoPanel/TopInfoPanel";
import { TopInfoPanelItem } from "apps/lending/components/TopInfoPanel/TopInfoPanelItem";
import {
  ComputedReserveData,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { AddTokenDropdown } from "apps/lending/modules/reserve-overview/AddTokenDropdown";
import { ReserveTopDetails } from "apps/lending/modules/reserve-overview/ReserveTopDetails";
import { TokenLinkDropdown } from "apps/lending/modules/reserve-overview/TokenLinkDropdown";
import { useNavigate } from "react-router-dom";
import { FC, memo } from "react";

interface ReserveTopDetailsProps {
  underlyingAsset: string;
}

export const ReserveTopDetailsWrapper: FC<ReserveTopDetailsProps> = memo(
  ({ underlyingAsset }) => {
    const navigate = useNavigate();
    const { reserves, loading } = useAppDataContext();
    const { currentMarket, currentChainId } = useProtocolDataContext();
    const { market, network } = getMarketInfoById(currentMarket);
    const {
      addERC20Token,
      switchNetwork,
      chainId: connectedChainId,
      connected,
    } = useWeb3Context();

    const theme = useTheme();
    const downToSM = useMediaQuery(theme.breakpoints.down("sm"));

    const poolReserve = reserves.find(
      (reserve) => reserve.underlyingAsset === underlyingAsset
    ) as ComputedReserveData;

    const valueTypographyVariant = downToSM ? "main16" : "main21";

    const ReserveIcon = () => {
      return (
        <Box
          mr={3}
          sx={{
            mr: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ background: "#383D51" }}
            />
          ) : (
            <img
              src={`/icons/tokens/${poolReserve.iconSymbol.toLowerCase()}.svg`}
              width="40px"
              height="40px"
              alt=""
            />
          )}
        </Box>
      );
    };

    const ReserveName = () => {
      return loading ? (
        <Skeleton width={60} height={28} sx={{ background: "#383D51" }} />
      ) : (
        <Typography variant={valueTypographyVariant}>
          {poolReserve.name}
        </Typography>
      );
    };

    return (
      <TopInfoPanel
        titleComponent={
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: downToSM ? "flex-start" : "center",
                alignSelf: downToSM ? "flex-start" : "center",
                mb: 4,
                minHeight: "40px",
                flexDirection: downToSM ? "column" : "row",
              }}
            >
              <Button
                variant="surface"
                size="medium"
                color="primary"
                startIcon={
                  <SvgIcon sx={{ fontSize: "20px" }}>
                    <ArrowBackRoundedIcon />
                  </SvgIcon>
                }
                onClick={() => {
                  if (history.state.idx !== 0) navigate(-1);
                  else navigate("/markets");
                }}
                sx={{ mr: 3, mb: downToSM ? "24px" : "0" }}
              >
                Go Back
              </Button>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MarketLogo size={20} logo={network.networkLogoPath} />
                <Typography variant="subheader1" sx={{ color: "common.white" }}>
                  {market.marketTitle} Market
                </Typography>
              </Box>
            </Box>

            {downToSM && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 6 }}>
                <ReserveIcon />
                <Box>
                  {!loading && (
                    <Typography sx={{ color: "#A5A8B6" }} variant="caption">
                      {poolReserve.symbol}
                    </Typography>
                  )}
                  <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                    <ReserveName />
                    {loading ? (
                      <Skeleton
                        width={160}
                        height={16}
                        sx={{ ml: 1, background: "red" }}
                      />
                    ) : (
                      <Box sx={{ display: "flex" }}>
                        <TokenLinkDropdown
                          poolReserve={poolReserve}
                          downToSM={downToSM}
                        />
                        {connected && (
                          <AddTokenDropdown
                            poolReserve={poolReserve}
                            downToSM={downToSM}
                            switchNetwork={switchNetwork}
                            addERC20Token={addERC20Token}
                            currentChainId={currentChainId}
                            connectedChainId={connectedChainId}
                          />
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        }
      >
        {!downToSM && (
          <>
            <TopInfoPanelItem
              title={!loading && <>{poolReserve.symbol}</>}
              withoutIconWrapper
              icon={<ReserveIcon />}
              loading={loading}
            >
              <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                <ReserveName />

                <Box sx={{ display: "flex" }}>
                  <TokenLinkDropdown
                    poolReserve={poolReserve}
                    downToSM={downToSM}
                  />
                  {connected && (
                    <AddTokenDropdown
                      poolReserve={poolReserve}
                      downToSM={downToSM}
                      switchNetwork={switchNetwork}
                      addERC20Token={addERC20Token}
                      currentChainId={currentChainId}
                      connectedChainId={connectedChainId}
                    />
                  )}
                </Box>
              </Box>
            </TopInfoPanelItem>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ my: 1, borderColor: "rgba(235, 235, 239, 0.08)" }}
            />
          </>
        )}
        <ReserveTopDetails underlyingAsset={underlyingAsset} />
      </TopInfoPanel>
    );
  }
);
