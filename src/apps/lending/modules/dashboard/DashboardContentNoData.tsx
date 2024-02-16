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
        px: { xs: 4, xsm: 6 },
        pt: { xs: 3.5, xsm: 5.5 },
        pb: { xs: 6, sxm: 7 },
      }}
    >
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
};
