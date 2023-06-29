import React, {
  Dispatch,
  FC,
  memo
} from "react";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Pagination
} from "@mui/material";
import { AppTableHeaderRow } from "components/AppComponents/AppTable/AppTable";
import {
  NoResults
} from "components/AppComponents/AppBox/AppBox";
import { styled } from "@mui/material/styles";
import { COUNT_PER_PAGE } from "helpers/Constants";
import useFarmsList from "hooks/useFarmsList";
import FarmListItem from "components/Farms/FarmListItem";
import FarmFilters from "./FarmFilters";

const CircleWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PaginationWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const FarmListTableCell = styled(TableCell)`
  padding: 0 !important;
`

type FarmsListProps = {
  positionsItemsCount: number;
  positionCurrentPage: number;
  setPositionCurrentPage: Dispatch<number>;
};

const FarmList: FC<FarmsListProps> = ({
  positionsItemsCount,
  positionCurrentPage,
  setPositionCurrentPage
}) => {
  const {
    loading,
    noResults,
    handlePageChange
  } = useFarmsList();


  return (
    <>
      {noResults && <NoResults variant="h6">
        {loading ? (
          <CircleWrapper>
            <CircularProgress size={30} />
          </CircleWrapper>
        ) : (
          "You have not opened farms"
        )}
      </NoResults>}
      <TableContainer>
        <FarmFilters />
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <AppTableHeaderRow
              sx={{
                th: { textAlign: "left", paddingLeft: "10px" }
              }}
            >
              <FarmListTableCell>Pool</FarmListTableCell>
              <FarmListTableCell>Fee</FarmListTableCell>
              <FarmListTableCell>Earned</FarmListTableCell>
              <FarmListTableCell>Apr</FarmListTableCell>
              <FarmListTableCell>Staked Liquidity</FarmListTableCell>
              <FarmListTableCell>Available</FarmListTableCell>
              <FarmListTableCell>Stacked</FarmListTableCell>
              <TableCell></TableCell>
            </AppTableHeaderRow>
          </TableHead>
          <TableBody>
            <FarmListItem />
            <FarmListItem />
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationWrapper>
        <Pagination
          count={Math.ceil(
            positionsItemsCount / COUNT_PER_PAGE
          )}
          page={positionCurrentPage}
          onChange={handlePageChange}
        />
      </PaginationWrapper>
    </>
  );
};

export default memo(FarmList);
