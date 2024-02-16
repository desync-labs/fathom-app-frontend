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
    ...rest
  }) => {
    const { supplyCap, borrowCap, debtCeiling } = useAssetCaps();
    const trackEvent = useRootStore((store) => store.trackEvent);

    return (
      <ListItem {...rest}>
        <ListColumn maxWidth={DASHBOARD_LIST_COLUMN_WIDTHS.CELL} isRow>
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
            <Tooltip title={`${name} (${symbol})`} arrow placement="top">
              <Typography
                variant="subheader1"
                sx={{ ml: 3 }}
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
        </ListColumn>
        {children}
      </ListItem>
    );
  }
);
