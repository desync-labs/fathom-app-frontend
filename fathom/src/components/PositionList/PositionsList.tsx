import React, { Dispatch, FC, useMemo, memo } from "react";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Pagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import ClosePositionDialog from "components/Positions/RepayPositionDialog";
import { AppTableHeaderRow } from "components/AppComponents/AppTable/AppTable";
import {
  TitleSecondary,
  NoResults,
} from "components/AppComponents/AppBox/AppBox";
import PositionListItem from "components/PositionList/PositionListItem";
import PositionListItemMobile from "components/PositionList/PositionListItemMobile";
import useOpenPositionList from "hooks/useOpenPositionList";
import { styled } from "@mui/material/styles";
import { Constants } from "helpers/Constants";

import { ClosePositionProvider } from "context/repayPosition";
import { TopUpPositionProvider } from "context/topUpPosition";
import TopUpPositionDialog from "components/Positions/TopUpPositionDialog";
import { AppDialog } from "../AppComponents/AppDialog/AppDialog";

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

type PositionsListProps = {
  positionsItemsCount: number;
  proxyWallet: string;
  positionCurrentPage: number;
  setPositionCurrentPage: Dispatch<number>;
};

const PositionsList: FC<PositionsListProps> = ({
  proxyWallet,
  positionsItemsCount,
  positionCurrentPage,
  setPositionCurrentPage,
}) => {
  const {
    topUpPositionPool,
    approveBtn,
    approvalPending,
    positions,
    approve,
    closePosition,
    topUpPosition,
    loading,
    handlePageChange,
    onClose,
    setClosePosition,
    setTopUpPosition,
  } = useOpenPositionList(setPositionCurrentPage, proxyWallet);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <TitleSecondary>Your Positions</TitleSecondary>
      {useMemo(
        () => (
          <>
            {positions.length === 0 && (
              <NoResults variant="h6">
                {loading ? (
                  <CircleWrapper>
                    <CircularProgress size={30} />
                  </CircleWrapper>
                ) : (
                  "You have not opened any position"
                )}
              </NoResults>
            )}

            {!!positions.length && !isMobile && (
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
                          setClosePosition={setClosePosition}
                          setTopUpPosition={setTopUpPosition}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <PaginationWrapper>
                  <Pagination
                    count={Math.ceil(
                      positionsItemsCount / Constants.COUNT_PER_PAGE
                    )}
                    page={positionCurrentPage}
                    onChange={handlePageChange}
                  />
                </PaginationWrapper>
              </>
            )}
            {!!positions.length && isMobile && (
              <>
                {positions.map((position: IOpenPosition) => (
                  <PositionListItemMobile
                    approve={approve}
                    approvalPending={approvalPending}
                    approveBtn={approveBtn}
                    key={position.id}
                    position={position}
                    setClosePosition={setClosePosition}
                    setTopUpPosition={setTopUpPosition}
                  />
                ))}
                <PaginationWrapper>
                  <Pagination
                    count={Math.ceil(
                      positionsItemsCount / Constants.COUNT_PER_PAGE
                    )}
                    page={positionCurrentPage}
                    onChange={handlePageChange}
                  />
                </PaginationWrapper>
              </>
            )}
          </>
        ),
        [
          loading,
          positions,
          approve,
          approvalPending,
          approveBtn,
          handlePageChange,
          positionCurrentPage,
          positionsItemsCount,
          isMobile,
          setClosePosition,
          setTopUpPosition,
        ]
      )}
      {closePosition || topUpPosition ? (
        <AppDialog
          onClose={onClose}
          aria-labelledby="customized-dialog-title"
          open={true}
          fullWidth
          maxWidth="md"
          color="primary"
        >
          {closePosition && (
            <ClosePositionProvider position={closePosition} onClose={onClose}>
              <ClosePositionDialog
                topUpPosition={topUpPosition}
                closePosition={closePosition}
                setTopUpPosition={setTopUpPosition}
                setClosePosition={setClosePosition}
              />
            </ClosePositionProvider>
          )}
          {topUpPosition && (
            <TopUpPositionProvider
              position={topUpPosition}
              pool={topUpPositionPool}
              onClose={onClose}
            >
              <TopUpPositionDialog
                topUpPosition={topUpPosition}
                closePosition={closePosition}
                setTopUpPosition={setTopUpPosition}
                setClosePosition={setClosePosition}
              />
            </TopUpPositionProvider>
          )}
        </AppDialog>
      ) : null}
    </>
  );
};

export default memo(PositionsList);
