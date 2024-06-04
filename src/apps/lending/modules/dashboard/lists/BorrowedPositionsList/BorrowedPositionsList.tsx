import {
  API_ETH_MOCK_ADDRESS,
  InterestRate,
} from "@into-the-fathom/lending-contract-helpers";
import { valueToBigNumber } from "@into-the-fathom/lending-math-utils";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListHeaderTitle } from "apps/lending/components/lists/ListHeaderTitle";
import { ListHeaderWrapper } from "apps/lending/components/lists/ListHeaderWrapper";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { fetchIconSymbolAndName } from "apps/lending/ui-config/reservePatches";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { APYTypeTooltip } from "apps/lending/components/infoTooltips/APYTypeTooltip";
import { BorrowPowerTooltip } from "apps/lending/components/infoTooltips/BorrowPowerTooltip";
import { TotalBorrowAPYTooltip } from "apps/lending/components/infoTooltips/TotalBorrowAPYTooltip";
import { ListWrapper } from "apps/lending/components/lists/ListWrapper";
import {
  ComputedUserReserveData,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import {
  DASHBOARD_LIST_COLUMN_WIDTHS,
  DashboardReserve,
  handleSortDashboardReserves,
} from "apps/lending/utils/dashboardSortUtils";
import { DashboardContentNoData } from "apps/lending/modules/dashboard/DashboardContentNoData";
import { DashboardEModeButton } from "apps/lending/modules/dashboard/DashboardEModeButton";
import { ListButtonsColumn } from "apps/lending/modules/dashboard/lists/ListButtonsColumn";
import { ListLoader } from "apps/lending/modules/dashboard/lists/ListLoader";
import { ListTopInfoItem } from "apps/lending/modules/dashboard/lists/ListTopInfoItem";
import { BorrowedPositionsListItemWrapper } from "apps/lending/modules/dashboard/lists/BorrowedPositionsList/BorrowedPositionsListItemWrapper";

const head = [
  {
    title: "Asset",
    sortKey: "symbol",
  },
  {
    title: "Debt",
    sortKey: "variableBorrows",
  },
  {
    title: "APY",
    sortKey: "borrowAPY",
  },
  {
    title: (
      <APYTypeTooltip
        event={{
          eventName: GENERAL.TOOL_TIP,
          eventParams: { tooltip: "APY Type Borrow" },
        }}
        text={"APY type"}
        key="APY type"
        variant="subheader2"
      />
    ),
    sortKey: "typeAPY",
  },
];

export const BorrowedPositionsList = () => {
  const { user, loading, eModes } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();
  const [sortName, setSortName] = useState<string>("");
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down("xsm"));

  const showEModeButton = Object.keys(eModes).length > 1;
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const borrowPositions = useMemo(
    () =>
      user?.userReservesData.reduce((acc, userReserve) => {
        if (userReserve.variableBorrows !== "0") {
          acc.push({
            ...userReserve,
            borrowRateMode: InterestRate.Variable,
            reserve: {
              ...userReserve.reserve,
              ...(userReserve.reserve.isWrappedBaseAsset
                ? fetchIconSymbolAndName({
                    name: userReserve.reserve.name,
                    symbol: currentNetworkConfig.baseAssetSymbol,
                    underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
                  })
                : {}),
            },
          });
        }
        if (userReserve.stableBorrows !== "0") {
          acc.push({
            ...userReserve,
            borrowRateMode: InterestRate.Stable,
            reserve: {
              ...userReserve.reserve,
              ...(userReserve.reserve.isWrappedBaseAsset
                ? fetchIconSymbolAndName({
                    name: userReserve.reserve.name,
                    symbol: currentNetworkConfig.baseAssetSymbol,
                    underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
                  })
                : {}),
            },
          });
        }
        return acc;
      }, [] as (ComputedUserReserveData & { borrowRateMode: InterestRate })[]) ||
      [],
    [user?.userReservesData]
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

  // Transform to the DashboardReserve schema so the sort utils can work with it
  const preSortedReserves = borrowPositions as DashboardReserve[];
  const sortedReserves = handleSortDashboardReserves(
    sortDesc,
    sortName,
    "position",
    preSortedReserves,
    true
  );

  const RenderHeader: FC = useCallback(() => {
    return (
      <ListHeaderWrapper>
        {head.map((col) => (
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
              source="Borrowed Positions Dashboard"
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
      <ListLoader title={"Your borrows"} head={head.map((c) => c.title)} />
    );

  return (
    <ListWrapper
      tooltipOpen={tooltipOpen}
      titleComponent={
        <Typography
          component="div"
          variant="h3"
          sx={{ mr: 2 }}
          color={theme.palette.text.primary}
        >
          Your borrows
        </Typography>
      }
      localStorageName="borrowedAssetsDashboardTableCollapse"
      subTitleComponent={
        showEModeButton ? (
          <DashboardEModeButton
            userEmodeCategoryId={user.userEmodeCategoryId}
          />
        ) : undefined
      }
      noData={!sortedReserves.length}
      topInfo={
        <>
          {!!sortedReserves.length && (
            <>
              <ListTopInfoItem
                title={"Balance"}
                value={user?.totalBorrowsUSD || 0}
              />
              <ListTopInfoItem
                title={"APY"}
                value={user?.debtAPY || 0}
                percent
                tooltip={
                  <TotalBorrowAPYTooltip
                    setOpen={setTooltipOpen}
                    event={{
                      eventName: GENERAL.TOOL_TIP,
                      eventParams: { tooltip: "Total Borrowed APY" },
                    }}
                  />
                }
              />
              <ListTopInfoItem
                title={"Borrow power used"}
                value={collateralUsagePercent || 0}
                percent
                tooltip={
                  <BorrowPowerTooltip
                    setOpen={setTooltipOpen}
                    event={{
                      eventName: GENERAL.TOOL_TIP,
                      eventParams: { tooltip: "Borrow power used" },
                    }}
                  />
                }
              />
            </>
          )}
        </>
      }
    >
      {sortedReserves.length ? (
        <>
          {!downToXSM && <RenderHeader />}
          {sortedReserves.map((item) => (
            <BorrowedPositionsListItemWrapper
              item={item}
              key={item.underlyingAsset + item.borrowRateMode}
            />
          ))}
        </>
      ) : (
        <DashboardContentNoData text={"Nothing borrowed yet."} />
      )}
    </ListWrapper>
  );
};
