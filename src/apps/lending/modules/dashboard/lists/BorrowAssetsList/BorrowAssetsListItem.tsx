import { Button } from "@mui/material";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";
import { DASHBOARD } from "apps/lending/utils/mixPanelEvents";

import { CapsHint } from "apps/lending/components/caps/CapsHint";
import { CapType } from "apps/lending/components/caps/helper";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { ListAPRColumn } from "apps/lending/modules/dashboard/lists/ListAPRColumn";
import { ListButtonsColumn } from "apps/lending/modules/dashboard/lists/ListButtonsColumn";
import { ListItemWrapper } from "apps/lending/modules/dashboard/lists/ListItemWrapper";
import { ListValueColumn } from "apps/lending/modules/dashboard/lists/ListValueColumn";
import { FC, memo } from "react";
import { isFeatureEnabled } from "apps/lending/utils/marketsAndNetworksConfig";

export const BorrowAssetsListItem: FC<DashboardReserve> = memo(
  ({
    symbol,
    iconSymbol,
    name,
    availableBorrows,
    availableBorrowsInUSD,
    borrowCap,
    totalBorrows,
    variableBorrowRate,
    stableBorrowRate,
    sIncentivesData,
    vIncentivesData,
    underlyingAsset,
    isFreezed,
  }) => {
    const { openBorrow } = useModalContext();
    const { currentMarket, currentMarketData } = useProtocolDataContext();

    const disableBorrow = isFreezed || Number(availableBorrows) <= 0;

    const trackEvent = useRootStore((store) => store.trackEvent);

    return (
      <ListItemWrapper
        symbol={symbol}
        iconSymbol={iconSymbol}
        name={name}
        detailsAddress={underlyingAsset}
        data-cy={`dashboardBorrowListItem_${symbol.toUpperCase()}`}
        currentMarket={currentMarket}
      >
        <ListValueColumn
          symbol={symbol}
          value={Number(availableBorrows)}
          subValue={Number(availableBorrowsInUSD)}
          disabled={Number(availableBorrows) === 0}
          withTooltip
          capsComponent={
            <CapsHint
              capType={CapType.borrowCap}
              capAmount={borrowCap}
              totalAmount={totalBorrows}
              withoutText
            />
          }
        />
        <ListAPRColumn
          value={Number(variableBorrowRate)}
          incentives={vIncentivesData}
          symbol={symbol}
        />
        {isFeatureEnabled.stableBorrowRate(currentMarketData) ? (
          <ListAPRColumn
            value={Number(stableBorrowRate)}
            incentives={sIncentivesData}
            symbol={symbol}
          />
        ) : null}

        <ListButtonsColumn>
          <Button
            disabled={disableBorrow}
            variant="gradient"
            onClick={() => {
              openBorrow(underlyingAsset, currentMarket, name, "dashboard");
            }}
          >
            Borrow
          </Button>
          <Button
            variant="outlined"
            component={Link}
            href={ROUTES.reserveOverview(underlyingAsset, currentMarket)}
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
