import { FC } from "react";
import { Box, Button, SvgIcon, Typography } from "@mui/material";
import { useModalContext } from "apps/lending/hooks/useModal";
import { TxErrorType } from "apps/lending/ui-config/errorMapping";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

export const TxErrorView: FC<{ txError: TxErrorType }> = ({ txError }) => {
  const { close } = useModalContext();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: "92px",
        }}
      >
        <Box
          sx={{
            width: "48px",
            height: "48px",
            backgroundColor: "error.200",
            borderRadius: "50%",
            mt: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SvgIcon sx={{ color: "error.main", fontSize: "32px" }}>
            <CloseRoundedIcon />
          </SvgIcon>
        </Box>

        <Typography sx={{ mt: 1 }} variant="h2">
          Transaction failed
        </Typography>

        <Button
          variant="outlined"
          onClick={() =>
            navigator.clipboard.writeText(txError.rawError.message.toString())
          }
          size="small"
          sx={{ mt: 3 }}
        >
          Copy error text
          <SvgIcon sx={{ ml: 0.25, fontSize: "12px" }}>
            <ContentCopyRoundedIcon />
          </SvgIcon>
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", mt: 6 }}>
        <Button
          onClick={close}
          variant="gradient"
          size="large"
          sx={{ minHeight: "44px" }}
        >
          Close
        </Button>
      </Box>
    </>
  );
};
