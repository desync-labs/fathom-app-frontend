import { Button } from "@mui/material";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { useModalContext } from "apps/lending/hooks/useModal";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { ListAPRColumn } from "apps/lending/modules/dashboard/lists/ListAPRColumn";
import { ListButtonsColumn } from "apps/lending/modules/dashboard/lists/ListButtonsColumn";
import { ListItemUsedAsCollateral } from "apps/lending/modules/dashboard/lists/ListItemUsedAsCollateral";
import { ListItemWrapper } from "apps/lending/modules/dashboard/lists/ListItemWrapper";
import { ListValueColumn } from "apps/lending/modules/dashboard/lists/ListValueColumn";
import { FC, memo } from "react";

export const SuppliedPositionsListItem: FC<DashboardReserve> = memo(
  ({
    reserve,
    underlyingBalance,
    underlyingBalanceUSD,
    usageAsCollateralEnabledOnUser,
    underlyingAsset,
  }) => {
    const { user } = useAppDataContext();
    const { isIsolated, aIncentivesData, isFrozen, isActive } = reserve;
    const { currentMarket } = useProtocolDataContext();
    const { openSupply, openWithdraw, openCollateralChange } =
      useModalContext();
    const { debtCeiling } = useAssetCaps();

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
      <ListItemWrapper
        symbol={reserve.symbol}
        iconSymbol={reserve.iconSymbol}
        name={reserve.name}
        detailsAddress={underlyingAsset}
        currentMarket={currentMarket}
        data-cy={`dashboardSuppliedListItem_${reserve.symbol.toUpperCase()}_${
          canBeEnabledAsCollateral && usageAsCollateralEnabledOnUser
            ? "Collateral"
            : "NoCollateral"
        }`}
        showSupplyCapTooltips
        showDebtCeilingTooltips
      >
        <ListValueColumn
          symbol={reserve.iconSymbol}
          value={Number(underlyingBalance)}
          subValue={Number(underlyingBalanceUSD)}
          disabled={Number(underlyingBalance) === 0}
        />

        <ListAPRColumn
          value={Number(reserve.supplyAPY)}
          incentives={aIncentivesData}
          symbol={reserve.symbol}
        />

        <ListColumn>
          <ListItemUsedAsCollateral
            isIsolated={isIsolated}
            usageAsCollateralEnabledOnUser={usageAsCollateralEnabledOnUser}
            canBeEnabledAsCollateral={canBeEnabledAsCollateral}
            onToggleSwitch={() => {
              openCollateralChange(
                underlyingAsset,
                currentMarket,
                reserve.name,
                "dashboard",
                usageAsCollateralEnabledOnUser
              );
            }}
            data-cy={`collateralStatus`}
          />
        </ListColumn>

        <ListButtonsColumn>
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
          >
            Supply
          </Button>
          <Button
            disabled={disableWithdraw}
            variant="outlined"
            onClick={() => {
              openWithdraw(
                underlyingAsset,
                currentMarket,
                reserve.name,
                "dashboard"
              );
            }}
          >
            Withdraw
          </Button>
        </ListButtonsColumn>
      </ListItemWrapper>
    );
  }
);
