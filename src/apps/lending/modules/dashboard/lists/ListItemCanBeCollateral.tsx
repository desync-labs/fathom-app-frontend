import { FC, memo } from "react";
import { Box, SvgIcon } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { NoData } from "apps/lending/components/primitives/NoData";
import { ListItemIsolationBadge } from "apps/lending/modules/dashboard/lists/ListItemIsolationBadge";

interface ListItemCanBeCollateralProps {
  isIsolated: boolean;
  usageAsCollateralEnabled: boolean;
}

export const ListItemCanBeCollateral: FC<ListItemCanBeCollateralProps> = memo(
  ({ isIsolated, usageAsCollateralEnabled }) => {
    const CollateralStates = () => {
      if (usageAsCollateralEnabled && !isIsolated) {
        return (
          <SvgIcon
            sx={{
              color: "success.main",
              fontSize: { xs: "20px", xsm: "24px" },
            }}
          >
            <CheckRoundedIcon />
          </SvgIcon>
        );
      } else if (usageAsCollateralEnabled && isIsolated) {
        // NOTE: handled in ListItemIsolationBadge
        return null;
      } else {
        return <NoData variant="main14" color="text.secondary" />;
      }
    };

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!isIsolated ? (
          <CollateralStates />
        ) : (
          <ListItemIsolationBadge>
            <CollateralStates />
          </ListItemIsolationBadge>
        )}
      </Box>
    );
  }
);
