import { styled } from "@mui/material/styles";
import { List as MuiList } from "@mui/material";

export const AppList = styled(MuiList)`
  & li {
    color: #9fadc6;
    fontsize: 14px;
    paddingtop: 3px;
    paddingbottom: 3px;
    paddingleft: 8px;
    paddingright: 0;
    span {
      font-size: 14px;
    }
    & div:last-child {
      padding-right: 8px;
    }
  }
`;
