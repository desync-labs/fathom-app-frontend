import React, { useMemo } from "react";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Pagination,
} from "@mui/material";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { observer } from "mobx-react";
import ClosePositionDialog from "components/Positions/ClosePositionDialog";
import { AppTableHeaderRow } from "components/AppComponents/AppTable/AppTable";
import {
  TitleSecondary,
  NoResults,
} from "components/AppComponents/AppBox/AppBox";
import PositionListItem from "components/PositionList/PositionListItem";
import useOpenPositionList from "hooks/useOpenPositionList";
import { styled } from "@mui/material/styles";
import { Constants } from "helpers/Constants";

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
`

const OpenPositionsList = observer(() => {
  const {
    closingType,
    setType,
    approveBtn,
    approvalPending,
    positions,
    approve,
    selectedPosition,
    setSelectedPosition,
    loading,

    itemsCount,
    currentPage,
    handlePageChange,
  } = useOpenPositionList();

  return (
    <>
      <TitleSecondary>Your Positions</TitleSecondary>
      {useMemo(
        () =>
          positions.length === 0 ? (
            <NoResults variant="h6">
              {loading ? (
                <CircleWrapper>
                  <CircularProgress size={30} />
                </CircleWrapper>
              ) : (
                "You have not opened any position"
              )}
            </NoResults>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <AppTableHeaderRow
                      sx={{
                        th: { textAlign: "left", paddingLeft: "10px" },
                      }}
                    >
                      <TableCell>Id</TableCell>
                      <TableCell>Asset</TableCell>
                      <TableCell>Liquidation price</TableCell>
                      <TableCell>Borrowed</TableCell>
                      <TableCell>Collateral</TableCell>
                      <TableCell>Safety buffer</TableCell>
                      <TableCell></TableCell>
                    </AppTableHeaderRow>
                  </TableHead>
                  <TableBody>
                    {positions.map((position: IOpenPosition) => (
                      <PositionListItem
                        approve={approve}
                        approvalPending={approvalPending}
                        approveBtn={approveBtn}
                        key={position.id}
                        position={position}
                        setSelectedPosition={setSelectedPosition}
                        setType={setType}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <PaginationWrapper>
                <Pagination count={ Math.ceil(itemsCount / Constants.COUNT_PER_PAGE) } page={currentPage} onChange={handlePageChange} />
              </PaginationWrapper>
            </>
          ),
        [
          loading,
          positions,
          approve,
          approvalPending,
          approveBtn,
          setSelectedPosition,
          setType,
        ]
      )}
      {selectedPosition && (
        <ClosePositionDialog
          position={selectedPosition}
          onClose={() => setSelectedPosition(undefined)}
          closingType={closingType}
          setType={setType}
        />
      )}
    </>
  );
});

export default OpenPositionsList;
