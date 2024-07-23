import { ListItemText, styled } from "@mui/material";
import dayjs from "dayjs";
import { FC, memo } from "react";
import {
  FilterTxType,
  IFxdTransaction,
  PositionActivityState,
} from "hooks/Pools/usePositionsTransactionList";
import { getBlockScanLink } from "apps/dex/utils";
import useConnector from "context/connector";
import useSharedContext from "context/shared";
import { BaseListItem } from "components/Base/List/StyledList";
import PositionActivityListItemAmounts from "components/PositionActivityList/PositionActivityListItem/PostionActivityListItemAmounts";
import {
  BaseButtonSecondaryLink,
  ExtLinkIcon,
} from "components/Base/Buttons/StyledButtons";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";

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

const TxListItemText = styled(ListItemText)`
  &.MuiListItemText-multiline {
    width: 200px;

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

const PositionActivityListItem: FC<{ transaction: IFxdTransaction }> = ({
  transaction,
}) => {
  const { chainId } = useConnector();
  const { isMobile } = useSharedContext();

  return (
    <PositionActivityListItemWrapper
      secondaryAction={
        <TxListItemViewBtn
          target={"_blank"}
          href={getBlockScanLink(
            chainId,
            transaction.transaction,
            "transaction"
          )}
        >
          View
          {!isMobile && <ExtLinkIcon width={"14px"} height={"14px"} />}
        </TxListItemViewBtn>
      }
    >
      <TxListItemContent>
        <TxListItemText
          primary={FilterTxType[transaction.activityState]}
          secondary={dayjs(transaction.blockTimestamp * 1000).format(
            "DD/MM/YYYY HH:mm:ss"
          )}
          className={
            transaction.activityState === PositionActivityState.LIQUIDATION
              ? "liquidation"
              : ""
          }
        />
        <ListItemText
          primary={
            <PositionActivityListItemAmounts transaction={transaction} />
          }
        />
      </TxListItemContent>
    </PositionActivityListItemWrapper>
  );
};

export default memo(PositionActivityListItem);
