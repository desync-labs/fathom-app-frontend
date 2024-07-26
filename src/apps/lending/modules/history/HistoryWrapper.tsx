import {
  Box,
  Button,
  CircularProgress,
  Paper,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SimCardDownloadOutlinedIcon from "@mui/icons-material/SimCardDownloadOutlined";
import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { ConnectWalletPaper } from "apps/lending/components/ConnectWalletPaper";
import { ListWrapper } from "apps/lending/components/lists/ListWrapper";
import { SearchInput } from "apps/lending/components/SearchInput";
import {
  applyTxHistoryFilters,
  useTransactionHistory,
} from "apps/lending/hooks/useTransactionHistory";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { useRootStore } from "apps/lending/store/root";
import { TRANSACTION_HISTORY } from "apps/lending/utils/mixPanelEvents";

import {
  downloadData,
  formatTransactionData,
  groupByDate,
} from "apps/lending/modules/history/helpers";
import { HistoryFilterMenu } from "apps/lending/modules/history/HistoryFilterMenu";
import { HistoryItemLoader } from "apps/lending/modules/history/HistoryItemLoader";
import { HistoryWrapperMobile } from "apps/lending/modules/history/HistoryWrapperMobile";
import TransactionRowItem from "apps/lending/modules/history/TransactionRowItem";
import {
  FilterOptions,
  TransactionHistoryItemUnion,
} from "apps/lending/modules/history/types";

const HistoryWrapper = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState<FilterOptions[]>([]);
  const [searchResetKey, setSearchResetKey] = useState<number>(0);

  const isFilterActive = searchQuery.length > 0 || filterQuery.length > 0;
  const trackEvent = useRootStore((store) => store.trackEvent);

  const {
    data: transactions,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    fetchForDownload,
    subgraphUrl,
  } = useTransactionHistory({ isFilterActive });

  const handleJsonDownload = async () => {
    trackEvent(TRANSACTION_HISTORY.DOWNLOAD, { type: "JSON" });
    setLoadingDownload(true);
    const data = await fetchForDownload({ searchQuery, filterQuery });
    const formattedData = formatTransactionData({ data, csv: false });
    const jsonData = JSON.stringify(formattedData, null, 2);
    downloadData("transactions.json", jsonData, "application/json");
    setLoadingDownload(false);
  };

  const handleCsvDownload = async () => {
    trackEvent(TRANSACTION_HISTORY.DOWNLOAD, { type: "CSV" });

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
  const theme = useTheme();
  const downToMD = useMediaQuery(theme.breakpoints.down("md"));
  const { currentAccount, loading: web3Loading } = useWeb3Context();

  const flatTxns = useMemo(
    () => transactions?.pages?.flatMap((page) => page) || [],
    [transactions]
  );
  const filteredTxns = useMemo(
    () => applyTxHistoryFilters({ searchQuery, filterQuery, txns: flatTxns }),
    [searchQuery, filterQuery, flatTxns]
  );

  if (!subgraphUrl) {
    return (
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          p: 2,
          flex: 1,
        }}
      >
        <Typography variant={downToMD ? "h4" : "h3"}>
          Transaction history is not currently available for this market
        </Typography>
      </Paper>
    );
  }

  if (!currentAccount) {
    return (
      <ConnectWalletPaper
        loading={web3Loading}
        description={"Please connect your wallet to view transaction history."}
      />
    );
  }

  if (downToMD) {
    return <HistoryWrapperMobile />;
  }

  const isEmpty = filteredTxns.length === 0;
  const filterActive = searchQuery !== "" || filterQuery.length > 0;

  return (
    <ListWrapper titleComponent={null}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mx: 4,
          mt: 3,
          mb: 4,
        }}
      >
        <Box sx={{ display: "inline-flex" }}>
          <HistoryFilterMenu
            onFilterChange={setFilterQuery}
            currentFilter={filterQuery}
          />
          <SearchInput
            onSearchTermChange={setSearchQuery}
            placeholder="Search assets..."
            wrapperSx={{ width: "280px" }}
            key={searchResetKey}
          />
        </Box>
        <Box
          sx={{ display: "flex", alignItems: "center", height: 36, gap: 0.5 }}
        >
          {loadingDownload && (
            <CircularProgress size={16} sx={{ mr: 1 }} color="inherit" />
          )}
          <Box
            sx={{
              cursor: "pointer",
              color: "primary",
              height: "auto",
              width: "auto",
              display: "flex",
              alignItems: "center",
              mr: 3,
            }}
            onClick={handleCsvDownload}
          >
            <SvgIcon sx={{ color: "text.light" }}>
              <SimCardDownloadOutlinedIcon width={22} height={22} />
            </SvgIcon>
            <Typography variant="buttonM" color="text.light">
              .CSV
            </Typography>
          </Box>
          <Box
            sx={{
              cursor: "pointer",
              color: "primary",
              height: "auto",
              width: "auto",
              display: "flex",
              alignItems: "center",
            }}
            onClick={handleJsonDownload}
          >
            <SvgIcon sx={{ color: "text.light" }}>
              <SimCardDownloadOutlinedIcon width={22} height={22} />
            </SvgIcon>
            <Typography variant="buttonM" color="text.light">
              .JSON
            </Typography>
          </Box>
        </Box>
      </Box>

      {isLoading ? (
        <>
          <HistoryItemLoader />
          <HistoryItemLoader />
        </>
      ) : !isEmpty ? (
        Object.entries(groupByDate(filteredTxns)).map(
          ([date, txns], groupIndex) => (
            <Fragment key={groupIndex}>
              <Typography
                variant="h4"
                color="text.light"
                sx={{ ml: 4.5, mt: 1.5, mb: 1 }}
              >
                {date}
              </Typography>
              {txns.map(
                (transaction: TransactionHistoryItemUnion, index: number) => {
                  const isLastItem = index === txns.length - 1;
                  return (
                    // @ts-ignore
                    <div ref={isLastItem ? lastElementRef : null} key={index}>
                      <TransactionRowItem
                        transaction={transaction as TransactionHistoryItemUnion}
                      />
                    </div>
                  );
                }
              )}
            </Fragment>
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
            p: 2,
            flex: 1,
            maxWidth: "468px",
            margin: "0 auto",
            my: 12,
          }}
        >
          <Typography variant="h3" color="text.light">
            Nothing found
          </Typography>
          <Typography
            sx={{ mt: 0.5, mb: 2 }}
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
            p: 2,
            flex: 1,
          }}
        >
          <Typography sx={{ my: 12 }} variant="h3" color="text.light">
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

export default HistoryWrapper;
