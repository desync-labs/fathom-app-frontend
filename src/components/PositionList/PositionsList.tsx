import { Dispatch, FC, memo, useState, useEffect, useMemo } from "react";
import { Box, Table, TableBody, TableHead, Pagination } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IOpenPosition } from "fathom-sdk";

import useSharedContext from "context/shared";
import { COUNT_PER_PAGE } from "utils/Constants";
import useOpenPositionList from "hooks/Positions/useOpenPositionList";
import { ClosePositionProvider } from "context/repayPosition";
import { TopUpPositionProvider } from "context/topUpPosition";

import ClosePositionDialog from "components/Positions/RepayPositionDialog";
import PositionListItem from "components/PositionList/PositionListItem";
import PositionListItemMobile from "components/PositionList/PositionListItemMobile";
import TopUpPositionDialog from "components/Positions/TopUpPositionDialog";
import BasePopover from "components/Base/Popover/BasePopover";
import { TitleSecondary } from "components/AppComponents/AppBox/AppBox";
import {
  BaseTableCell,
  BaseTableCellPopover,
  BaseTableContainer,
  BaseTableHeaderRow,
  BaseTablePaginationWrapper,
} from "components/Base/Table/StyledTable";
import { NoResults } from "components/Base/Typography/StyledTypography";
import {
  PositionListItemMobileSkeleton,
  PositionListItemSkeleton,
} from "components/Base/Skeletons/StablecoinSkeletons";
import { BaseDialogWrapper } from "components/Base/Dialog/StyledDialog";

const PositionsTitle = styled(TitleSecondary)`
  font-size: 20px;
  margin-bottom: 12px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

type PositionsListProps = {
  positionsItemsCount: number;
  proxyWallet: string;
  positionCurrentPage: number;
  loadingPositions: boolean;
  setPositionCurrentPage: Dispatch<number>;
};

const PositionsList: FC<PositionsListProps> = ({
  proxyWallet,
  positionsItemsCount,
  positionCurrentPage,
  setPositionCurrentPage,
  loadingPositions,
}) => {
  const {
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
  const { isMobile } = useSharedContext();

  const [listLoading, setListLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setListLoading(loadingPositions || loading);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [setListLoading, loadingPositions, loading]);

  const pageCount = useMemo(() => {
    return Math.ceil(positionsItemsCount / COUNT_PER_PAGE);
  }, [positionsItemsCount]);

  return (
    <Box>
      <PositionsTitle variant={"h2"}>Your Positions</PositionsTitle>
      <>
        {positions.length === 0 && !listLoading && (
          <NoResults mt={isMobile ? 2 : 3}>
            You have not opened any position.
          </NoResults>
        )}

        {!isMobile && (!!positions.length || listLoading) && (
          <BaseTableContainer>
            <Table aria-label="positions table">
              <TableHead>
                <BaseTableHeaderRow>
                  <BaseTableCell>Id</BaseTableCell>
                  <BaseTableCell>Asset</BaseTableCell>
                  <BaseTableCell>
                    <BaseTableCellPopover>
                      Liquidation price
                      <BasePopover
                        id={"liquidation-price"}
                        text={
                          "Liquidation Price is the price of the collateral token when your collateral will be automatically sold to partially or fully repay the loan if your collateral value drops. It's a safety mechanism to ensure that loans are always sufficiently collateralized. Monitoring this price helps prevent the unwanted liquidation of your assets."
                        }
                      />
                    </BaseTableCellPopover>
                  </BaseTableCell>
                  <BaseTableCell>Borrowed</BaseTableCell>
                  <BaseTableCell>Collateral</BaseTableCell>
                  <BaseTableCell>
                    <BaseTableCellPopover>
                      Safety buffer
                      <BasePopover
                        id={"safety-buffer"}
                        text={
                          <>
                            Safety Buffer represents the extra collateral value
                            above your borrowed amount. This is maintained to
                            protect against market volatility and prevent the
                            automatic liquidation of your assets. The larger
                            your safety buffer, the lower your risk of reaching
                            the liquidation price. <br />
                            <br />
                            Safety buffer is calculated from LTV. When you
                            multiply your collateral value with LTV - you will
                            get how much you can borrow maximum with a 0% safety
                            buffer. For example, if your collateral value is
                            $100, with 25% LTV, you can maximum borrow 75 FXD,
                            which gives you 0% Safety Buffer, and your position
                            becomes very risky for liquidation.
                            <br />
                            <br />
                            We recommend at least 50% Safety Buffer. Using the
                            example above, the recommended amount to borrow is
                            75 FXD * 50% = 37.5 FXD.
                          </>
                        }
                      />
                    </BaseTableCellPopover>
                  </BaseTableCell>
                  <BaseTableCell></BaseTableCell>
                </BaseTableHeaderRow>
              </TableHead>
              <TableBody>
                {listLoading ? (
                  <>
                    <PositionListItemSkeleton />
                    <PositionListItemSkeleton />
                  </>
                ) : (
                  positions.map((position: IOpenPosition) => (
                    <PositionListItem
                      key={position.id}
                      position={position}
                      setClosePosition={setClosePosition}
                      setTopUpPosition={setTopUpPosition}
                    />
                  ))
                )}
                {}
              </TableBody>
            </Table>
            {pageCount > 1 && (
              <BaseTablePaginationWrapper>
                <Pagination
                  count={Math.ceil(positionsItemsCount / COUNT_PER_PAGE)}
                  page={positionCurrentPage}
                  onChange={handlePageChange}
                />
              </BaseTablePaginationWrapper>
            )}
          </BaseTableContainer>
        )}
        {isMobile && (!!positions.length || listLoading) && (
          <>
            {listLoading ? (
              <>
                <PositionListItemMobileSkeleton />
                <PositionListItemMobileSkeleton />
              </>
            ) : (
              positions.map((position: IOpenPosition) => (
                <PositionListItemMobile
                  key={position.id}
                  position={position}
                  setClosePosition={setClosePosition}
                  setTopUpPosition={setTopUpPosition}
                />
              ))
            )}
            {pageCount > 1 && (
              <BaseTablePaginationWrapper>
                <Pagination
                  count={Math.ceil(positionsItemsCount / COUNT_PER_PAGE)}
                  page={positionCurrentPage}
                  onChange={handlePageChange}
                />
              </BaseTablePaginationWrapper>
            )}
          </>
        )}
      </>
      {closePosition || topUpPosition ? (
        <BaseDialogWrapper
          onClose={onClose}
          maxWidth="sm"
          open={true}
          fullWidth
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
        </BaseDialogWrapper>
      ) : null}
    </Box>
  );
};

export default memo(PositionsList);
