import { API_ETH_MOCK_ADDRESS } from "@into-the-fathom/lending-contract-helpers";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, Fragment, useCallback, useMemo, useState } from "react";
import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListHeaderTitle } from "apps/lending/components/lists/ListHeaderTitle";
import { ListHeaderWrapper } from "apps/lending/components/lists/ListHeaderWrapper";
import { AssetCapsProvider } from "apps/lending/hooks/useAssetCaps";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { fetchIconSymbolAndName } from "apps/lending/ui-config/reservePatches";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { CollateralSwitchTooltip } from "apps/lending/components/infoTooltips/CollateralSwitchTooltip";
import { CollateralTooltip } from "apps/lending/components/infoTooltips/CollateralTooltip";
import { TotalSupplyAPYTooltip } from "apps/lending/components/infoTooltips/TotalSupplyAPYTooltip";
import { ListWrapper } from "apps/lending/components/lists/ListWrapper";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import {
  DASHBOARD_LIST_COLUMN_WIDTHS,
  DashboardReserve,
  handleSortDashboardReserves,
} from "apps/lending/utils/dashboardSortUtils";
import { ListTopInfoItem } from "apps/lending/modules/dashboard/lists/ListTopInfoItem";
import { DashboardContentNoData } from "apps/lending/modules/dashboard/DashboardContentNoData";
import { ListButtonsColumn } from "apps/lending/modules/dashboard/lists/ListButtonsColumn";
import { ListLoader } from "apps/lending/modules/dashboard/lists/ListLoader";
import { SuppliedPositionsListItem } from "apps/lending/modules/dashboard/lists/SuppliedPositionsList/SuppliedPositionsListItem";
import { SuppliedPositionsListMobileItem } from "apps/lending/modules/dashboard/lists/SuppliedPositionsList/SuppliedPositionsListMobileItem";

const head = [
  {
    title: "Asset",
    sortKey: "symbol",
  },
  {
    title: "Balance",
    sortKey: "underlyingBalance",
  },

  {
    title: "APY",
    sortKey: "supplyAPY",
  },
  {
    title: (
      <CollateralSwitchTooltip
        event={{
          eventName: GENERAL.TOOL_TIP,
          eventParams: { tooltip: "Collateral Switch" },
        }}
        text={"Collateral"}
        key="Collateral"
        variant="subheader2"
      />
    ),
    sortKey: "usageAsCollateralEnabledOnUser",
  },
];

export const SuppliedPositionsList = () => {
  const { user, loading } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down("xsm"));
  const [sortName, setSortName] = useState<string>("");
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const suppliedPositions = useMemo(
    () =>
      user?.userReservesData
        .filter((userReserve) => userReserve.underlyingBalance !== "0")
        .map((userReserve) => ({
          ...userReserve,
          supplyAPY: userReserve.reserve.supplyAPY, // Note: added only for table sort
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
        })) || [],
    [user?.userReservesData]
  );
  // Transform to the DashboardReserve schema so the sort utils can work with it
  const preSortedReserves = suppliedPositions as DashboardReserve[];
  const sortedReserves = handleSortDashboardReserves(
    sortDesc,
    sortName,
    "position",
    preSortedReserves
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
              source="Supplied Positions Dashboard"
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
      <ListLoader title={"Your supplies"} head={head.map((col) => col.title)} />
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
          Your supplies
        </Typography>
      }
      localStorageName="suppliedAssetsDashboardTableCollapse"
      noData={!sortedReserves.length}
      topInfo={
        <>
          {!!sortedReserves.length && (
            <>
              <ListTopInfoItem
                title={"Balance"}
                value={user?.totalLiquidityUSD || 0}
              />
              <ListTopInfoItem
                title={"APY"}
                value={user?.earnedAPY || 0}
                percent
                tooltip={
                  <TotalSupplyAPYTooltip
                    setOpen={setTooltipOpen}
                    event={{
                      eventName: GENERAL.TOOL_TIP,
                      eventParams: { tooltip: "Total Supplied APY" },
                    }}
                  />
                }
              />
              <ListTopInfoItem
                title={"Collateral"}
                value={user?.totalCollateralUSD || 0}
                tooltip={
                  <CollateralTooltip
                    setOpen={setTooltipOpen}
                    event={{
                      eventName: GENERAL.TOOL_TIP,
                      eventParams: { tooltip: "Total Supplied Collateral" },
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
            <Fragment key={item.underlyingAsset}>
              <AssetCapsProvider asset={item.reserve}>
                {downToXSM ? (
                  <SuppliedPositionsListMobileItem {...item} />
                ) : (
                  <SuppliedPositionsListItem {...item} />
                )}
              </AssetCapsProvider>
            </Fragment>
          ))}
        </>
      ) : (
        <DashboardContentNoData text={"Nothing supplied yet."} />
      )}
    </ListWrapper>
  );
};
