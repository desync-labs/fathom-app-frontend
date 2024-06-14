import { Tooltip, Typography } from "@mui/material";
import { FC, memo, ReactNode } from "react";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { useRootStore } from "apps/lending/store/root";
import { CustomMarket } from "apps/lending/ui-config/marketsConfig";
import { DASHBOARD_LIST_COLUMN_WIDTHS } from "apps/lending/utils/dashboardSortUtils";
import { DASHBOARD } from "apps/lending/utils/mixPanelEvents";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListItem } from "apps/lending/components/lists/ListItem";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";
import { FrozenTooltip } from "apps/lending/components/infoTooltips/FrozenTooltip";
import { BorrowDisabledToolTip } from "apps/lending/components/infoTooltips/BorrowDisabledToolTip";

interface ListItemWrapperProps {
  symbol: string;
  iconSymbol: string;
  name: string;
  detailsAddress: string;
  children: ReactNode;
  currentMarket: CustomMarket;
  showSupplyCapTooltips?: boolean;
  showBorrowCapTooltips?: boolean;
  showDebtCeilingTooltips?: boolean;
  withTooltip?: boolean;
  frozen?: boolean;
  borrowEnabled?: boolean;
}

export const ListItemWrapper: FC<ListItemWrapperProps> = memo(
  ({
    symbol,
    iconSymbol,
    children,
    name,
    detailsAddress,
    currentMarket,
    showSupplyCapTooltips = false,
    showBorrowCapTooltips = false,
    showDebtCeilingTooltips = false,
    withTooltip = true,
    frozen,
    borrowEnabled = true,
    ...rest
  }) => {
    const { supplyCap, borrowCap, debtCeiling } = useAssetCaps();
    const showFrozenTooltip =
      frozen && symbol !== "renFIL" && symbol !== "BUSD";
    const showBorrowDisabledTooltip = !frozen && !borrowEnabled;
    const trackEvent = useRootStore((store) => store.trackEvent);

    return (
      <ListItem {...rest}>
        <ListColumn
          minWidth={100}
          maxWidth={DASHBOARD_LIST_COLUMN_WIDTHS.CELL}
          isRow
        >
          <Link
            onClick={() =>
              trackEvent(DASHBOARD.DETAILS_NAVIGATION, {
                type: "Row click",
                market: currentMarket,
                assetName: name,
                asset: detailsAddress,
              })
            }
            href={ROUTES.reserveOverview(detailsAddress, currentMarket)}
            noWrap
            sx={{ display: "inline-flex", alignItems: "center" }}
          >
            <TokenIcon symbol={iconSymbol} fontSize="large" />
            <Tooltip
              title={withTooltip ? `${name} (${symbol})` : name}
              arrow
              placement="top"
            >
              <Typography
                variant="subheader1"
                sx={{ ml: 1.5, color: "text.primary" }}
                noWrap
                data-cy={`assetName`}
              >
                {symbol}
              </Typography>
            </Tooltip>
          </Link>
          {showSupplyCapTooltips &&
            supplyCap.displayMaxedTooltip({ supplyCap })}
          {showBorrowCapTooltips &&
            borrowCap.displayMaxedTooltip({ borrowCap })}
          {showDebtCeilingTooltips &&
            debtCeiling.displayMaxedTooltip({ debtCeiling })}

          {showFrozenTooltip && <FrozenTooltip />}
          {showBorrowDisabledTooltip && <BorrowDisabledToolTip />}
          {showSupplyCapTooltips &&
            supplyCap.displayMaxedTooltip({ supplyCap })}
          {showBorrowCapTooltips &&
            borrowCap.displayMaxedTooltip({ borrowCap })}
          {showDebtCeilingTooltips &&
            debtCeiling.displayMaxedTooltip({ debtCeiling })}
        </ListColumn>
        {children}
      </ListItem>
    );
  }
);
