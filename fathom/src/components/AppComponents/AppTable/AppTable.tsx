import { styled } from "@mui/material/styles";
import { TableRow as MuiTableRow } from "@mui/material";

export const AppTableHeaderRow = styled(
  MuiTableRow,
  {}
)(({ theme }) => ({
  th: {
    textAlign: "center",
    fontSize: "11px",
    textTransform: "uppercase",
    color: "#5977A0",
    padding: 0,
    border: "none",
  },
  "th:first-child": {
    borderRadius: "8px 0 0 8px",
  },

  "th:last-child": {
    borderRadius: "0 8px 8px 0",
  },
  background: "#192C46",
  height: "32px",
}));

export const AppTableRow = styled(
  MuiTableRow,
  {}
)(({ theme }) => ({
  td: {
    color: "#C5D7F2",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "20px",
    borderBottom: "1px solid #1D2D49",
    height: "50px",
    padding: 0,
  },
}));
