import { Button } from "@mui/material";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useRootStore } from "apps/lending/store/root";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { isFeatureEnabled } from "apps/lending/utils/marketsAndNetworksConfig";
import { ListAPRColumn } from "apps/lending/modules/dashboard/lists/ListAPRColumn";
import { ListButtonsColumn } from "apps/lending/modules/dashboard/lists/ListButtonsColumn";
import { ListItemUsedAsCollateral } from "apps/lending/modules/dashboard/lists/ListItemUsedAsCollateral";
import { ListItemWrapper } from "apps/lending/modules/dashboard/lists/ListItemWrapper";
import { ListValueColumn } from "apps/lending/modules/dashboard/lists/ListValueColumn";

export const SuppliedPositionsListItem = ({
  reserve,
  underlyingBalance,
  underlyingBalanceUSD,
  usageAsCollateralEnabledOnUser,
  underlyingAsset,
}: DashboardReserve) => {
  const { user } = useAppDataContext();
  const { isIsolated, fmIncentivesData, isFrozen, isActive } = reserve;
  const { currentMarketData, currentMarket } = useProtocolDataContext();
  const { openSupply, openWithdraw, openCollateralChange, openSwap } =
    useModalContext();
  const { debtCeiling } = useAssetCaps();
  const isSwapButton = isFeatureEnabled.liquiditySwap(currentMarketData);
  const trackEvent = useRootStore((store) => store.trackEvent);

  const canBeEnabledAsCollateral =
    !debtCeiling.isMaxed &&
    reserve.reserveLiquidationThreshold !== "0" &&
    ((!reserve.isIsolated && !user.isInIsolationMode) ||
      user.isolatedReserve?.underlyingAsset === reserve.underlyingAsset ||
      (reserve.isIsolated &&
        user.totalCollateralMarketReferenceCurrency === "0"));

  const disableSwap = !isActive || reserve.symbol == "stETH";
  const disableWithdraw = !isActive;
  const disableSupply = !isActive || isFrozen;

  return (
    <ListItemWrapper
      symbol={reserve.symbol}
      iconSymbol={reserve.iconSymbol}
      name={reserve.name}
      detailsAddress={underlyingAsset}
      currentMarket={currentMarket}
      frozen={reserve.isFrozen}
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
        incentives={fmIncentivesData}
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
        {isSwapButton ? (
          <Button
            disabled={disableSwap}
            variant="gradient"
            onClick={() => {
              // track

              trackEvent(GENERAL.OPEN_MODAL, {
                modal: "Swap Collateral",
                market: currentMarket,
                assetName: reserve.name,
                asset: underlyingAsset,
              });
              openSwap(underlyingAsset);
            }}
            data-cy={`swapButton`}
          >
            <>Switch</>
          </Button>
        ) : (
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
            <>Supply</>
          </Button>
        )}
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
          <>Withdraw</>
        </Button>
      </ListButtonsColumn>
    </ListItemWrapper>
  );
};
