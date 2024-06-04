import { Box, Divider, Skeleton, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { IsolatedEnabledBadge } from "apps/lending/components/isolationMode/IsolatedBadge";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { CustomMarket } from "apps/lending/ui-config/marketsConfig";

import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";

interface ListMobileItemProps {
  warningComponent?: ReactNode;
  children: ReactNode;
  symbol?: string;
  iconSymbol?: string;
  name?: string;
  underlyingAsset?: string;
  loading?: boolean;
  currentMarket?: CustomMarket;
  showSupplyCapTooltips?: boolean;
  showBorrowCapTooltips?: boolean;
  showDebtCeilingTooltips?: boolean;
  isIsolated: boolean;
}

export const ListMobileItem: FC<ListMobileItemProps> = ({
  children,
  warningComponent,
  symbol,
  iconSymbol,
  name,
  underlyingAsset,
  loading,
  currentMarket,
  showSupplyCapTooltips = false,
  showBorrowCapTooltips = false,
  showDebtCeilingTooltips = false,
  isIsolated,
}) => {
  const { supplyCap, borrowCap, debtCeiling } = useAssetCaps();
  return (
    <Box>
      <Divider />
      <Box sx={{ px: 2, pt: 2, pb: 3 }}>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          {loading ? (
            <Box sx={{ display: "inline-flex", alignItems: "center" }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ ml: 1 }}>
                <Skeleton width={100} height={24} />
              </Box>
            </Box>
          ) : (
            symbol &&
            underlyingAsset &&
            name &&
            currentMarket &&
            iconSymbol && (
              <Link
                href={ROUTES.reserveOverview(underlyingAsset, currentMarket)}
                sx={{ display: "inline-flex", alignItems: "center" }}
              >
                <TokenIcon symbol={iconSymbol} sx={{ fontSize: "40px" }} />
                <Box sx={{ ml: 1 }}>
                  <Typography variant="h4" color="text.primary">
                    {name}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="subheader2" color="text.muted">
                      {symbol}
                    </Typography>
                    {isIsolated && (
                      <span style={{ marginLeft: "8px" }}>
                        <IsolatedEnabledBadge />
                      </span>
                    )}
                  </Box>
                </Box>
                {showSupplyCapTooltips &&
                  supplyCap.displayMaxedTooltip({ supplyCap })}
                {showBorrowCapTooltips &&
                  borrowCap.displayMaxedTooltip({ borrowCap })}
                {showDebtCeilingTooltips &&
                  debtCeiling.displayMaxedTooltip({ debtCeiling })}
              </Link>
            )
          )}
          {warningComponent}
        </Box>
        {children}
      </Box>
    </Box>
  );
};
