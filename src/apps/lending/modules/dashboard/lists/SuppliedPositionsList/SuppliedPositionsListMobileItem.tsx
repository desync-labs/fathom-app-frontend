import { Box, Button } from "@mui/material";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";

import { IncentivesCard } from "apps/lending/components/incentives/IncentivesCard";
import { Row } from "apps/lending/components/primitives/Row";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { isFeatureEnabled } from "apps/lending/utils/marketsAndNetworksConfig";
import { ListItemUsedAsCollateral } from "apps/lending/modules/dashboard/lists/ListItemUsedAsCollateral";
import { ListMobileItemWrapper } from "apps/lending/modules/dashboard/lists/ListMobileItemWrapper";
import { ListValueRow } from "apps/lending/modules/dashboard/lists/ListValueRow";

export const SuppliedPositionsListMobileItem = ({
  reserve,
  underlyingBalance,
  underlyingBalanceUSD,
  usageAsCollateralEnabledOnUser,
  underlyingAsset,
}: DashboardReserve) => {
  const { user } = useAppDataContext();
  const { currentMarketData, currentMarket } = useProtocolDataContext();
  const { openSupply, openSwap, openWithdraw, openCollateralChange } =
    useModalContext();
  const { debtCeiling } = useAssetCaps();
  const isSwapButton = isFeatureEnabled.liquiditySwap(currentMarketData);
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

  const disableSwap = !isActive || reserve.symbol == "stETH";
  const disableWithdraw = !isActive;
  const disableSupply = !isActive || isFrozen;

  return (
    <ListMobileItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      underlyingAsset={underlyingAsset}
      currentMarket={currentMarket}
      frozen={reserve.isFrozen}
      showSupplyCapTooltips
      showDebtCeilingTooltips
    >
      <ListValueRow
        title={<>Supply balance</>}
        value={Number(underlyingBalance)}
        subValue={Number(underlyingBalanceUSD)}
        disabled={Number(underlyingBalance) === 0}
      />

      <Row
        caption={<>Supply APY</>}
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <IncentivesCard
          value={Number(supplyAPY)}
          incentives={fmIncentivesData}
          symbol={symbol}
          variant="secondary14"
        />
      </Row>

      <Row
        caption={<>Used as collateral</>}
        align={isIsolated ? "flex-start" : "center"}
        captionVariant="description"
        mb={2}
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
          mt: 5,
        }}
      >
        {isSwapButton ? (
          <Button
            disabled={disableSwap}
            variant="gradient"
            onClick={() => openSwap(underlyingAsset)}
            fullWidth
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
            sx={{ mr: 1.5 }}
            fullWidth
          >
            <>Supply</>
          </Button>
        )}
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
          sx={{ mr: 1.5 }}
          fullWidth
        >
          <>Withdraw</>
        </Button>
      </Box>
    </ListMobileItemWrapper>
  );
};
