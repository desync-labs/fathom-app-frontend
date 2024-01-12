import { CircularProgress, Paper, PaperProps, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

import { ConnectWalletButton } from "apps/lending/components/WalletConnection/ConnectWalletButton";

import { ReactComponent as FathomLogo } from "../assets/Fathom-logo.svg";

interface ConnectWalletPaperProps extends PaperProps {
  loading?: boolean;
  description?: ReactNode;
}

export const ConnectWalletPaper: FC<ConnectWalletPaperProps> = ({
  loading,
  description,
  sx,
  ...rest
}) => {
  return (
    <Paper
      {...rest}
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 4,
        flex: 1,
        ...sx,
      }}
    >
      <>
        <FathomLogo style={{ margin: "40px 0" }} />
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Please, connect your wallet
            </Typography>
            <Typography sx={{ mb: 6 }} color="text.secondary">
              {description ||
                "Please connect your wallet to see your supplies, borrowings,\n" +
                  "                  and open positions."}
            </Typography>
            <ConnectWalletButton />
          </>
        )}
      </>
    </Paper>
  );
};
