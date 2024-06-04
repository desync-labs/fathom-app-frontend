import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { PageTitle } from "apps/lending/components/TopInfoPanel/PageTitle";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";

import { TopInfoPanel } from "apps/lending/components/TopInfoPanel/TopInfoPanel";
import { lendingContainerProps } from "apps/lending/components/ContentContainer";

export const FaucetTopPanel = () => {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down("md"));
  const xsm = useMediaQuery(breakpoints.down("xsm"));
  const { currentMarketData } = useProtocolDataContext();
  return (
    <TopInfoPanel
      pageTitle={<></>}
      containerProps={lendingContainerProps}
      titleComponent={
        <Box>
          <PageTitle
            pageTitle={<>{currentMarketData.marketTitle} Faucet</>}
            withMarketSwitcher={true}
          />
          <Box sx={{ width: md ? (xsm ? "320px" : "540px") : "860px" }}>
            <Typography variant="description" color="#A5A8B6">
              With testnet Faucet you can get free assets to test the Fathom
              lending Protocol. Make sure to switch your wallet provider to the
              appropriate testnet network, select desired asset, and click
              ‘Faucet’ to get tokens transferred to your wallet. The assets on a
              testnet are not “real,” meaning they have no monetary value.
            </Typography>
          </Box>
        </Box>
      }
    />
  );
};
