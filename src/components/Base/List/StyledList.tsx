import { List, ListItem, styled } from "@mui/material";

export const BaseListPreviewModal = styled(List)`
  padding: 0;
  & li {
    border-bottom: 1px solid #3d5580;
    padding: 16px;

    &.MuiListItemText-root {
      margin-top: 2px;
      margin-bottom: 2px;
    }
    span {
      color: #8ea4cc;
      font-size: 12px;
      font-weight: 700;
    }
    & div:last-of-type {
      color: #fff;
      font-size: 12px;
      font-weight: 500;
    }

    &:last-of-type {
      border: none;
    }
  }
`;

export const BaseListItem = styled(ListItem)`
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

export const BaseListStakingStats = styled(List)`
  padding: 0;
  & li {
    padding: 0 0 4px 0;

    & .MuiListItemText-root {
      margin-top: 2px;
      margin-bottom: 2px;

      span {
        font-size: 11px;
        line-height: 16px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #b7c8e5;
        ${({ theme }) => theme.breakpoints.down("sm")} {
          font-size: 10px;
        }
      }
    }

    & .MuiListItemSecondaryAction-root {
      display: inline-flex;
      flex-direction: row;
      gap: 8px;
      align-items: center;
      justify-content: flex-end;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      ${({ theme }) => theme.breakpoints.down("sm")} {
        font-size: 11px;
      }

      & span {
        color: #b7c8e5;
        font-weight: 400;
      }
    }
  }
`;
