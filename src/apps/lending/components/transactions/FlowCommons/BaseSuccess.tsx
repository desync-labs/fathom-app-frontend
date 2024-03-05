import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, Link, SvgIcon, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";

import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

export type BaseSuccessTxViewProps = {
  txHash?: string;
  children: ReactNode;
};

const ExtLinkIcon = () => (
  <SvgIcon sx={{ ml: "2px", fontSize: "11px" }}>
    <OpenInNewIcon />
  </SvgIcon>
);

export const BaseSuccessView: FC<BaseSuccessTxViewProps> = ({
  txHash,
  children,
}) => {
  const { close, mainTxState } = useModalContext();
  const { currentNetworkConfig } = useProtocolDataContext();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: {
            sm: "auto",
            xs: "80%",
          },
        }}
      >
        <Box
          sx={{
            width: "48px",
            height: "48px",
            bgcolor: "transparent",
            borderRadius: "50%",
            mt: 4,
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SvgIcon sx={{ color: "success.main", fontSize: "32px" }}>
            <DoneRoundedIcon />
          </SvgIcon>
        </Box>

        <Typography sx={{ mt: 2 }} variant="h2">
          All done!
        </Typography>

        {children}
      </Box>

      <Box
        sx={{ display: "flex", flexDirection: "column" }}
        className="TxActionsWrapper"
      >
        <Link
          variant="helperText"
          href={currentNetworkConfig.explorerLinkBuilder({
            tx: txHash ? txHash : mainTxState.txHash,
          })}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "right",
            mt: 4,
            mb: 2,
          }}
          underline="hover"
          target="_blank"
          rel="noreferrer noopener"
        >
          Review tx details
          <ExtLinkIcon />
        </Link>
        <Button
          onClick={close}
          variant="gradient"
          size="large"
          sx={{ minHeight: "44px" }}
          data-cy="closeButton"
        >
          Ok, Close
        </Button>
      </Box>
    </>
  );
};
