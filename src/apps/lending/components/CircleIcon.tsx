import { Box, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

import { DarkTooltip } from "apps/lending/components/infoTooltips/DarkTooltip";

interface CircleIconProps {
  downToSM: boolean;
  tooltipText: string;
  children: ReactNode;
}

export const CircleIcon: FC<CircleIconProps> = ({
  downToSM,
  tooltipText,
  children,
}) => {
  return (
    <DarkTooltip title={<Typography>{tooltipText}</Typography>}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "#383D51",
            width: downToSM ? "18px" : "24px",
            height: downToSM ? "18px" : "24px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            ml: "8px",
            border: "0.5px solid rgba(235, 235, 237, 0.12)",
          }}
        >
          {children}
        </Box>
      </Box>
    </DarkTooltip>
  );
};
