import { Box, Tooltip, TooltipProps } from "@mui/material";
import { FC } from "react";

export const DarkTooltip: FC<TooltipProps & { wrap?: boolean }> = ({
  title,
  children,
  wrap,
}) => {
  return (
    <div>
      <Tooltip
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: "rgba(15, 18, 29, 0.8)",
              "& .MuiTooltip-arrow": {
                color: "rgba(15, 18, 29, 0.8)",
              },
            },
          },
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -8],
                },
              },
            ],
          },
        }}
        title={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: wrap ? "normal" : "nowrap",
            }}
          >
            {title}
          </Box>
        }
      >
        {children}
      </Tooltip>
    </div>
  );
};
