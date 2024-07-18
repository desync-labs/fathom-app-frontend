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
  BaseTableContainer,
  BaseTableHeaderRow,
  BaseTableItemRow,
} from "components/Base/Table/StyledTable";
import {
  PoolWrapper,
  PoolsListItemMobileContainer,
} from "components/Pools/PoolsListItemMobile";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";
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

export const PositionListItemSkeleton = () => {
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
      <TableCell align="right" width={"180px"}>
        <CustomSkeleton height={32} width={128} animation={"wave"} />
      </TableCell>
    </BaseTableItemRow>
  );
};

export const PositionListItemMobileSkeleton = () => {
  return (
    <PositionListItemMobileContainer>
      <PoolWrapper>
        <CustomSkeleton width={36} height={20} animation={"wave"} />
        <CustomSkeleton
          variant="circular"
          animation={"wave"}
          width={23}
          height={23}
        />
        <CustomSkeleton width={120} height={20} animation={"wave"} />
      </PoolWrapper>
      <CustomSkeleton width={80} height={20} animation={"wave"} />
    </PositionListItemMobileContainer>
  );
};
