import { Fragment } from "react";
import { Box, Button, Container, styled, Typography } from "@mui/material";
import useSharedContext from "context/shared";
import usePositionsTransactionList, {
  IFxdTransaction,
} from "hooks/usePositionsTransactionList";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import PositionActivityFilters from "components/PositionActivityList/PositionActivityFilters";
import PositionActivityListItem from "components/PositionActivityList/PositionActivityListItem";
import { PositionActivityListLoader } from "components/PositionActivityList/PositionActivityListLoader";
import { fxdActivitiesGroupByDate } from "utils/fxdActivitiesGroupByDate";

const PageHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 24px;
  margin-top: 48px;
  margin-bottom: 48px;
`;

const TxListWrapper = styled(AppPaper)`
  border: 1px solid rgb(29, 45, 73);
  background: rgb(19, 31, 53);
  padding: 16px 24px;
`;

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
  const { isMobile } = useSharedContext();

  // return (
  //   <Container
  //     maxWidth="lg"
  //     sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}
  //   >
  //     <TxListWrapper>
  //       <PositionActivityFilters
  //         filterByType={filterByType}
  //         handleFilterByType={handleFilterByType}
  //         searchValue={searchValue}
  //         setSearchValue={setSearchValue}
  //       />
  //       <PositionActivityListLoader />
  //       <PositionActivityListLoader />
  //     </TxListWrapper>
  //   </Container>
  // );

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}
    >
      <PageHeader>
        <Typography variant="h1">Transaction history</Typography>
      </PageHeader>
      <TxListWrapper>
        <PositionActivityFilters
          filterByType={filterByType}
          handleFilterByType={handleFilterByType}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        {isLoading ? (
          <>
            <PositionActivityListLoader />
            <PositionActivityListLoader />
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
                  We couldn&apos;t find any transactions related to your search.
                  Try again with a different asset name, or reset filters.
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
                {Object.entries(fxdActivitiesGroupByDate(fxdActivities)).map(
                  ([date, txns], groupIndex) => (
                    <Fragment key={groupIndex}>
                      <Typography
                        variant="h4"
                        color="text.light"
                        sx={{ ml: 0, mt: 3, mb: 1 }}
                      >
                        {date}
                      </Typography>
                      {txns.map((transaction: IFxdTransaction) => {
                        return (
                          <PositionActivityListItem
                            key={transaction.id}
                            transaction={transaction}
                          />
                        );
                      })}
                    </Fragment>
                  )
                )}
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
      </TxListWrapper>
    </Container>
  );
};

export default PositionActivityList;
