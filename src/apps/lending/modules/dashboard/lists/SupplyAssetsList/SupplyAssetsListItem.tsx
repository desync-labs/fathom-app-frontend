import { Button } from "@mui/material";
import { NoData } from "apps/lending/components/primitives/NoData";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";
import { DASHBOARD } from "apps/lending/utils/mixPanelEvents";

import { CapsHint } from "apps/lending/components/caps/CapsHint";
import { CapType } from "apps/lending/components/caps/helper";
import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { ListAPRColumn } from "apps/lending/modules/dashboard/lists/ListAPRColumn";
import { ListButtonsColumn } from "apps/lending/modules/dashboard/lists/ListButtonsColumn";
import { ListItemCanBeCollateral } from "apps/lending/modules/dashboard/lists/ListItemCanBeCollateral";
import { ListItemWrapper } from "apps/lending/modules/dashboard/lists/ListItemWrapper";
import { ListValueColumn } from "apps/lending/modules/dashboard/lists/ListValueColumn";
import { FC, memo } from "react";

export const SupplyAssetsListItem: FC<DashboardReserve> = memo(
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
    underlyingAsset,
    isActive,
    isFreezed,
    isIsolated,
    usageAsCollateralEnabledOnUser,
    detailsAddress,
  }) => {
    const { currentMarket } = useProtocolDataContext();
    const { openSupply } = useModalContext();

    // Disable the asset to prevent it from being supplied if supply cap has been reached
    const { supplyCap: supplyCapUsage, debtCeiling } = useAssetCaps();
    const isMaxCapReached = supplyCapUsage.isMaxed;

    const trackEvent = useRootStore((store) => store.trackEvent);
    const disableSupply =
      !isActive || isFreezed || Number(walletBalance) <= 0 || isMaxCapReached;

    return (
      <ListItemWrapper
        symbol={symbol}
        iconSymbol={iconSymbol}
        name={name}
        detailsAddress={detailsAddress}
        data-cy={`dashboardSupplyListItem_${symbol.toUpperCase()}`}
        currentMarket={currentMarket}
        showDebtCeilingTooltips
        withTooltip={symbol !== "XDC"}
      >
        <ListValueColumn
          symbol={symbol}
          value={Number(walletBalance)}
          subValue={walletBalanceUSD}
          withTooltip
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

        <ListAPRColumn
          value={Number(supplyAPY)}
          incentives={fmIncentivesData}
          symbol={symbol}
        />

        <ListColumn>
          {debtCeiling.isMaxed ? (
            <NoData variant="main14" color="text.secondary" />
          ) : (
            <ListItemCanBeCollateral
              isIsolated={isIsolated}
              usageAsCollateralEnabled={usageAsCollateralEnabledOnUser}
            />
          )}
        </ListColumn>

        <ListButtonsColumn>
          <Button
            disabled={disableSupply}
            variant="gradient"
            onClick={() => {
              openSupply(underlyingAsset, currentMarket, name, "dashboard");
            }}
          >
            Supply
          </Button>
          <Button
            variant="outlined"
            component={Link}
            href={ROUTES.reserveOverview(detailsAddress, currentMarket)}
            onClick={() => {
              trackEvent(DASHBOARD.DETAILS_NAVIGATION, {
                type: "Button",
                market: currentMarket,
                assetName: name,
                asset: underlyingAsset,
              });
            }}
          >
            Details
          </Button>
        </ListButtonsColumn>
      </ListItemWrapper>
    );
  }
);
