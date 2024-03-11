import { valueToBigNumber } from "@into-the-fathom/lending-math-utils";
import { Box, Typography } from "@mui/material";
import { CapsCircularStatus } from "apps/lending/components/caps/CapsCircularStatus";
import { IncentivesButton } from "apps/lending/components/incentives/IncentivesButton";
import { StableAPYTooltip } from "apps/lending/components/infoTooltips/StableAPYTooltip";
import { VariableAPYTooltip } from "apps/lending/components/infoTooltips/VariableAPYTooltip";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { ReserveSubheader } from "apps/lending/components/ReserveSubheader";
import { TextWithTooltip } from "apps/lending/components/TextWithTooltip";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { AssetCapHookData } from "apps/lending/hooks/useAssetCaps";
import {
  MarketDataType,
  NetworkConfig,
} from "apps/lending/utils/marketsAndNetworksConfig";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { ApyGraphContainer } from "apps/lending/modules/reserve-overview/graphs/ApyGraphContainer";
import { ReserveFactorOverview } from "apps/lending/modules/reserve-overview/ReserveFactorOverview";
import { PanelItem } from "apps/lending/modules/reserve-overview/ReservePanels";
import { FC, memo } from "react";

interface BorrowInfoProps {
  reserve: ComputedReserveData;
  currentMarketData: MarketDataType;
  currentNetworkConfig: NetworkConfig;
  renderCharts: boolean;
  showBorrowCapStatus: boolean;
  borrowCap: AssetCapHookData;
}

export const BorrowInfo: FC<BorrowInfoProps> = memo(
  ({
    reserve,
    currentMarketData,
    currentNetworkConfig,
    renderCharts,
    showBorrowCapStatus,
    borrowCap,
  }) => {
    return (
      <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: "100%", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {showBorrowCapStatus ? (
            // With a borrow cap
            <>
              <CapsCircularStatus
                value={borrowCap.percentUsed}
                tooltipContent={
                  <>
                    Maximum amount available to supply is{" "}
                    <FormattedNumber
                      value={
                        valueToBigNumber(reserve.borrowCap).toNumber() -
                        valueToBigNumber(reserve.totalDebt).toNumber()
                      }
                      variant="secondary12"
                      color="text.light"
                    />{" "}
                    {reserve.symbol} (
                    <FormattedNumber
                      value={
                        valueToBigNumber(reserve.borrowCapUSD).toNumber() -
                        valueToBigNumber(reserve.totalDebtUSD).toNumber()
                      }
                      variant="secondary12"
                      symbol="USD"
                      color="text.light"
                    />
                    ).
                  </>
                }
              />
              <PanelItem
                title={
                  <Box display="flex" alignItems="center">
                    Total borrowed
                    <TextWithTooltip
                      event={{
                        eventName: GENERAL.TOOL_TIP,
                        eventParams: {
                          tooltip: "Total borrowed",
                          asset: reserve.underlyingAsset,
                          assetName: reserve.name,
                        },
                      }}
                    >
                      <>
                        Borrowing of this asset is limited to a certain amount
                        to minimize liquidity pool insolvency.
                      </>
                    </TextWithTooltip>
                  </Box>
                }
              >
                <Box>
                  <FormattedNumber
                    value={reserve.totalDebt}
                    variant="main16"
                    color="text.light"
                  />
                  <Typography
                    component="span"
                    color="text.primary"
                    variant="secondary16"
                    sx={{ display: "inline-block", mx: 1 }}
                  >
                    of
                  </Typography>
                  <FormattedNumber
                    value={reserve.borrowCap}
                    variant="main16"
                    color="text.light"
                  />
                </Box>
                <Box>
                  <ReserveSubheader value={reserve.totalDebtUSD} />
                  <Typography
                    component="span"
                    color="text.primary"
                    variant="secondary16"
                    sx={{ display: "inline-block", mx: 1 }}
                  >
                    of
                  </Typography>
                  <ReserveSubheader value={reserve.borrowCapUSD} />
                </Box>
              </PanelItem>
            </>
          ) : (
            // Without a borrow cap
            <PanelItem
              title={
                <Box display="flex" alignItems="center">
                  Total borrowed
                </Box>
              }
            >
              <FormattedNumber
                value={reserve.totalDebt}
                variant="main16"
                color="text.light"
              />
              <ReserveSubheader value={reserve.totalDebtUSD} />
            </PanelItem>
          )}
          <PanelItem
            title={
              <VariableAPYTooltip
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: "APY, variable",
                    asset: reserve.underlyingAsset,
                    assetName: reserve.name,
                  },
                }}
                text={"APY, variable"}
                key="APY_res_variable_type"
                variant="description"
              />
            }
          >
            <FormattedNumber
              value={reserve.variableBorrowAPY}
              percent
              variant="main16"
              color="text.light"
            />
            <IncentivesButton
              symbol={reserve.symbol}
              incentives={reserve.vIncentivesData}
              displayBlank={true}
            />
          </PanelItem>
          {reserve.stableBorrowRateEnabled && (
            <PanelItem
              title={
                <StableAPYTooltip
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                    eventParams: {
                      tooltip: "APY, stable",
                      asset: reserve.underlyingAsset,
                      assetName: reserve.name,
                    },
                  }}
                  text={"APY, stable"}
                  key="APY_res_stable_type"
                  variant="description"
                />
              }
            >
              <FormattedNumber
                value={reserve.stableBorrowAPY}
                percent
                variant="main16"
                color="text.light"
              />
              <IncentivesButton
                symbol={reserve.symbol}
                incentives={reserve.sIncentivesData}
                displayBlank={true}
              />
            </PanelItem>
          )}
          {reserve.borrowCapUSD && reserve.borrowCapUSD !== "0" && (
            <PanelItem title={"Borrow cap"}>
              <FormattedNumber
                value={reserve.borrowCap}
                variant="main16"
                color="text.light"
              />
              <ReserveSubheader value={reserve.borrowCapUSD} />
            </PanelItem>
          )}
        </Box>
        {renderCharts && (
          <ApyGraphContainer
            graphKey="borrow"
            reserve={reserve}
            currentMarketData={currentMarketData}
          />
        )}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            pt: "42px",
            pb: "12px",
          }}
          paddingTop={"42px"}
        >
          <Typography variant="subheader1" color="text.light">
            Collector Info
          </Typography>
        </Box>
        {currentMarketData.addresses.COLLECTOR && (
          <ReserveFactorOverview
            collectorContract={currentMarketData.addresses.COLLECTOR}
            explorerLinkBuilder={currentNetworkConfig.explorerLinkBuilder}
            reserveFactor={reserve.reserveFactor}
            reserveName={reserve.name}
            reserveAsset={reserve.underlyingAsset}
          />
        )}
      </Box>
    );
  }
);
