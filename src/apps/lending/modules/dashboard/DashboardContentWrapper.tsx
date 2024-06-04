import { Box, useMediaQuery, useTheme } from "@mui/material";

import { BorrowAssetsList } from "apps/lending/modules/dashboard/lists/BorrowAssetsList/BorrowAssetsList";
import { BorrowedPositionsList } from "apps/lending/modules/dashboard/lists/BorrowedPositionsList/BorrowedPositionsList";
import { SuppliedPositionsList } from "apps/lending/modules/dashboard/lists/SuppliedPositionsList/SuppliedPositionsList";
import { SupplyAssetsList } from "apps/lending/modules/dashboard/lists/SupplyAssetsList/SupplyAssetsList";
import { FC, memo } from "react";

interface DashboardContentWrapperProps {
  isBorrow: boolean;
}

export const DashboardContentWrapper: FC<DashboardContentWrapperProps> = memo(
  ({ isBorrow }) => {
    const { breakpoints } = useTheme();

    const isDesktop = useMediaQuery(breakpoints.up("lg"));
    const paperWidth = isDesktop ? "calc(50% - 8px)" : "100%";

    return (
      <Box>
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
            <BorrowedPositionsList />
            <BorrowAssetsList />
          </Box>
        </Box>
      </Box>
    );
  }
);
