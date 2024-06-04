import ArrowOutward from "@mui/icons-material/ArrowOutward";
import { Box, Button, SvgIcon, Typography, useTheme } from "@mui/material";
import { FC, useEffect, useState } from "react";
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

const ActionTitle: FC<{ action: string }> = ({ action }) => {
  return (
    <Typography variant="subheader2" color="text.muted">
      <ActionTextMap action={action} />
    </Typography>
  );
};

interface TransactionHistoryItemProps {
  transaction: TransactionHistoryItem & ActionFields[keyof ActionFields];
}

const TransactionMobileRowItem: FC<TransactionHistoryItemProps> = ({
  transaction,
}) => {
  const [copyStatus, setCopyStatus] = useState(false);
  const { currentNetworkConfig, trackEvent } = useRootStore((state) => ({
    currentNetworkConfig: state.currentNetworkConfig,
    trackEvent: state.trackEvent,
  }));
  const theme = useTheme();

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
    <Box>
      <ListItem
        px={2}
        sx={{
          borderWidth: `1px 0 0 0`,
          borderStyle: `solid`,
          borderColor: `${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              pt: "14px",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <ActionTitle action={transaction.action} />
            </Box>

            <Box sx={{ display: "inline-flex", alignItems: "center" }}>
              {" "}
              <Typography variant="caption" color="text.muted">
                {unixTimestampToFormattedTime({
                  unixTimestamp: transaction.timestamp,
                })}
              </Typography>
              <Button
                sx={{
                  display: "flex",
                  ml: 1.5,
                  mr: 0.5,
                  width: "69px",
                  height: "20px",
                  fontSize: "0.6rem",
                  alignItems: "center",
                  justifyContent: "center",
                  pl: 0.5,
                  pr: 0.5,
                }}
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
                VIEW TX{" "}
                <SvgIcon
                  sx={{
                    fontSize: "15px",
                    pl: 0.5,
                    pb: 0.25,
                  }}
                >
                  <ArrowOutward />
                </SvgIcon>
              </Button>
            </Box>
          </Box>
          <Box sx={{ py: "28px" }}>
            <ActionDetails transaction={transaction} iconSize="24px" />
          </Box>
        </Box>
      </ListItem>
    </Box>
  );
};

export default TransactionMobileRowItem;
