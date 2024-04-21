import { Box, Button } from "@mui/material";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";

import { IncentivesCard } from "apps/lending/components/incentives/IncentivesCard";
import { Row } from "apps/lending/components/primitives/Row";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { ListItemUsedAsCollateral } from "apps/lending/modules/dashboard/lists/ListItemUsedAsCollateral";
import { ListMobileItemWrapper } from "apps/lending/modules/dashboard/lists/ListMobileItemWrapper";
import { ListValueRow } from "apps/lending/modules/dashboard/lists/ListValueRow";
import { FC, memo } from "react";

export const SuppliedPositionsListMobileItem: FC<DashboardReserve> = memo(
  ({
    reserve,
    underlyingBalance,
    underlyingBalanceUSD,
    usageAsCollateralEnabledOnUser,
    underlyingAsset,
  }) => {
    const { user } = useAppDataContext();
    const { currentMarket } = useProtocolDataContext();
    const { openSupply, openWithdraw, openCollateralChange } =
      useModalContext();
    const { debtCeiling } = useAssetCaps();
    const {
      symbol,
      iconSymbol,
      name,
      supplyAPY,
      isIsolated,
      fmIncentivesData,
      isFrozen,
      isActive,
    } = reserve;

    const canBeEnabledAsCollateral =
      !debtCeiling.isMaxed &&
      reserve.reserveLiquidationThreshold !== "0" &&
      ((!reserve.isIsolated && !user.isInIsolationMode) ||
        user.isolatedReserve?.underlyingAsset === reserve.underlyingAsset ||
        (reserve.isIsolated &&
          user.totalCollateralMarketReferenceCurrency === "0"));

    const disableWithdraw = !isActive;
    const disableSupply = !isActive || isFrozen;

    return (
      <ListMobileItemWrapper
        symbol={symbol}
        iconSymbol={iconSymbol}
        name={name}
        underlyingAsset={underlyingAsset}
        currentMarket={currentMarket}
        showSupplyCapTooltips
        showDebtCeilingTooltips
      >
        <ListValueRow
          title={"Supply balance"}
          value={Number(underlyingBalance)}
          subValue={Number(underlyingBalanceUSD)}
          disabled={Number(underlyingBalance) === 0}
        />

        <Row
          caption={"Supply APY"}
          align="flex-start"
          captionVariant="description"
          captionColor="text.light"
          mb={1}
        >
          <IncentivesCard
            value={Number(supplyAPY)}
            incentives={fmIncentivesData}
            symbol={symbol}
            variant="secondary14"
            color="text.light"
          />
        </Row>

        <Row
          caption={"Used as collateral"}
          align={isIsolated ? "flex-start" : "center"}
          captionVariant="description"
          captionColor="text.light"
          mb={1}
        >
          <ListItemUsedAsCollateral
            isIsolated={isIsolated}
            usageAsCollateralEnabledOnUser={usageAsCollateralEnabledOnUser}
            canBeEnabledAsCollateral={canBeEnabledAsCollateral}
            onToggleSwitch={() =>
              openCollateralChange(
                underlyingAsset,
                currentMarket,
                reserve.name,
                "dashboard",
                usageAsCollateralEnabledOnUser
              )
            }
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
              openSupply(
                underlyingAsset,
                currentMarket,
                reserve.name,
                "dashboard"
              )
            }
            sx={{ mr: 0.75 }}
            fullWidth
          >
            Supply
          </Button>
          <Button
            disabled={disableWithdraw}
            variant="outlined"
            onClick={() =>
              openWithdraw(
                underlyingAsset,
                currentMarket,
                reserve.name,
                "dashboard"
              )
            }
            sx={{ mr: 0.75 }}
            fullWidth
          >
            Withdraw
          </Button>
        </Box>
      </ListMobileItemWrapper>
    );
  }
);
