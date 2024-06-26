import { useMediaQuery } from "@mui/material";
import { FC, memo, useMemo, useState } from "react";
import { StableAPYTooltip } from "apps/lending/components/infoTooltips/StableAPYTooltip";
import { VariableAPYTooltip } from "apps/lending/components/infoTooltips/VariableAPYTooltip";
import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListHeaderTitle } from "apps/lending/components/lists/ListHeaderTitle";
import { ListHeaderWrapper } from "apps/lending/components/lists/ListHeaderWrapper";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";

import { MarketAssetsListItem } from "apps/lending/modules/markets/MarketAssetsListItem";
import { MarketAssetsListItemLoader } from "apps/lending/modules/markets/MarketAssetsListItemLoader";
import { MarketAssetsListMobileItem } from "apps/lending/modules/markets/MarketAssetsListMobileItem";
import { MarketAssetsListMobileItemLoader } from "apps/lending/modules/markets/MarketAssetsListMobileItemLoader";
import { isFeatureEnabled } from "apps/lending/utils/marketsAndNetworksConfig";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";

const listHeaders = [
  {
    title: "Asset",
    sortKey: "symbol",
  },
  {
    title: "Total supplied",
    sortKey: "totalLiquidityUSD",
  },
  {
    title: "Supply APY",
    sortKey: "supplyAPY",
  },
  {
    title: "Total borrowed",
    sortKey: "totalDebtUSD",
  },
  {
    title: (
      <VariableAPYTooltip
        text={"Borrow APY, variable"}
        key="APY_list_variable_type"
        variant="subheader2"
      />
    ),
    sortKey: "variableBorrowAPY",
  },
  {
    title: (
      <StableAPYTooltip
        text={"Borrow APY, stable"}
        key="APY_list_stable_type"
        variant="subheader2"
      />
    ),
    sortKey: "stableBorrowAPY",
  },
];

type MarketAssetsListProps = {
  reserves: ComputedReserveData[];
  loading: boolean;
};

const MarketAssetsList: FC<MarketAssetsListProps> = ({ reserves, loading }) => {
  const isTableChangedToCards = useMediaQuery("(max-width:1125px)");
  const [sortName, setSortName] = useState<string>("");
  const [sortDesc, setSortDesc] = useState<boolean>(false);

  const { currentMarketData } = useProtocolDataContext();

  const sortedReserves = useMemo(() => {
    if (sortDesc) {
      if (sortName === "symbol") {
        return reserves.sort((a, b) =>
          a.symbol.toUpperCase() < b.symbol.toUpperCase() ? -1 : 1
        );
      } else {
        return reserves.sort(
          (a, b) => (a as any)[sortName] - (b as any)[sortName]
        );
      }
    } else {
      if (sortName === "symbol") {
        return reserves.sort((a, b) =>
          b.symbol.toUpperCase() < a.symbol.toUpperCase() ? -1 : 1
        );
      } else {
        return reserves.sort(
          (a, b) => (b as any)[sortName] - (a as any)[sortName]
        );
      }
    }
  }, [reserves, sortName, sortDesc]);

  // Show loading state when loading
  if (loading) {
    return isTableChangedToCards ? (
      <>
        <MarketAssetsListMobileItemLoader />
        <MarketAssetsListMobileItemLoader />
        <MarketAssetsListMobileItemLoader />
      </>
    ) : (
      <>
        <MarketAssetsListItemLoader />
        <MarketAssetsListItemLoader />
        <MarketAssetsListItemLoader />
        <MarketAssetsListItemLoader />
      </>
    );
  }

  // Hide list when no results, via search term or if a market has all/no frozen/unfrozen assets
  if (sortedReserves.length === 0) return null;

  return (
    <>
      {!isTableChangedToCards && (
        <ListHeaderWrapper px={3}>
          {(isFeatureEnabled.stableBorrowRate(currentMarketData)
            ? listHeaders
            : listHeaders.filter((col) => col.sortKey !== "stableBorrowAPY")
          ).map((col) => (
            <ListColumn
              isRow={col.sortKey === "symbol"}
              maxWidth={col.sortKey === "symbol" ? 280 : undefined}
              key={col.sortKey}
            >
              <ListHeaderTitle
                sortName={sortName}
                sortDesc={sortDesc}
                setSortName={setSortName}
                setSortDesc={setSortDesc}
                sortKey={col.sortKey}
                source="Markets Page"
              >
                {col.title}
              </ListHeaderTitle>
            </ListColumn>
          ))}
          <ListColumn maxWidth={95} minWidth={95} />
        </ListHeaderWrapper>
      )}

      {sortedReserves.map((reserve) =>
        isTableChangedToCards ? (
          <MarketAssetsListMobileItem {...reserve} key={reserve.id} />
        ) : (
          <MarketAssetsListItem {...reserve} key={reserve.id} />
        )
      )}
    </>
  );
};

export default memo(MarketAssetsList);
