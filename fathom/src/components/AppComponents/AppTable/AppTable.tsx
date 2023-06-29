import { styled } from "@mui/material/styles";
import {
  TableCell,
  TableRow as MuiTableRow
} from "@mui/material";

export const AppTableHeaderRow = styled(MuiTableRow)`
  height: 32px;
  th {
    text-align: center;
    font-size: 11px;
    text-transform: uppercase;
    color: #5977a0;
    padding: 0;
    border: none;
  }

  th:first-of-type {
    border-radius: 8px 0 0 8px;
    padding-left: 20px;
  }

  th:last-child {
    border-radius: 0 8px 8px 0;
  }
`;

export const AppTableRow = styled(MuiTableRow)`
  td {
    color: #c5d7f2;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    border-bottom: none;  
    height: 72px;
    padding: 0;
    background: #131F35;
    
    &:first-of-type {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 0;
      padding-left: 20px;
    }
    &:last-of-type {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 0;
    }
  }
  &.border {
    border-bottom: 2px solid #121212;
    td {
      &:first-of-type {
        border-top-left-radius: 0;
        border-bottom-left-radius: 8px;
      }
      &:last-of-type {
        border-top-right-radius: 0;
        border-bottom-right-radius: 8px;
        padding-right: 20px;
      }
    }
    &.single {
      td {
        &:first-of-type {
          border-top-left-radius: 8px;
        }
        &:last-of-type {
          border-top-right-radius: 8px;
          padding-right: 0;
        }
      } 
    }
  }
`;

export const AppTableCellWithPopover = styled(TableCell)`
  display: flex;
  justify-content: center;
  gap: 7px;
  padding-top: 4px !important;
`
