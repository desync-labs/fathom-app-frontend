import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
} from "@mui/material";
import useSharedContext from "context/shared";
import {
  BaseTableCell,
  BaseTableCellPopover,
  BaseTableContainer,
  BaseTableHeaderRow,
  BaseTableItemRow,
} from "components/Base/Table/StyledTable";
import {
  PoolWrapper,
  PoolsListItemMobileContainer,
} from "components/Pools/PoolsListItemMobile";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";
import BasePopover from "components/Base/Popover/BasePopover";
import { PositionListItemMobileContainer } from "components/PositionList/PositionListItemMobile";

const PoolListItemSkeleton = () => {
  return (
    <BaseTableItemRow>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <CustomSkeleton
            variant="circular"
            animation={"wave"}
            width={32}
            height={32}
          />
          <Box>
            <CustomSkeleton height={18} width={120} animation={"wave"} />
            <CustomSkeleton
              height={14}
              width={80}
              animation={"wave"}
              sx={{ marginTop: "4px" }}
            />
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <CustomSkeleton height={20} width={100} animation={"wave"} />
      </TableCell>
      <TableCell>
        <CustomSkeleton height={20} width={80} animation={"wave"} />
      </TableCell>
      <TableCell>
        <CustomSkeleton height={20} width={120} animation={"wave"} />
      </TableCell>
      <TableCell align="right" width={"200px"}>
        <CustomSkeleton height={32} width={160} animation={"wave"} />
      </TableCell>
    </BaseTableItemRow>
  );
};
const PoolListItemMobileSkeleton = () => {
  return (
    <PoolsListItemMobileContainer>
      <PoolWrapper>
        <CustomSkeleton
          variant="circular"
          animation={"wave"}
          width={20}
          height={20}
        />
        <CustomSkeleton width={120} height={20} animation={"wave"} />
      </PoolWrapper>
      <CustomSkeleton width={100} height={20} animation={"wave"} />
    </PoolsListItemMobileContainer>
  );
};

export const PoolListSkeleton = () => {
  const { isMobile } = useSharedContext();
  return (
    <>
      {!isMobile && (
        <BaseTableContainer>
          <Table aria-label="pools table">
            <TableHead>
              <BaseTableHeaderRow>
                <BaseTableCell>Pool</BaseTableCell>
                <BaseTableCell>Price</BaseTableCell>
                <BaseTableCell>Borrowed</BaseTableCell>
                <BaseTableCell>Available</BaseTableCell>
                <BaseTableCell></BaseTableCell>
              </BaseTableHeaderRow>
            </TableHead>
            <TableBody>
              <PoolListItemSkeleton />
              <PoolListItemSkeleton />
            </TableBody>
          </Table>
        </BaseTableContainer>
      )}
      {isMobile && (
        <>
          <PoolListItemMobileSkeleton />
          <PoolListItemMobileSkeleton />
        </>
      )}
    </>
  );
};

const PositionListItemSkeleton = () => {
  return (
    <BaseTableItemRow>
      <TableCell>
        <CustomSkeleton height={20} width={36} animation={"wave"} />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <CustomSkeleton
            variant="circular"
            animation={"wave"}
            width={32}
            height={32}
          />
          <Box>
            <CustomSkeleton height={18} width={120} animation={"wave"} />
            <CustomSkeleton
              height={14}
              width={80}
              animation={"wave"}
              sx={{ marginTop: "4px" }}
            />
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <CustomSkeleton height={20} width={100} animation={"wave"} />
      </TableCell>
      <TableCell>
        <CustomSkeleton height={20} width={80} animation={"wave"} />
      </TableCell>
      <TableCell>
        <CustomSkeleton height={20} width={80} animation={"wave"} />
      </TableCell>
      <TableCell>
        <CustomSkeleton height={20} width={60} animation={"wave"} />
      </TableCell>
      <TableCell align="right" width={"200px"}>
        <CustomSkeleton height={32} width={160} animation={"wave"} />
      </TableCell>
    </BaseTableItemRow>
  );
};
const PositionListItemMobileSkeleton = () => {
  return (
    <PositionListItemMobileContainer>
      <PoolWrapper>
        <CustomSkeleton width={36} height={20} animation={"wave"} />
        <CustomSkeleton
          variant="circular"
          animation={"wave"}
          width={22}
          height={22}
        />
        <CustomSkeleton width={120} height={20} animation={"wave"} />
      </PoolWrapper>
      <CustomSkeleton width={80} height={20} animation={"wave"} />
    </PositionListItemMobileContainer>
  );
};

export const PositionsListSkeleton = () => {
  const { isMobile } = useSharedContext();
  return (
    <>
      {!isMobile && (
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
                          automatic liquidation of your assets. The larger your
                          safety buffer, the lower your risk of reaching the
                          liquidation price. <br />
                          <br />
                          Safety buffer is calculated from LTV. When you
                          multiply your collateral value with LTV - you will get
                          how much you can borrow maximum with a 0% safety
                          buffer. For example, if your collateral value is $100,
                          with 25% LTV, you can maximum borrow 75 FXD, which
                          gives you 0% Safety Buffer, and your position becomes
                          very risky for liquidation.
                          <br />
                          <br />
                          We recommend at least 50% Safety Buffer. Using the
                          example above, the recommended amount to borrow is 75
                          FXD * 50% = 37.5 FXD.
                        </>
                      }
                    />
                  </BaseTableCellPopover>
                </BaseTableCell>
                <BaseTableCell></BaseTableCell>
              </BaseTableHeaderRow>
            </TableHead>
            <TableBody>
              <PositionListItemSkeleton />
              <PositionListItemSkeleton />
              <PositionListItemSkeleton />
              <PositionListItemSkeleton />
            </TableBody>
          </Table>
        </BaseTableContainer>
      )}
      {isMobile && (
        <>
          <PositionListItemMobileSkeleton />
          <PositionListItemMobileSkeleton />
          <PositionListItemMobileSkeleton />
          <PositionListItemMobileSkeleton />
        </>
      )}
    </>
  );
};
