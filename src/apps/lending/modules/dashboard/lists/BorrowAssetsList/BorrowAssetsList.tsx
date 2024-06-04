import {
  API_ETH_MOCK_ADDRESS,
  InterestRate,
} from "@into-the-fathom/lending-contract-helpers";
import {
  USD_DECIMALS,
  valueToBigNumber,
} from "@into-the-fathom/lending-math-utils";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, Fragment, useCallback, useMemo, useState } from "react";
import { StableAPYTooltip } from "apps/lending/components/infoTooltips/StableAPYTooltip";
import { VariableAPYTooltip } from "apps/lending/components/infoTooltips/VariableAPYTooltip";
import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListHeaderTitle } from "apps/lending/components/lists/ListHeaderTitle";
import { ListHeaderWrapper } from "apps/lending/components/lists/ListHeaderWrapper";
import { Warning } from "apps/lending/components/primitives/Warning";
import { AssetCapsProvider } from "apps/lending/hooks/useAssetCaps";
import { fetchIconSymbolAndName } from "apps/lending/ui-config/reservePatches";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { CapType } from "apps/lending/components/caps/helper";
import { AvailableTooltip } from "apps/lending/components/infoTooltips/AvailableTooltip";
import { ListWrapper } from "apps/lending/components/lists/ListWrapper";
import {
  ComputedReserveData,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import {
  DASHBOARD_LIST_COLUMN_WIDTHS,
  DashboardReserve,
  handleSortDashboardReserves,
} from "apps/lending/utils/dashboardSortUtils";
import {
  assetCanBeBorrowedByUser,
  getMaxAmountAvailableToBorrow,
} from "apps/lending/utils/getMaxAmountAvailableToBorrow";
import { ListButtonsColumn } from "apps/lending/modules/dashboard/lists/ListButtonsColumn";
import { ListLoader } from "apps/lending/modules/dashboard/lists/ListLoader";
import { BorrowAssetsListItem } from "apps/lending/modules/dashboard/lists/BorrowAssetsList/BorrowAssetsListItem";
import { BorrowAssetsListMobileItem } from "apps/lending/modules/dashboard/lists/BorrowAssetsList/BorrowAssetsListMobileItem";
import { isFeatureEnabled } from "apps/lending/utils/marketsAndNetworksConfig";

const head = [
  {
    title: "Asset",
    sortKey: "symbol",
  },
  {
    title: (
      <AvailableTooltip
        event={{
          eventName: GENERAL.TOOL_TIP,
          eventParams: { tooltip: "Available to borrow" },
        }}
        capType={CapType.borrowCap}
        text={"Available"}
        key="availableBorrows"
        variant="subheader2"
      />
    ),
    sortKey: "availableBorrows",
  },

  {
    title: (
      <VariableAPYTooltip
        event={{
          eventName: GENERAL.TOOL_TIP,
          eventParams: { tooltip: "Variable Borrow APY" },
        }}
        text={"APY, variable"}
        key="variableBorrowAPY"
        variant="subheader2"
      />
    ),
    sortKey: "variableBorrowAPY",
  },
  {
    title: (
      <StableAPYTooltip
        event={{
          eventName: GENERAL.TOOL_TIP,
          eventParams: { tooltip: "Stable Borrow APY" },
        }}
        text={"APY, stable"}
        key="stableBorrowAPY"
        variant="subheader2"
      />
    ),
    sortKey: "stableBorrowAPY",
  },
];

export const BorrowAssetsList = () => {
  const { currentNetworkConfig, currentMarketData } = useProtocolDataContext();
  const { user, reserves, marketReferencePriceInUsd, loading } =
    useAppDataContext();
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down("xsm"));
  const [sortName, setSortName] = useState<string>("");
  const [sortDesc, setSortDesc] = useState<boolean>(false);

  const { baseAssetSymbol } = currentNetworkConfig;

  const tokensToBorrow = useMemo(
    () =>
      reserves
        .filter((reserve) => assetCanBeBorrowedByUser(reserve, user))
        .map((reserve: ComputedReserveData) => {
          const availableBorrows = user
            ? Number(
                getMaxAmountAvailableToBorrow(
                  reserve,
                  user,
                  InterestRate.Variable
                )
              )
            : 0;

          const availableBorrowsInUSD = valueToBigNumber(availableBorrows)
            .multipliedBy(reserve.formattedPriceInMarketReferenceCurrency)
            .multipliedBy(marketReferencePriceInUsd)
            .shiftedBy(-USD_DECIMALS)
            .toFixed(2);

          return {
            ...reserve,
            reserve,
            totalBorrows: reserve.totalDebt,
            availableBorrows,
            availableBorrowsInUSD,
            stableBorrowRate:
              reserve.stableBorrowRateEnabled && reserve.borrowingEnabled
                ? Number(reserve.stableBorrowAPY)
                : -1,
            variableBorrowRate: reserve.borrowingEnabled
              ? Number(reserve.variableBorrowAPY)
              : -1,
            iconSymbol: reserve.iconSymbol,
            ...(reserve.isWrappedBaseAsset
              ? fetchIconSymbolAndName({
                  name: reserve.name,
                  symbol: baseAssetSymbol,
                  underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
                })
              : {}),
          };
        }),
    [reserves, user, marketReferencePriceInUsd, baseAssetSymbol]
  );

  const collateralUsagePercent = useMemo(() => {
    const maxBorrowAmount = valueToBigNumber(
      user?.totalBorrowsMarketReferenceCurrency || "0"
    ).plus(user?.availableBorrowsMarketReferenceCurrency || "0");
    return maxBorrowAmount.eq(0)
      ? "0"
      : valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || "0")
          .div(maxBorrowAmount)
          .toFixed();
  }, [
    user?.totalBorrowsMarketReferenceCurrency,
    user?.availableBorrowsMarketReferenceCurrency,
  ]);

  const sortedReserves = handleSortDashboardReserves(
    sortDesc,
    sortName,
    "asset",
    tokensToBorrow as unknown as DashboardReserve[]
  );
  const borrowDisabled = !sortedReserves.length;

  const RenderHeader: FC = useCallback(() => {
    return (
      <ListHeaderWrapper>
        {(isFeatureEnabled.stableBorrowRate(currentMarketData)
          ? head
          : head.filter((item) => item.sortKey !== "stableBorrowAPY")
        ).map((col) => (
          <ListColumn
            isRow={col.sortKey === "symbol"}
            maxWidth={
              col.sortKey === "symbol"
                ? DASHBOARD_LIST_COLUMN_WIDTHS.ASSET
                : undefined
            }
            key={col.sortKey}
          >
            <ListHeaderTitle
              sortName={sortName}
              sortDesc={sortDesc}
              setSortName={setSortName}
              setSortDesc={setSortDesc}
              sortKey={col.sortKey}
              source={"Borrow Dashboard"}
            >
              {col.title}
            </ListHeaderTitle>
          </ListColumn>
        ))}
        <ListButtonsColumn isColumnHeader />
      </ListHeaderWrapper>
    );
  }, [sortName, sortDesc, setSortName, setSortDesc]);

  if (loading)
    return (
      <ListLoader
        title={"Assets to borrow"}
        head={head.map((col) => col.title)}
        withTopMargin
      />
    );

  return (
    <ListWrapper
      titleComponent={
        <Typography
          component="div"
          variant="h3"
          sx={{ mr: 2 }}
          color={theme.palette.text.primary}
        >
          Assets to borrow
        </Typography>
      }
      localStorageName="borrowAssetsDashboardTableCollapse"
      withTopMargin
      noData={borrowDisabled}
      subChildrenComponent={
        <>
          <Box sx={{ px: 3, mb: 2 }}>
            {+collateralUsagePercent >= 0.98 && (
              <Warning severity="error">
                Be careful - You are very close to liquidation. <br />
                Consider depositing more collateral or paying down some of your
                borrowed positions.
              </Warning>
            )}

            {!borrowDisabled && (
              <>
                {user?.isInIsolationMode && (
                  <Warning severity="warning">
                    Borrowing power and assets are limited due to Isolation
                    mode.
                  </Warning>
                )}
                {user?.isInEmode && (
                  <Warning severity="warning">
                    In E-Mode some assets are not borrowable. Exit E-Mode to get
                    access to all assets.
                  </Warning>
                )}
                {user?.totalCollateralMarketReferenceCurrency === "0" && (
                  <Warning severity="info">
                    To borrow you need to supply any asset to be used as
                    collateral.
                  </Warning>
                )}
              </>
            )}
          </Box>
        </>
      }
    >
      <>
        {!downToXSM && !!sortedReserves.length && <RenderHeader />}
        {sortedReserves?.map((item) => (
          <Fragment key={item.underlyingAsset}>
            <AssetCapsProvider asset={item.reserve}>
              {downToXSM ? (
                <BorrowAssetsListMobileItem {...item} />
              ) : (
                <BorrowAssetsListItem {...item} />
              )}
            </AssetCapsProvider>
          </Fragment>
        ))}
      </>
    </ListWrapper>
  );
};
