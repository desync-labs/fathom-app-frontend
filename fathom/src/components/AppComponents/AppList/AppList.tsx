import { styled } from "@mui/material/styles";
import { List as MuiList } from "@mui/material";

export const AppList = styled(MuiList)`
  & li {
    color: #9fadc6;
    fontsize: 14px;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-left: 8px;
    padding-right: 0;
    span {
      font-size: 14px;
    }
    & div:last-child {
      padding-right: 8px;
    }
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    > .MuiListItem-root {
      padding-left: 0;
      > .MuiListItemText-root {
        max-width: 75%;
      }
      .MuiListItemSecondaryAction-root {
        right: 0;
      }
    }
  }
`;
