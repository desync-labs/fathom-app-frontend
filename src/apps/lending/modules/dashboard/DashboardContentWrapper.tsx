import { ChainId } from "@aave/contract-helpers";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { ROUTES } from "apps/lending/components/primitives/Link";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { useRootStore } from "apps/lending/store/root";
import { AUTH } from "apps/lending/utils/mixPanelEvents";

import { BorrowAssetsList } from "apps/lending/modules/dashboard/lists/BorrowAssetsList/BorrowAssetsList";
import { BorrowedPositionsList } from "apps/lending/modules/dashboard/lists/BorrowedPositionsList/BorrowedPositionsList";
import { SuppliedPositionsList } from "apps/lending/modules/dashboard/lists/SuppliedPositionsList/SuppliedPositionsList";
import { SupplyAssetsList } from "apps/lending/modules/dashboard/lists/SupplyAssetsList/SupplyAssetsList";
import { useNavigate } from "react-router-dom";

interface DashboardContentWrapperProps {
  isBorrow: boolean;
}

export const DashboardContentWrapper = ({
  isBorrow,
}: DashboardContentWrapperProps) => {
  const { breakpoints } = useTheme();
  const { currentAccount } = useWeb3Context();
  const navigate = useNavigate();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const isDesktop = useMediaQuery(breakpoints.up("lg"));
  const paperWidth = isDesktop ? "calc(50% - 8px)" : "100%";

  const downToLg = useMediaQuery(breakpoints.down("lg"));

  const upFromSm = useMediaQuery(breakpoints.up("xsm"));

  return (
    <Box>
      {currentMarketData.chainId === ChainId.polygon && !currentMarketData.v3}
      <Box
        sx={{
          display: isDesktop ? "flex" : "block",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            position: "relative",

            display: { xs: isBorrow ? "none" : "block", lg: "block" },
            width: paperWidth,
          }}
        >
          {currentAccount && !isBorrow && downToLg && (
            <Box>
              <Button
                sx={{
                  position: "absolute",
                  top: upFromSm ? "-60px" : "-90px",
                  right: "0px",
                }}
                onClick={() => {
                  navigate(ROUTES.history);
                  trackEvent(AUTH.VIEW_TX_HISTORY);
                }}
                component="a"
                variant="surface"
                size="small"
              >
                View Transactions
              </Button>
            </Box>
          )}

          <SuppliedPositionsList />
          <SupplyAssetsList />
        </Box>

        <Box
          sx={{
            position: "relative",

            display: { xs: !isBorrow ? "none" : "block", lg: "block" },
            width: paperWidth,
          }}
        >
          {currentAccount && (
            <Box
              sx={{
                position: "absolute",

                top: upFromSm ? "-60px" : "-90px",

                right: "0px",
              }}
            >
              <Button
                onClick={() => {
                  navigate(ROUTES.history);
                  trackEvent(AUTH.VIEW_TX_HISTORY);
                }}
                component="a"
                variant="surface"
                size="small"
              >
                View Transactions
              </Button>
            </Box>
          )}

          <BorrowedPositionsList />
          <BorrowAssetsList />
        </Box>
      </Box>
    </Box>
  );
};
