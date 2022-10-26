import { styled } from "@mui/material/styles";
import { List as MuiList } from "@mui/material";

export const AppList = styled(
  MuiList,
  {}
)(({ theme }) => ({
  "& li": {
    color: "#9FADC6",
    fontSize: "14px",
    paddingTop: "3px",
    paddingBottom: "3px",
    paddingLeft: "8px",
    paddingRight: 0,
    "span": {
      fontSize: "14px"
    },
    "& div:last-child": {
      paddingRight: "8px"
    }
  },
}));
