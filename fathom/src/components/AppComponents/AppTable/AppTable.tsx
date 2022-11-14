import { styled } from "@mui/material/styles";
import { TableRow as MuiTableRow } from "@mui/material";

export const AppTableHeaderRow = styled(MuiTableRow)`
  background: #192c46;
  height: 32px;
  th {
    text-align: center;
    font-size: 11px;
    text-transform: uppercase;
    color: #5977a0;
    padding: 0;
    border: none;
  }

  th:first-child {
    border-radius: 8px 0 0 8px;
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
    border-bottom: 1px solid #1d2d49;
    height: 50px;
    padding: 0;
  }
`;
