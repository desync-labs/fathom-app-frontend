import { styled } from "@mui/material/styles";
import { List as MuiList, ListItem, Box } from "@mui/material";

export const AppList = styled(MuiList)`
  width: 100%;
  & li {
    color: #9fadc6;
    font-size: 14px;
    padding: 3px 0 3px 8px;
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
export const AppListVault = styled(MuiList)`
  width: 100%;
  & li {
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    padding: 3px 0;
    span {
      font-size: 14px;
    }
    & div:last-child {
      font-weight: 600;
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

export const AppListItem = styled(ListItem)`
  &.MuiListItem-root {
    align-items: center;
  }
  .MuiListItemSecondaryAction-root {
    max-width: 250px;
    word-break: break-all;
    text-align: right;
    position: static;
    transform: none;
  }
  &.short {
    .MuiListItemSecondaryAction-root {
      max-width: 120px;
    }
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    justify-content: space-between;
  }
`;

export const ListItemWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const ListLabel = styled(Box)`
  color: #6379a1;
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: start;
`;

export const ListValue = styled(Box)`
  display: flex;
  justify-content: right;
  flex-direction: column;
`;
