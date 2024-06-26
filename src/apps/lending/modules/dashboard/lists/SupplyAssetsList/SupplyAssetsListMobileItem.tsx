import { Box, Button } from "@mui/material";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";

import { CapsHint } from "apps/lending/components/caps/CapsHint";
import { CapType } from "apps/lending/components/caps/helper";
import { IncentivesCard } from "apps/lending/components/incentives/IncentivesCard";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { Row } from "apps/lending/components/primitives/Row";
import { useModalContext } from "apps/lending/hooks/useModal";
import { ListItemCanBeCollateral } from "apps/lending/modules/dashboard/lists/ListItemCanBeCollateral";
import { ListMobileItemWrapper } from "apps/lending/modules/dashboard/lists/ListMobileItemWrapper";
import { ListValueRow } from "apps/lending/modules/dashboard/lists/ListValueRow";
import { FC, memo } from "react";

export const SupplyAssetsListMobileItem: FC<DashboardReserve> = memo(
  ({
    symbol,
    iconSymbol,
    name,
    walletBalance,
    walletBalanceUSD,
    supplyCap,
    totalLiquidity,
    supplyAPY,
    fmIncentivesData,
    isIsolated,
    usageAsCollateralEnabledOnUser,
    isActive,
    isFreezed,
    underlyingAsset,
    detailsAddress,
  }) => {
    const { currentMarket } = useProtocolDataContext();
    const { openSupply } = useModalContext();

    // Disable the asset to prevent it from being supplied if supply cap has been reached
    const { supplyCap: supplyCapUsage } = useAssetCaps();
    const isMaxCapReached = supplyCapUsage.isMaxed;

    const disableSupply =
      !isActive || isFreezed || Number(walletBalance) <= 0 || isMaxCapReached;

    return (
      <ListMobileItemWrapper
        symbol={symbol}
        iconSymbol={iconSymbol}
        name={name}
        underlyingAsset={detailsAddress}
        currentMarket={currentMarket}
        showDebtCeilingTooltips
      >
        <ListValueRow
          title={"Supply balance"}
          value={Number(walletBalance)}
          subValue={walletBalanceUSD}
          disabled={Number(walletBalance) === 0 || isMaxCapReached}
          capsComponent={
            <CapsHint
              capType={CapType.supplyCap}
              capAmount={supplyCap}
              totalAmount={totalLiquidity}
              withoutText
            />
          }
        />

        <Row
          caption={"Supply APY"}
          align="flex-start"
          captionVariant="description"
          captionColor={"primary.light"}
          mb={1}
        >
          <IncentivesCard
            value={Number(supplyAPY)}
            incentives={fmIncentivesData}
            symbol={symbol}
            variant="secondary14"
            color={"primary.light"}
          />
        </Row>

        <Row
          caption={"Can be collateral"}
          align="flex-start"
          captionVariant="description"
          captionColor={"primary.light"}
          mb={1}
        >
          <ListItemCanBeCollateral
            isIsolated={isIsolated}
            usageAsCollateralEnabled={usageAsCollateralEnabledOnUser}
          />
        </Row>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2.5,
          }}
        >
          <Button
            disabled={disableSupply}
            variant="gradient"
            onClick={() =>
              openSupply(underlyingAsset, currentMarket, name, "dashboard")
            }
            sx={{ mr: 0.75 }}
            fullWidth
          >
            Supply
          </Button>
          <Button
            variant="outlined"
            component={Link}
            href={ROUTES.reserveOverview(detailsAddress, currentMarket)}
            fullWidth
          >
            Details
          </Button>
        </Box>
      </ListMobileItemWrapper>
    );
  }
);
