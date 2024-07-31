import { FC, memo } from "react";
import { ListItemText, styled } from "@mui/material";
import dayjs from "dayjs";
import { getBlockScanLink } from "apps/dex/utils";
import useConnector from "context/connector";
import useSharedContext from "context/shared";
import { BaseListItem } from "components/Base/List/StyledList";
import {
  BaseButtonSecondaryLink,
  ExtLinkIcon,
} from "components/Base/Buttons/StyledButtons";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import {
  FormattedTransaction,
  IconWrapper,
} from "apps/dex/components/Transactions/Transaction";
import { getTransactionType } from "apps/charts/components/TxnList";
import { formattedNum, formatTime } from "apps/charts/utils";
import Loader from "apps/dex/components/Loader";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const PositionActivityListItemWrapper = styled(BaseListItem)`
  justify-content: space-between;
  border-top: none;
  border-bottom: 1px solid #3d5580;
  padding: 16px 24px 16px 48px;
  .MuiListItemText-root {
    ${({ theme }) => theme.breakpoints.down("sm")} {
      width: 100%;
      font-size: 11px;
      flex: none;
      margin-top: 0;
      margin-bottom: 0;
    }
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 12px 16px;
  }
`;

const TxListItemContent = styled(BaseFlexBox)`
  flex-direction: row;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    align-items: flex-start;
    width: calc(100% - 48px);
    gap: 8px;

    & .MuiListItemText-multiline {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 8px;

      & span {
        font-size: 12px;
        font-weight: 600;
      }
      & p {
        font-size: 10px;
        font-weight: 400;
      }
    }
  }
`;

const TxListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "width",
})<{ width?: string }>`
  &.MuiListItemText-multiline {
    width: ${({ width = "200px" }) => width};

    ${({ theme }) => theme.breakpoints.down("sm")} {
      width: 100%;
    }

    & .MuiListItemText-secondary {
      color: #8ea4cc;
      font-size: 11px;
      font-style: normal;
      font-weight: 400;
    }
  }

  &.liquidation {
    & .MuiListItemText-primary {
      color: #f76e6e;
    }
  }
`;

const TxListItemViewBtn = styled(BaseButtonSecondaryLink)`
  gap: 3px;
  padding: 8px 12px;
  height: 32px;
  font-size: 13px;
`;

const PositionActivityListItem: FC<{
  transaction: FormattedTransaction;
}> = ({ transaction }) => {
  const { chainId } = useConnector();
  const { isMobile } = useSharedContext();

  const summary = (transaction as any)?.summary
    ? transaction?.summary
    : getTransactionType(
        (transaction as FormattedTransaction).type,
        (transaction as FormattedTransaction).token0Symbol,
        (transaction as FormattedTransaction).token1Symbol,
        formattedNum((transaction as FormattedTransaction).token0Amount),
        formattedNum((transaction as FormattedTransaction).token1Amount),
        formatTime(transaction.addedTime / 1000)
      );

  return (
    <PositionActivityListItemWrapper
      secondaryAction={
        <TxListItemViewBtn
          target={"_blank"}
          href={getBlockScanLink(chainId, transaction.hash, "transaction")}
        >
          View
          {!isMobile && <ExtLinkIcon width={"14px"} height={"14px"} />}
        </TxListItemViewBtn>
      }
    >
      <TxListItemContent>
        <TxListItemText
          width={"400px"}
          primary={summary}
          secondary={dayjs(transaction.addedTime).format("DD/MM/YYYY HH:mm:ss")}
        />
        <ListItemText
          primary={
            <IconWrapper
              pending={transaction.pending as boolean}
              success={!transaction.pending}
            >
              {transaction.pending ? (
                <Loader stroke={"white"} />
              ) : (
                <TaskAltIcon sx={{ width: "16px", height: "16px" }} />
              )}
            </IconWrapper>
          }
        />
      </TxListItemContent>
    </PositionActivityListItemWrapper>
  );
};

export default memo(PositionActivityListItem);
