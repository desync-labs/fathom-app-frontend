import { Box, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface DashboardContentNoDataProps {
  text: ReactNode;
}

export const DashboardContentNoData: FC<DashboardContentNoDataProps> = ({
  text,
}) => {
  return (
    <Box
      sx={{
        px: { xs: 2, xsm: 3 },
        pt: { xs: 1.5, xsm: 3 },
        pb: { xs: 3, sxm: 3.5 },
      }}
    >
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
};
