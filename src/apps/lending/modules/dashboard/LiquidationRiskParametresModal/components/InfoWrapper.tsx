import { AlertColor, Box, Typography } from "@mui/material";
import { FC, memo, ReactNode } from "react";

interface InfoWrapperProps {
  topValue: ReactNode;
  topTitle: ReactNode;
  topDescription: ReactNode;
  children: ReactNode;
  bottomText: ReactNode;
  color: AlertColor;
}

export const InfoWrapper: FC<InfoWrapperProps> = memo(
  ({ topValue, topTitle, topDescription, children, bottomText, color }) => {
    return (
      <Box
        sx={(theme) => ({
          border: `1px solid ${theme.palette.divider}`,
          mb: 3,
          borderRadius: "6px",
          px: 2,
          pt: 2,
          pb: 3,
          "&:last-of-type": {
            mb: 0,
          },
        })}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ width: "calc(100% - 72px)" }}>
            <Typography variant="subheader1" mb={0.5} color="text.light">
              {topTitle}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {topDescription}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${color}.main`,
            }}
          >
            {topValue}
          </Box>
        </Box>

        <Box>{children}</Box>

        <Typography
          variant="secondary12"
          color="text.secondary"
          textAlign="left"
        >
          {bottomText}
        </Typography>
      </Box>
    );
  }
);
