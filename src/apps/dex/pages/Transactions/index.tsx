import { memo, FC } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";
import { FormattedTransaction } from "apps/dex/components/Transactions/Transaction";
import BasePageContainer from "components/Base/PageContainer";
import BasePageHeader from "components/Base/PageHeader";
import {
  BaseTableCell,
  BaseTableContainer,
  BaseTableHeaderRow,
} from "components/Base/Table/StyledTable";
import {
  BaseAccordion,
  BaseAccordionTxGroupDate,
  BaseAccordionTxGroupDetails,
  BaseAccordionTxGroupSummary,
} from "components/Base/Accordion/StyledAccordion";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { dexGroupByDate } from "utils/Dex/dexGroupByDate";
import DexTransactionListItem from "apps/dex/pages/Transactions/DexTransactionListItem";
import DexTransactionListFilters from "apps/dex/pages/Transactions/DexTransactionListFilters";
import { DexTransactionListLoader } from "apps/dex/pages/Transactions/DexTransactionListLoader";
import useDexTransactionList from "apps/dex/hooks/useDexTransactionList";

const Transactions: FC = () => {
  const {
    loading,
    filterActive,
    filterByType,
    searchValue,
    setSearchValue,
    handleFilterByType,
    mergedTransactions,
    setFilterByType,
  } = useDexTransactionList();

  return (
    <BasePageContainer sx={{ mt: 0, padding: 0 }}>
      <BasePageHeader title={"Transaction history"} />
      <DexTransactionListFilters
        filterByType={filterByType}
        handleFilterByType={handleFilterByType}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <BaseTableContainer>
        <Table aria-label="pools table">
          <TableHead>
            <BaseTableHeaderRow>
              <BaseTableCell>Date</BaseTableCell>
            </BaseTableHeaderRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <>
                <DexTransactionListLoader />
                <DexTransactionListLoader txAmount={3} />
              </>
            ) : (
              <>
                {filterActive &&
                  mergedTransactions &&
                  !mergedTransactions.length && (
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
                        We couldn&apos;t find any transactions related to your
                        search. Try again with a different asset name, or reset
                        filters.
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setFilterByType("ALL");
                          setSearchValue("");
                        }}
                      >
                        Reset Filters
                      </Button>
                    </Box>
                  )}
                {mergedTransactions && mergedTransactions.length > 0 && (
                  <>
                    {Object.entries(dexGroupByDate(mergedTransactions)).map(
                      ([date, txns], groupIndex) => (
                        <BaseAccordion
                          key={groupIndex}
                          defaultExpanded={groupIndex < 3}
                        >
                          <BaseAccordionTxGroupSummary
                            expandIcon={
                              <KeyboardArrowDownRoundedIcon
                                sx={{ color: "#fff" }}
                              />
                            }
                            aria-controls={`panel${groupIndex}-content`}
                            id={`panel${groupIndex}-header`}
                          >
                            <BaseAccordionTxGroupDate>
                              {date}
                            </BaseAccordionTxGroupDate>
                          </BaseAccordionTxGroupSummary>
                          <BaseAccordionTxGroupDetails>
                            {txns.map((transaction: FormattedTransaction) => {
                              return (
                                <DexTransactionListItem
                                  key={transaction.hash}
                                  transaction={transaction}
                                />
                              );
                            })}
                          </BaseAccordionTxGroupDetails>
                        </BaseAccordion>
                      )
                    )}
                  </>
                )}
                {mergedTransactions &&
                !mergedTransactions.length &&
                !filterActive ? (
                  <Typography
                    sx={{ my: 12 }}
                    textAlign={"center"}
                    variant="h3"
                    color="text.light"
                  >
                    No transactions yet.
                  </Typography>
                ) : null}
              </>
            )}
          </TableBody>
        </Table>
      </BaseTableContainer>
    </BasePageContainer>
  );
};

export default memo(Transactions);
