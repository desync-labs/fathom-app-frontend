import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListItem } from "apps/lending/components/lists/ListItem";
import { useRootStore } from "apps/lending/store/root";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import {
  ActionDetails,
  ActionTextMap,
} from "apps/lending/modules/history/actions/ActionDetails";
import { unixTimestampToFormattedTime } from "apps/lending/modules/history/helpers";
import {
  ActionFields,
  TransactionHistoryItem,
} from "apps/lending/modules/history/types";
import { ExtLinkIcon } from "components/AppComponents/AppButton/AppButton";
import useSharedContext from "context/shared";

const ActionTitle: FC<{ action: string }> = ({ action }) => {
  const { isMobile, isSmallDesktop } = useSharedContext();
  return (
    <Typography
      sx={{ width: isMobile ? "180px" : isSmallDesktop ? "260px" : "500px" }}
      color={"text.light"}
    >
      <ActionTextMap action={action} />
    </Typography>
  );
};

interface TransactionHistoryItemProps {
  transaction: TransactionHistoryItem & ActionFields[keyof ActionFields];
}

const TransactionRowItem: FC<TransactionHistoryItemProps> = ({
  transaction,
}) => {
  const [copyStatus, setCopyStatus] = useState(false);
  const { currentNetworkConfig, trackEvent } = useRootStore((state) => ({
    currentNetworkConfig: state.currentNetworkConfig,
    trackEvent: state.trackEvent,
  }));
  const theme = useTheme();

  const downToMD = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (copyStatus) {
      timer = setTimeout(() => {
        setCopyStatus(false);
      }, 1000);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [copyStatus]);

  const explorerLink = currentNetworkConfig.explorerLinkBuilder({
    tx: transaction.txHash,
  });

  return (
    <Box px={6}>
      <ListItem
        px={0}
        minHeight={50}
        sx={{
          borderWidth: `1px 0 0 0`,
          borderStyle: `solid`,
          borderColor: `${theme.palette.divider}`,
          height: "50px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            gap: "4px",
            mr: 3,
          }}
        >
          <ActionTitle action={transaction.action} />
          <Typography variant="caption" color="text.muted">
            {unixTimestampToFormattedTime({
              unixTimestamp: transaction.timestamp,
            })}
          </Typography>
        </Box>

        <Box>
          <ActionDetails transaction={transaction} iconSize="20px" />
        </Box>
        <ListColumn align="right">
          <Box sx={{ display: "inline-flex", alignItems: "center" }}>
            {!downToMD && (
              <Button
                variant="outlined"
                href={explorerLink}
                target="_blank"
                onClick={() =>
                  trackEvent(GENERAL.EXTERNAL_LINK, {
                    funnel: "TxHistoy",
                    Link: "Etherscan",
                  })
                }
              >
                View <ExtLinkIcon width={"12px"} height={"12px"} />
              </Button>
            )}
          </Box>
        </ListColumn>
      </ListItem>
    </Box>
  );
};

export default TransactionRowItem;
