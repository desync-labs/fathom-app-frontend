import { styled } from "@mui/material/styles";
import {
  Box,
  TableCell,
  TableContainer,
  TableRow as MuiTableRow,
  TableRow,
} from "@mui/material";

export const BaseTableRow = styled(MuiTableRow)`
  background: #131f35;
  td {
    color: #c5d7f2;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    border-bottom: 2px solid #121212;
    height: 72px;
    padding: 0;
  }
  td:first-of-type {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    padding-left: 20px;
  }
  td:last-of-type {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

export const BaseTableContainer = styled(TableContainer)`
  border-radius: 12px;
  background: #132340;
`;

export const BaseTableHeaderRow = styled(TableRow)`
  height: 36px;
  background: #2c4066;
`;

export const BaseTableCell = styled(TableCell)`
  color: #8ea4cc;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.44px;
  text-transform: uppercase;
  padding: 8px 8px;

  &:first-of-type {
    padding: 8px 24px;

    ${({ theme }) => theme.breakpoints.down("sm")} {
      padding: 8px 16px;
    }
  }
`;

export const BaseTableCellPopover = styled(Box)`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 7px;
  width: max-content;
  line-height: 1rem;
`;

export const BaseTableItemRow = styled(BaseTableRow)`
  background: transparent;

  &:last-child {
    td {
      border-bottom: none;
    }
  }
  & td {
    height: 68px;
    color: #fff;
    border-bottom: 1px solid #4f658c4d;
    padding: 16px 8px;
  }
`;

export const BaseTablePaginationWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  border-top: 1px solid #4f658c4d;
  padding: 14px 0;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    border-top: none;
  }
`;
