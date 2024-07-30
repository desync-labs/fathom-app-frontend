import {
  Box,
  Button,
  Table,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import usePositionsTransactionList, {
  IFxdTransaction,
} from "hooks/Pools/usePositionsTransactionList";
import { fxdActivitiesGroupByDate } from "utils/Fxd/fxdActivitiesGroupByDate";
import PositionActivityFilters from "components/PositionActivityList/PositionActivityFilters";
import PositionActivityListItem from "components/PositionActivityList/PositionActivityListItem";
import { PositionActivityListLoader } from "components/PositionActivityList/PositionActivityListLoader";
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

const PositionActivityList = () => {
  const {
    fxdActivities,
    filterByType,
    handleFilterByType,
    searchValue,
    filterActive,
    isLoading,
    setFilterByType,
    setSearchValue,
  } = usePositionsTransactionList();

  return (
    <BasePageContainer>
      <BasePageHeader title={"Transaction history"} />
      <PositionActivityFilters
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
            {isLoading ? (
              <>
                <PositionActivityListLoader />
                <PositionActivityListLoader txAmount={3} />
              </>
            ) : (
              <>
                {filterActive && fxdActivities && !fxdActivities.length && (
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
                        setFilterByType("all");
                        setSearchValue("");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </Box>
                )}

                {fxdActivities && fxdActivities.length > 0 && (
                  <>
                    {Object.entries(
                      fxdActivitiesGroupByDate(fxdActivities)
                    ).map(([date, txns], groupIndex) => (
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
                          {txns.map((transaction: IFxdTransaction) => {
                            return (
                              <PositionActivityListItem
                                key={transaction.id}
                                transaction={transaction}
                              />
                            );
                          })}
                        </BaseAccordionTxGroupDetails>
                      </BaseAccordion>
                    ))}
                  </>
                )}
                {fxdActivities && !fxdActivities.length && !filterActive ? (
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

export default PositionActivityList;
