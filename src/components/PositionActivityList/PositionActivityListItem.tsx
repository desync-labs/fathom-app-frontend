import {
  ButtonSecondaryLink,
  ExtLinkIcon,
} from "components/AppComponents/AppButton/AppButton";
import { ListItemText, styled } from "@mui/material";
import dayjs from "dayjs";
import { AppListItem } from "components/AppComponents/AppList/AppList";
import { FC, memo } from "react";
import {
  FilterTxType,
  IFxdTransaction,
} from "hooks/usePositionsTransactionList";
import { getBlockScanLink } from "apps/dex/utils";
import useConnector from "context/connector";
import PositionActivityListItemAmounts from "components/PositionActivityList/PositionActivityListItem/PostionActivityListItemAmounts";
import useSharedContext from "context/shared";

const PositionActivityListItemWrapper = styled(AppListItem)`
  padding-left: 24px;
  padding-right: 10px;
  .MuiListItemText-root {
    ${({ theme }) => theme.breakpoints.down("sm")} {
      &:nth-child(2) {
        width: 30%;
      }
      font-size: 11px;
      flex: none;
    }
  }
  .MuiListItemText-multiline {
    width: 30%;
    flex: none;
    ${({ theme }) => theme.breakpoints.down("sm")} {
      width: 40%;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding-left: 0;
    padding-right: 0;
  }
`;

const PositionActivityListItem: FC<{ transaction: IFxdTransaction }> = ({
  transaction,
}) => {
  const { chainId } = useConnector();
  const { isMobile } = useSharedContext();

  return (
    <PositionActivityListItemWrapper
      secondaryAction={
        <ButtonSecondaryLink
          target={"_blank"}
          href={getBlockScanLink(
            chainId,
            transaction.transaction,
            "transaction"
          )}
        >
          {!isMobile && "View"}
          <ExtLinkIcon />
        </ButtonSecondaryLink>
      }
      sx={{ borderTop: "1px solid #1d2d49" }}
    >
      <ListItemText
        primary={FilterTxType[transaction.activityState]}
        secondary={dayjs(transaction.blockTimestamp * 1000).format(
          "DD/MM/YYYY HH:mm:ss"
        )}
      />
      <ListItemText
        primary={<PositionActivityListItemAmounts transaction={transaction} />}
      />
    </PositionActivityListItemWrapper>
  );
};

export default memo(PositionActivityListItem);
