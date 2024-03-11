import { API_ETH_MOCK_ADDRESS } from "@into-the-fathom/lending-contract-helpers";
import {
  Box,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useMemo } from "react";
import { ListWrapper } from "apps/lending/components/lists/ListWrapper";
import { NoSearchResults } from "apps/lending/components/NoSearchResults";
import { Warning } from "apps/lending/components/primitives/Warning";
import { TitleWithSearchBar } from "apps/lending/components/TitleWithSearchBar";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import MarketAssetsList from "apps/lending/modules/markets/MarketAssetsList";
import { fetchIconSymbolAndName } from "apps/lending/ui-config/reservePatches";

export const MarketAssetsListContainer = () => {
  const { reserves, loading } = useAppDataContext();
  const { currentMarketData, currentNetworkConfig } = useProtocolDataContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));

  const filteredData = useMemo(
    () =>
      reserves
        // Filter out any non-active reserves
        .filter((res) => res.isActive)
        // Filter out all GHO, as we deliberately display it on supported markets
        // filter out any that don't meet search term criteria
        .filter((res) => {
          if (!searchTerm) return true;
          const term = searchTerm.toLowerCase().trim();
          return (
            res.symbol.toLowerCase().includes(term) ||
            res.name.toLowerCase().includes(term) ||
            res.underlyingAsset.toLowerCase().includes(term)
          );
        })
        // Transform the object for list to consume it
        .map((reserve) => ({
          ...reserve,
          ...(reserve.isWrappedBaseAsset
            ? fetchIconSymbolAndName({
                name: reserve.name,
                symbol: currentNetworkConfig.baseAssetSymbol,
                underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
              })
            : {}),
        })),
    [searchTerm, reserves]
  );
  const unfrozenReserves = filteredData.filter(
    (r) => !r.isFrozen && !r.isPaused
  );
  const [showFrozenMarketsToggle, setShowFrozenMarketsToggle] =
    useState<boolean>(false);

  const handleChange = () => {
    setShowFrozenMarketsToggle((prevState) => !prevState);
  };

  const frozenOrPausedReserves = filteredData.filter(
    (r) => r.isFrozen || r.isPaused
  );

  return (
    <ListWrapper
      titleComponent={
        <TitleWithSearchBar
          onSearchTermChange={setSearchTerm}
          title={<>{currentMarketData.marketTitle} assets</>}
          searchPlaceholder={
            sm ? "Search asset" : "Search asset name, symbol, or address"
          }
        />
      }
    >
      {/* Unfrozen assets list */}
      <MarketAssetsList reserves={unfrozenReserves} loading={loading} />

      {/* Frozen or paused assets list */}
      {frozenOrPausedReserves.length > 0 && (
        <Box sx={{ mt: 5, px: { xs: 2, xsm: 3 } }}>
          <Typography variant="h4" mb={2}>
            Show Frozen or paused assets
            <Switch
              checked={showFrozenMarketsToggle}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Typography>
          {showFrozenMarketsToggle && (
            <Warning severity="info">
              These assets are temporarily frozen or paused by Fathom lending
              community decisions, meaning that further supply / borrow, or rate
              swap of these assets are unavailable. Withdrawals and debt
              repayments are allowed.
            </Warning>
          )}
        </Box>
      )}
      {showFrozenMarketsToggle && (
        <MarketAssetsList reserves={frozenOrPausedReserves} loading={loading} />
      )}

      {/* Show no search results message if nothing hits in either list */}
      {!loading && filteredData.length === 0 && (
        <NoSearchResults
          searchTerm={searchTerm}
          subtitle={
            <>
              We couldn&apos;t find any assets related to your search. Try again
              with a different asset name, symbol, or address.
            </>
          }
        />
      )}
    </ListWrapper>
  );
};
