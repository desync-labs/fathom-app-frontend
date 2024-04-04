import { Box, Button, Typography, useTheme } from "@mui/material";
import { IsolatedEnabledBadge } from "apps/lending/components/isolationMode/IsolatedBadge";
import { NoData } from "apps/lending/components/primitives/NoData";
import { ReserveSubheader } from "apps/lending/components/ReserveSubheader";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";

import { IncentivesCard } from "apps/lending/components/incentives/IncentivesCard";
import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListItem } from "apps/lending/components/lists/ListItem";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { MARKETS } from "apps/lending/utils/mixPanelEvents";
import { useNavigate } from "react-router-dom";
import { FC, memo } from "react";
import { isFeatureEnabled } from "apps/lending/utils/marketsAndNetworksConfig";

export const MarketAssetsListItem: FC<ComputedReserveData> = memo(
  ({ ...reserve }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { currentMarket, currentMarketData } = useProtocolDataContext();
    const trackEvent = useRootStore((store) => store.trackEvent);

    const showStableBorrowRate = Number(reserve.totalStableDebtUSD) > 0;
    return (
      <ListItem
        px={3}
        minHeight={76}
        onClick={() => {
          trackEvent(MARKETS.DETAILS_NAVIGATION, {
            type: "Row",
            assetName: reserve.name,
            asset: reserve.underlyingAsset,
            market: currentMarket,
          });
          navigate(
            ROUTES.reserveOverview(reserve.underlyingAsset, currentMarket)
          );
        }}
        sx={{ cursor: "pointer" }}
        button
        data-cy={`marketListItemListItem_${reserve.symbol.toUpperCase()}`}
      >
        <ListColumn isRow maxWidth={280}>
          <TokenIcon symbol={reserve.iconSymbol} fontSize="large" />
          <Box sx={{ pl: 1.75, overflow: "hidden" }}>
            <Typography variant="h4" color={theme.palette.text.primary} noWrap>
              {reserve.name}
            </Typography>

            <Box
              sx={{
                p: { xs: "0", xsm: "3.625px 0px" },
              }}
            >
              <Typography variant="subheader2" color="text.muted" noWrap>
                {reserve.symbol}
                {reserve.isIsolated && (
                  <span style={{ marginLeft: "8px" }}>
                    <IsolatedEnabledBadge />
                  </span>
                )}
              </Typography>
            </Box>
          </Box>
        </ListColumn>

        <ListColumn>
          <FormattedNumber
            compact
            value={reserve.totalLiquidity}
            variant="main16"
            color="text.light"
          />
          <ReserveSubheader value={reserve.totalLiquidityUSD} />
        </ListColumn>

        <ListColumn>
          <IncentivesCard
            value={reserve.supplyAPY}
            incentives={reserve.fmIncentivesData || []}
            symbol={reserve.symbol}
            variant="main16"
            symbolsVariant="secondary16"
            color="text.light"
          />
        </ListColumn>

        <ListColumn>
          {reserve.borrowingEnabled || Number(reserve.totalDebt) > 0 ? (
            <>
              <FormattedNumber
                compact
                value={reserve.totalDebt}
                variant="main16"
                color="text.light"
              />{" "}
              <ReserveSubheader value={reserve.totalDebtUSD} />
            </>
          ) : (
            <NoData variant={"secondary14"} color="text.secondary" />
          )}
        </ListColumn>

        <ListColumn>
          <IncentivesCard
            value={
              Number(reserve.totalVariableDebtUSD) > 0
                ? reserve.variableBorrowAPY
                : "-1"
            }
            incentives={reserve.vIncentivesData || []}
            symbol={reserve.symbol}
            variant="main16"
            symbolsVariant="secondary16"
            color="text.light"
          />
          {!reserve.borrowingEnabled &&
            Number(reserve.totalVariableDebt) > 0 &&
            !reserve.isFrozen && <ReserveSubheader value={"Disabled"} />}
        </ListColumn>

        {isFeatureEnabled.stableBorrowRate(currentMarketData) ? (
          <ListColumn>
            <IncentivesCard
              value={showStableBorrowRate ? reserve.stableBorrowAPY : "-1"}
              incentives={reserve.sIncentivesData || []}
              symbol={reserve.symbol}
              variant="main16"
              symbolsVariant="secondary16"
              color="text.light"
            />
            {!reserve.borrowingEnabled &&
              Number(reserve.totalStableDebt) > 0 &&
              !reserve.isFrozen && <ReserveSubheader value={"Disabled"} />}
          </ListColumn>
        ) : null}

        <ListColumn minWidth={95} maxWidth={95} align="right">
          <Button
            variant="outlined"
            component={Link}
            href={ROUTES.reserveOverview(
              reserve.underlyingAsset,
              currentMarket
            )}
            onClick={() =>
              trackEvent(MARKETS.DETAILS_NAVIGATION, {
                type: "Button",
                assetName: reserve.name,
                asset: reserve.underlyingAsset,
                market: currentMarket,
              })
            }
          >
            Details
          </Button>
        </ListColumn>
      </ListItem>
    );
  }
);
