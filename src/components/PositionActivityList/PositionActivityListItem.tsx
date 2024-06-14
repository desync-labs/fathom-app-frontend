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

const PositionActivityListItemWrapper = styled(AppListItem)`
  padding-left: 24px;
  padding-right: 10px;

  .MuiListItemText-multiline {
    width: 50px;
  }
`;

const PositionActivityListItem: FC<{ transaction: IFxdTransaction }> = ({
  transaction,
}) => {
  const { chainId } = useConnector();

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
          View
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
