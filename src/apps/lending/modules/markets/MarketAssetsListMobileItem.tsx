import { Box, Button, Divider } from "@mui/material";
import { StableAPYTooltip } from "apps/lending/components/infoTooltips/StableAPYTooltip";
import { VariableAPYTooltip } from "apps/lending/components/infoTooltips/VariableAPYTooltip";
import { NoData } from "apps/lending/components/primitives/NoData";
import { ReserveSubheader } from "apps/lending/components/ReserveSubheader";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";
import { MARKETS } from "apps/lending/utils/mixPanelEvents";

import { IncentivesCard } from "apps/lending/components/incentives/IncentivesCard";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { Row } from "apps/lending/components/primitives/Row";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { ListMobileItemWrapper } from "apps/lending/modules/dashboard/lists/ListMobileItemWrapper";
import { FC, memo } from "react";
import { isFeatureEnabled } from "apps/lending/utils/marketsAndNetworksConfig";

export const MarketAssetsListMobileItem: FC<ComputedReserveData> = memo(
  ({ ...reserve }) => {
    const { currentMarket, currentMarketData } = useProtocolDataContext();
    const trackEvent = useRootStore((store) => store.trackEvent);

    const showStableBorrowRate = Number(reserve.totalStableDebtUSD) > 0;

    return (
      <ListMobileItemWrapper
        symbol={reserve.symbol}
        iconSymbol={reserve.iconSymbol}
        name={reserve.name}
        underlyingAsset={reserve.underlyingAsset}
        currentMarket={currentMarket}
        isIsolated={reserve.isIsolated}
      >
        <Row
          caption={"Total supplied"}
          captionVariant="description"
          captionColor="text.light"
          mb={1.5}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-end" },
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <FormattedNumber
              compact
              value={reserve.totalLiquidity}
              variant="secondary14"
              color="text.light"
            />
            <ReserveSubheader
              value={reserve.totalLiquidityUSD}
              rightAlign={true}
            />
          </Box>
        </Row>
        <Row
          caption={"Supply APY"}
          captionVariant="description"
          captionColor="text.light"
          mb={1.5}
          align="flex-start"
        >
          <IncentivesCard
            align="flex-end"
            value={reserve.supplyAPY}
            incentives={reserve.fmIncentivesData || []}
            symbol={reserve.symbol}
            variant="secondary14"
            color="text.light"
          />
        </Row>

        <Divider sx={{ mb: 1.5 }} />

        <Row
          caption={"Total borrowed"}
          captionVariant="description"
          captionColor="text.light"
          mb={1.5}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-end" },
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {Number(reserve.totalDebt) > 0 ? (
              <>
                <FormattedNumber
                  compact
                  value={reserve.totalDebt}
                  variant="secondary14"
                  color="text.light"
                />
                <ReserveSubheader
                  value={reserve.totalDebtUSD}
                  rightAlign={true}
                />
              </>
            ) : (
              <NoData variant={"secondary14"} color="text.secondary" />
            )}
          </Box>
        </Row>
        <Row
          caption={
            <VariableAPYTooltip
              text={"Borrow APY, variable"}
              key="APY_list_mob_variable_type"
              variant="description"
            />
          }
          captionVariant="description"
          captionColor="text.light"
          mb={1.5}
          align="flex-start"
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <IncentivesCard
              align="flex-end"
              value={
                Number(reserve.totalVariableDebtUSD) > 0
                  ? reserve.variableBorrowAPY
                  : "-1"
              }
              incentives={reserve.vIncentivesData || []}
              symbol={reserve.symbol}
              variant="secondary14"
              color="text.light"
            />
            {!reserve.borrowingEnabled &&
              Number(reserve.totalVariableDebt) > 0 &&
              !reserve.isFrozen && <ReserveSubheader value={"Disabled"} />}
          </Box>
        </Row>
        {isFeatureEnabled.stableBorrowRate(currentMarketData) ? (
          <Row
            caption={
              <StableAPYTooltip
                text={"Borrow APY, stable"}
                key="APY_list_mob_stable_type"
                variant="description"
              />
            }
            captionVariant="description"
            captionColor="text.light"
            mb={2}
            align="flex-start"
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <IncentivesCard
                align="flex-end"
                value={showStableBorrowRate ? reserve.stableBorrowAPY : "-1"}
                incentives={reserve.sIncentivesData || []}
                symbol={reserve.symbol}
                variant="secondary14"
                color="text.light"
              />
              {!reserve.borrowingEnabled &&
                Number(reserve.totalStableDebt) > 0 &&
                !reserve.isFrozen && <ReserveSubheader value={"Disabled"} />}
            </Box>
          </Row>
        ) : null}

        <Button
          variant="outlined"
          component={Link}
          href={ROUTES.reserveOverview(reserve.underlyingAsset, currentMarket)}
          fullWidth
          onClick={() => {
            trackEvent(MARKETS.DETAILS_NAVIGATION, {
              type: "button",
              asset: reserve.underlyingAsset,
              market: currentMarket,
              assetName: reserve.name,
            });
          }}
        >
          View details
        </Button>
      </ListMobileItemWrapper>
    );
  }
);
