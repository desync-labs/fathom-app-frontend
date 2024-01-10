import { Trans } from "@lingui/macro";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { BUSDOffBoardingTooltip } from "apps/lending/components/infoTooltips/BUSDOffboardingToolTip";
import { RenFILToolTip } from "apps/lending/components/infoTooltips/RenFILToolTip";
import { IsolatedEnabledBadge } from "apps/lending/components/isolationMode/IsolatedBadge";
import { NoData } from "apps/lending/components/primitives/NoData";
import { ReserveSubheader } from "apps/lending/components/ReserveSubheader";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";
import { CustomMarket } from "apps/lending/ui-config/marketsConfig";

import { IncentivesCard } from "apps/lending/components/incentives/IncentivesCard";
import { AMPLToolTip } from "apps/lending/components/infoTooltips/AMPLToolTip";
import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListItem } from "apps/lending/components/lists/ListItem";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { MARKETS } from "apps/lending/utils/mixPanelEvents";
import { useNavigate } from "react-router-dom";

export const MarketAssetsListItem = ({ ...reserve }: ComputedReserveData) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentMarket } = useProtocolDataContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  let showStableBorrowRate = Number(reserve.totalStableDebtUSD) > 0;
  if (
    currentMarket === CustomMarket.proto_mainnet_v3 &&
    reserve.symbol === "TUSD"
  ) {
    showStableBorrowRate = false;
  }
  return (
    <ListItem
      px={6}
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
        <Box sx={{ pl: 3.5, overflow: "hidden" }}>
          <Typography variant="h4" color={theme.palette.primary.main} noWrap>
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
        {reserve.symbol === "AMPL" && <AMPLToolTip />}
        {reserve.symbol === "renFIL" && <RenFILToolTip />}
        {reserve.symbol === "BUSD" && <BUSDOffBoardingTooltip />}
      </ListColumn>

      <ListColumn>
        <FormattedNumber
          compact
          value={reserve.totalLiquidity}
          variant="main16"
        />
        <ReserveSubheader value={reserve.totalLiquidityUSD} />
      </ListColumn>

      <ListColumn>
        <IncentivesCard
          value={reserve.supplyAPY}
          incentives={reserve.aIncentivesData || []}
          symbol={reserve.symbol}
          variant="main16"
          symbolsVariant="secondary16"
        />
      </ListColumn>

      <ListColumn>
        {reserve.borrowingEnabled || Number(reserve.totalDebt) > 0 ? (
          <>
            <FormattedNumber
              compact
              value={reserve.totalDebt}
              variant="main16"
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
        />
        {!reserve.borrowingEnabled &&
          Number(reserve.totalVariableDebt) > 0 &&
          !reserve.isFrozen && <ReserveSubheader value={"Disabled"} />}
      </ListColumn>

      <ListColumn>
        <IncentivesCard
          value={showStableBorrowRate ? reserve.stableBorrowAPY : "-1"}
          incentives={reserve.sIncentivesData || []}
          symbol={reserve.symbol}
          variant="main16"
          symbolsVariant="secondary16"
        />
        {!reserve.borrowingEnabled &&
          Number(reserve.totalStableDebt) > 0 &&
          !reserve.isFrozen && <ReserveSubheader value={"Disabled"} />}
      </ListColumn>

      <ListColumn minWidth={95} maxWidth={95} align="right">
        <Button
          variant="outlined"
          component={Link}
          href={ROUTES.reserveOverview(reserve.underlyingAsset, currentMarket)}
          onClick={() =>
            trackEvent(MARKETS.DETAILS_NAVIGATION, {
              type: "Button",
              assetName: reserve.name,
              asset: reserve.underlyingAsset,
              market: currentMarket,
            })
          }
        >
          <Trans>Details</Trans>
        </Button>
      </ListColumn>
    </ListItem>
  );
};
