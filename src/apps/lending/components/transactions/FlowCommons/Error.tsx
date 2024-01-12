import { DuplicateIcon, XIcon } from "@heroicons/react/outline";
import { Box, Button, Link, SvgIcon, Typography } from "@mui/material";
import { useModalContext } from "apps/lending/hooks/useModal";
import { TxErrorType } from "apps/lending/ui-config/errorMapping";
import { FC } from "react";

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
            mt: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SvgIcon sx={{ color: "error.main", fontSize: "32px" }}>
            <XIcon />
          </SvgIcon>
        </Box>

        <Typography sx={{ mt: 2 }} variant="h2">
          Transaction failed
        </Typography>

        <Typography>
          You can report incident to our{" "}
          <Link href="https://discord.com/invite/aave">Discord</Link> or
          <Link href="https://github.com/aave/interface">Github</Link>.
        </Typography>

        <Button
          variant="outlined"
          onClick={() =>
            navigator.clipboard.writeText(txError.rawError.message.toString())
          }
          size="small"
          sx={{ mt: 6 }}
        >
          Copy error text
          <SvgIcon sx={{ ml: 0.5, fontSize: "12px" }}>
            <DuplicateIcon />
          </SvgIcon>
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", mt: 12 }}>
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
