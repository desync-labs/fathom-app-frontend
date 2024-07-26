import {
  Box,
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SimCardDownloadOutlinedIcon from "@mui/icons-material/SimCardDownloadOutlined";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ListWrapper } from "apps/lending/components/lists/ListWrapper";
import { SearchInput } from "apps/lending/components/SearchInput";
import {
  applyTxHistoryFilters,
  useTransactionHistory,
} from "apps/lending/hooks/useTransactionHistory";

import {
  downloadData,
  formatTransactionData,
  groupByDate,
} from "apps/lending/modules/history/helpers";
import { HistoryFilterMenu } from "apps/lending/modules/history/HistoryFilterMenu";
import { HistoryMobileItemLoader } from "apps/lending/modules/history/HistoryMobileItemLoader";
import TransactionMobileRowItem from "apps/lending/modules/history/TransactionMobileRowItem";
import {
  FilterOptions,
  TransactionHistoryItemUnion,
} from "apps/lending/modules/history/types";

export const HistoryWrapperMobile = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [filterQuery, setFilterQuery] = useState<FilterOptions[]>([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [searchResetKey, setSearchResetKey] = useState(0);

  const handleDownloadMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleCancelClick = () => {
    setShowSearchBar(false);
    setSearchQuery("");
  };

  // Create ref to exclude search box from click handler below
  const searchBarRef = useRef<HTMLElement | null>(null);

  // Close search bar if it's open, has a blank query, and the clicked item is not the search box
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node)
    ) {
      if (searchQuery === "" && showSearchBar) {
        handleCancelClick();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchQuery, showSearchBar]);

  const isFilterActive = searchQuery.length > 0 || filterQuery.length > 0;

  const {
    data: transactions,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    fetchForDownload,
  } = useTransactionHistory({ isFilterActive });

  const handleJsonDownload = async () => {
    setLoadingDownload(true);
    const data = await fetchForDownload({ searchQuery, filterQuery });
    const formattedData = formatTransactionData({ data, csv: false });
    const jsonData = JSON.stringify(formattedData, null, 2);
    downloadData("transactions.json", jsonData, "application/json");
    setLoadingDownload(false);
  };

  const handleCsvDownload = async () => {
    setLoadingDownload(true);
    const data: TransactionHistoryItemUnion[] = await fetchForDownload({
      searchQuery,
      filterQuery,
    });
    const formattedData = formatTransactionData({ data, csv: true });

    // Getting all the unique headers
    const headersSet = new Set<string>();
    formattedData.forEach((transaction: TransactionHistoryItemUnion) => {
      Object.keys(transaction).forEach((key) => headersSet.add(key));
    });

    const headers: string[] = Array.from(headersSet);
    let csvContent = headers.join(",") + "\n";

    formattedData.forEach((transaction: TransactionHistoryItemUnion) => {
      const row: string[] = headers.map((header) => {
        const value = transaction[header as keyof TransactionHistoryItemUnion];
        if (typeof value === "object") {
          return JSON.stringify(value) ?? "";
        }
        return String(value) ?? "";
      });
      csvContent += row.join(",") + "\n";
    });

    downloadData("transactions.csv", csvContent, "text/csv");
    setLoadingDownload(false);
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: Element) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, isLoading]
  );

  const flatTxns = useMemo(
    () => transactions?.pages?.flatMap((page) => page) || [],
    [transactions]
  );
  const filteredTxns = useMemo(
    () => applyTxHistoryFilters({ searchQuery, filterQuery, txns: flatTxns }),
    [searchQuery, filterQuery, flatTxns]
  );
  const isEmpty = filteredTxns.length === 0;
  const filterActive = searchQuery !== "" || filterQuery.length > 0;

  return (
    <ListWrapper
      wrapperSx={showSearchBar ? { px: 2 } : undefined}
      titleComponent={
        <Box
          ref={searchBarRef}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          {!showSearchBar && (
            <Typography
              component="div"
              variant="h2"
              color="text.light"
              sx={{ mr: 2, height: "36px" }}
            >
              Transactions
            </Typography>
          )}
          {!showSearchBar && (
            <Box sx={{ display: "flex", gap: "22px" }}>
              {loadingDownload && (
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
              )}
              <Box onClick={handleDownloadMenuClick} sx={{ cursor: "pointer" }}>
                <SvgIcon sx={{ color: "#c5d7f2" }}>
                  <SimCardDownloadOutlinedIcon width={20} height={20} />
                </SvgIcon>
              </Box>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleDownloadMenuClose}
              >
                <Typography
                  variant="subheader2"
                  color="text.secondary"
                  sx={{ mx: 2, my: 1.5 }}
                >
                  Export data to
                </Typography>
                <MenuItem
                  onClick={() => {
                    handleJsonDownload();
                    handleDownloadMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <SvgIcon sx={{ color: "#c5d7f2" }}>
                      <SimCardDownloadOutlinedIcon width={22} height={22} />
                    </SvgIcon>
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ variant: "subheader1" }}
                  >
                    .JSON
                  </ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCsvDownload();
                    handleDownloadMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <SvgIcon sx={{ color: "#c5d7f2" }}>
                      <SimCardDownloadOutlinedIcon width={22} height={22} />
                    </SvgIcon>
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ variant: "subheader1" }}
                  >
                    .CSV
                  </ListItemText>
                </MenuItem>
              </Menu>
              <Box onClick={() => setShowSearchBar(true)}>
                <SvgIcon sx={{ color: "#c5d7f2", cursor: "pointer" }}>
                  <SearchIcon width={20} height={20} />
                </SvgIcon>
              </Box>
            </Box>
          )}
          {showSearchBar && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                px: 0,
              }}
            >
              <SearchInput
                wrapperSx={{
                  width: "320px",
                }}
                placeholder="Search assets..."
                onSearchTermChange={setSearchQuery}
                key={searchResetKey}
              />
              <Button onClick={() => handleCancelClick()}>
                <Typography variant="buttonM">Cancel</Typography>
              </Button>
            </Box>
          )}
        </Box>
      }
    >
      <HistoryFilterMenu
        onFilterChange={setFilterQuery}
        currentFilter={filterQuery}
      />

      {isLoading ? (
        <>
          <HistoryMobileItemLoader />
          <HistoryMobileItemLoader />
        </>
      ) : !isEmpty ? (
        Object.entries(groupByDate(filteredTxns)).map(
          ([date, txns], groupIndex) => (
            <React.Fragment key={groupIndex}>
              <Typography
                variant="h4"
                color="text.primary"
                sx={{ ml: 2, mt: 1, mb: 1 }}
              >
                {date}
              </Typography>
              {txns.map(
                (transaction: TransactionHistoryItemUnion, index: number) => {
                  const isLastItem = index === txns.length - 1;
                  return (
                    // @ts-ignore
                    <div ref={isLastItem ? lastElementRef : null} key={index}>
                      <TransactionMobileRowItem
                        transaction={transaction as TransactionHistoryItemUnion}
                      />
                    </div>
                  );
                }
              )}
            </React.Fragment>
          )
        )
      ) : filterActive ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            flex: 1,
            maxWidth: "468px",
            margin: "0 auto",
            my: 12,
          }}
        >
          <Typography variant="h3" color="text.primary">
            Nothing found
          </Typography>
          <Typography
            sx={{ mt: 1, mb: 2 }}
            variant="description"
            color="text.secondary"
          >
            We couldn&apos;t find any transactions related to your search. Try
            again with a different asset name, or reset filters.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchQuery("");
              setFilterQuery([]);
              setSearchResetKey((prevKey) => prevKey + 1); // Remount SearchInput component to clear search query
            }}
          >
            Reset Filters
          </Button>
        </Box>
      ) : !isFetchingNextPage ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            p: 4,
            flex: 1,
          }}
        >
          <Typography sx={{ my: 12 }} variant="h3" color="text.primary">
            No transactions yet.
          </Typography>
        </Box>
      ) : (
        <></>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: isFetchingNextPage ? 3 : 0,
          mt: 5,
        }}
      >
        {isFetchingNextPage && (
          <Box
            sx={{
              height: 36,
              width: 186,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={20} style={{ color: "#383D51" }} />
          </Box>
        )}
      </Box>
    </ListWrapper>
  );
};
