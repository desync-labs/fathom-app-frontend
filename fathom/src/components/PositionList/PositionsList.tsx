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
} from "@mui/material";
import { IOpenPosition } from "fathom-sdk";
import ClosePositionDialog from "components/Positions/RepayPositionDialog";
import {
  AppTableHeaderRow,
  AppTableCellWithPopover,
} from "components/AppComponents/AppTable/AppTable";
import {
  TitleSecondary,
  NoResults,
} from "components/AppComponents/AppBox/AppBox";
import PositionListItem from "components/PositionList/PositionListItem";
import PositionListItemMobile from "components/PositionList/PositionListItemMobile";
import useOpenPositionList from "hooks/useOpenPositionList";
import { styled } from "@mui/material/styles";
import { COUNT_PER_PAGE } from "helpers/Constants";

import { ClosePositionProvider } from "context/repayPosition";
import { TopUpPositionProvider } from "context/topUpPosition";
import TopUpPositionDialog from "components/Positions/TopUpPositionDialog";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";

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
    isMobile,
    topUpPositionPool,
    positions,
    closePosition,
    topUpPosition,
    loading,
    handlePageChange,
    onClose,
    setClosePosition,
    setTopUpPosition,
  } = useOpenPositionList(setPositionCurrentPage, proxyWallet);

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
                        <AppTableCellWithPopover>
                          Liquidation price
                          <AppPopover
                            id={"liquidation-price"}
                            text={
                              "Liquidation Price is the price of the collateral token when your collateral will be automatically sold to partially or fully repay the loan if your collateral value drops. It's a safety mechanism to ensure that loans are always sufficiently collateralized. Monitoring this price helps prevent the unwanted liquidation of your assets."
                            }
                          />
                        </AppTableCellWithPopover>
                        <TableCell>Borrowed</TableCell>
                        <TableCell>Collateral</TableCell>
                        <AppTableCellWithPopover>
                          Safety buffer
                          <AppPopover
                            id={"safety-buffer"}
                            text={
                              <>
                                Safety Buffer represents the extra collateral
                                value above your borrowed amount. This is
                                maintained to protect against market volatility
                                and prevent the automatic liquidation of your
                                assets. The larger your safety buffer, the lower
                                your risk of reaching the liquidation price.{" "}
                                <br />
                                <br />
                                Safety buffer is calculated from LTV. When you
                                multiply your collateral value with LTV - you
                                will get how much you can borrow maximum with a
                                0% safety buffer. For example, if your
                                collateral value is $100, with 25% LTV, you can
                                maximum borrow 75 FXD, which gives you 0% Safety
                                Buffer, and your position becomes very risky for
                                liquidation.
                                <br />
                                <br />
                                We recommend at least 50% Safety Buffer. Using
                                the example above, the recommended amount to
                                borrow is 75 FXD * 50% = 37.5 FXD.
                              </>
                            }
                          />
                        </AppTableCellWithPopover>
                        <TableCell></TableCell>
                      </AppTableHeaderRow>
                    </TableHead>
                    <TableBody>
                      {positions.map((position: IOpenPosition) => (
                        <PositionListItem
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
                    count={Math.ceil(positionsItemsCount / COUNT_PER_PAGE)}
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
                    key={position.id}
                    position={position}
                    setClosePosition={setClosePosition}
                    setTopUpPosition={setTopUpPosition}
                  />
                ))}
                <PaginationWrapper>
                  <Pagination
                    count={Math.ceil(positionsItemsCount / COUNT_PER_PAGE)}
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
