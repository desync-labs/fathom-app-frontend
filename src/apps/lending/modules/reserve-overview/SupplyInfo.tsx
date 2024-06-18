import { valueToBigNumber } from "@into-the-fathom/lending-math-utils";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { Box, Typography } from "@mui/material";
import { CapsCircularStatus } from "apps/lending/components/caps/CapsCircularStatus";
import { DebtCeilingStatus } from "apps/lending/components/caps/DebtCeilingStatus";
import { IncentivesButton } from "apps/lending/components/incentives/IncentivesButton";
import { LiquidationPenaltyTooltip } from "apps/lending/components/infoTooltips/LiquidationPenaltyTooltip";
import { LiquidationThresholdTooltip } from "apps/lending/components/infoTooltips/LiquidationThresholdTooltip";
import { MaxLTVTooltip } from "apps/lending/components/infoTooltips/MaxLTVTooltip";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Warning } from "apps/lending/components/primitives/Warning";
import { ReserveOverviewBox } from "apps/lending/components/ReserveOverviewBox";
import { ReserveSubheader } from "apps/lending/components/ReserveSubheader";
import { TextWithTooltip } from "apps/lending/components/TextWithTooltip";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { AssetCapHookData } from "apps/lending/hooks/useAssetCaps";
import { MarketDataType } from "apps/lending/utils/marketsAndNetworksConfig";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { ApyGraphContainer } from "apps/lending/modules/reserve-overview/graphs/ApyGraphContainer";
import { PanelItem } from "apps/lending/modules/reserve-overview/ReservePanels";
import { FC, memo } from "react";

interface SupplyInfoProps {
  reserve: ComputedReserveData;
  currentMarketData: MarketDataType;
  renderCharts: boolean;
  showSupplyCapStatus: boolean;
  supplyCap: AssetCapHookData;
  debtCeiling: AssetCapHookData;
}

export const SupplyInfo: FC<SupplyInfoProps> = memo(
  ({
    reserve,
    currentMarketData,
    renderCharts,
    showSupplyCapStatus,
    supplyCap,
    debtCeiling,
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
          {showSupplyCapStatus ? (
            // With supply cap
            <>
              <CapsCircularStatus
                value={supplyCap.percentUsed}
                tooltipContent={
                  <>
                    Maximum amount available to supply is{" "}
                    <FormattedNumber
                      value={
                        valueToBigNumber(reserve.supplyCap).toNumber() -
                        valueToBigNumber(reserve.totalLiquidity).toNumber()
                      }
                      variant="secondary12"
                    />{" "}
                    {reserve.symbol} (
                    <FormattedNumber
                      value={
                        valueToBigNumber(reserve.supplyCapUSD).toNumber() -
                        valueToBigNumber(reserve.totalLiquidityUSD).toNumber()
                      }
                      variant="secondary12"
                      symbol="USD"
                    />
                    ).
                  </>
                }
              />
              <PanelItem
                title={
                  <Box display="flex" alignItems="center">
                    Total supplied
                    <TextWithTooltip
                      event={{
                        eventName: GENERAL.TOOL_TIP,
                        eventParams: {
                          tooltip: "Total Supply",
                          asset: reserve.underlyingAsset,
                          assetName: reserve.name,
                        },
                      }}
                    >
                      <>
                        Asset supply is limited to a certain amount to reduce
                        protocol exposure to the asset and to help manage risks
                        involved.
                      </>
                    </TextWithTooltip>
                  </Box>
                }
              >
                <Box>
                  <FormattedNumber
                    value={reserve.totalLiquidity}
                    variant="main16"
                    compact
                  />
                  <Typography
                    component="span"
                    color="text.primary"
                    variant="secondary16"
                    sx={{ display: "inline-block", mx: 0.5 }}
                  >
                    of
                  </Typography>
                  <FormattedNumber value={reserve.supplyCap} variant="main16" />
                </Box>
                <Box>
                  <ReserveSubheader value={reserve.totalLiquidityUSD} />
                  <Typography
                    component="span"
                    color="text.secondary"
                    variant="secondary12"
                    sx={{ display: "inline-block", mx: 0.5 }}
                  >
                    of
                  </Typography>
                  <ReserveSubheader value={reserve.supplyCapUSD} />
                </Box>
              </PanelItem>
            </>
          ) : (
            // Without supply cap
            <PanelItem
              title={
                <Box display="flex" alignItems="center">
                  Total supplied
                </Box>
              }
            >
              <FormattedNumber
                value={reserve.totalLiquidity}
                variant="main16"
                compact
                color="text.light"
              />
              <ReserveSubheader value={reserve.totalLiquidityUSD} />
            </PanelItem>
          )}
          <PanelItem title={"APY"}>
            <FormattedNumber
              value={reserve.supplyAPY}
              percent
              variant="main16"
              color="text.light"
            />
            <IncentivesButton
              symbol={reserve.symbol}
              incentives={reserve.fmIncentivesData}
              displayBlank={true}
            />
          </PanelItem>
          {reserve.unbacked && reserve.unbacked !== "0" && (
            <PanelItem title={"Unbacked"}>
              <FormattedNumber
                value={reserve.unbacked}
                variant="main16"
                symbol={reserve.name}
                color="text.light"
              />
              <ReserveSubheader value={reserve.unbackedUSD} />
            </PanelItem>
          )}
        </Box>
        {renderCharts &&
          (reserve.borrowingEnabled || Number(reserve.totalDebt) > 0) && (
            <ApyGraphContainer
              graphKey="supply"
              reserve={reserve}
              currentMarketData={currentMarketData}
            />
          )}
        <div>
          {reserve.isIsolated ? (
            <Box sx={{ pt: "42px", pb: "12px" }}>
              <Typography
                variant="subheader1"
                color="text.light"
                paddingBottom={"12px"}
              >
                Collateral usage
              </Typography>
              <Warning severity="warning">
                <Typography variant="subheader1">
                  Asset can only be used as collateral in isolation mode only.
                </Typography>
                <Typography variant="caption">
                  In Isolation mode you cannot supply other assets as collateral
                  for borrowing. Assets used as collateral in Isolation mode can
                  only be borrowed to a specific debt ceiling.
                </Typography>
              </Warning>
            </Box>
          ) : reserve.reserveLiquidationThreshold !== "0" ? (
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
                Collateral usage
              </Typography>
              <CheckRoundedIcon
                fontSize="small"
                color="success"
                sx={{ ml: 1 }}
              />
              <Typography variant="subheader1" sx={{ color: "#46BC4B" }}>
                Can be collateral
              </Typography>
            </Box>
          ) : (
            <Box sx={{ pt: "42px", pb: "12px" }}>
              <Typography variant="subheader1" color="text.light">
                Collateral usage
              </Typography>
              <Warning sx={{ my: "12px" }} severity="warning">
                Asset cannot be used as collateral.
              </Warning>
            </Box>
          )}
        </div>
        {reserve.reserveLiquidationThreshold !== "0" && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <ReserveOverviewBox
              title={
                <MaxLTVTooltip
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                    eventParams: {
                      tooltip: "MAX LTV",
                      asset: reserve.underlyingAsset,
                      assetName: reserve.name,
                    },
                  }}
                  variant="description"
                  text={"Max LTV"}
                />
              }
            >
              <FormattedNumber
                value={reserve.formattedBaseLTVasCollateral}
                percent
                variant="secondary14"
                visibleDecimals={2}
                color="text.light"
              />
            </ReserveOverviewBox>

            <ReserveOverviewBox
              title={
                <LiquidationThresholdTooltip
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                    eventParams: {
                      tooltip: "Liquidation threshold",
                      asset: reserve.underlyingAsset,
                      assetName: reserve.name,
                    },
                  }}
                  variant="description"
                  text={"Liquidation threshold"}
                />
              }
            >
              <FormattedNumber
                value={reserve.formattedReserveLiquidationThreshold}
                percent
                variant="secondary14"
                visibleDecimals={2}
                color="text.light"
              />
            </ReserveOverviewBox>

            <ReserveOverviewBox
              title={
                <LiquidationPenaltyTooltip
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                    eventParams: {
                      tooltip: "Liquidation penalty",
                      asset: reserve.underlyingAsset,
                      assetName: reserve.name,
                    },
                  }}
                  variant="description"
                  text={"Liquidation penalty"}
                />
              }
            >
              <FormattedNumber
                value={reserve.formattedReserveLiquidationBonus}
                percent
                variant="secondary14"
                visibleDecimals={2}
                color="text.light"
              />
            </ReserveOverviewBox>

            {reserve.isIsolated && (
              <ReserveOverviewBox fullWidth>
                <DebtCeilingStatus
                  debt={reserve.isolationModeTotalDebtUSD}
                  ceiling={reserve.debtCeilingUSD}
                  usageData={debtCeiling}
                />
              </ReserveOverviewBox>
            )}
          </Box>
        )}
      </Box>
    );
  }
);
