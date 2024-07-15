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
              bgcolor: "#fff",
              "& .MuiTooltip-arrow": {
                color: "#000c24",
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
