import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

import { IsolatedEnabledBadge } from "apps/lending/components/isolationMode/IsolatedBadge";

interface ListItemIsolationBadgeProps {
  children: ReactNode;
}

export const ListItemIsolationBadge: FC<ListItemIsolationBadgeProps> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-end", xsm: "center" },
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {children}
      <IsolatedEnabledBadge />
    </Box>
  );
};
