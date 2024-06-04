import { Box, Typography } from "@mui/material";
import { FC } from "react";

interface GraphLegendProps {
  labels: { text: string; color: string }[];
}

export const GraphLegend: FC<GraphLegendProps> = ({
  labels = [
    { text: "test", color: "#000" },
    { text: "bla", color: "#ff0" },
  ],
}) => {
  return (
    <Box>
      {labels.map((label) => (
        <Box
          key={label.text}
          sx={{ display: "inline-flex", alignItems: "center", mr: 3 }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              backgroundColor: label.color,
              mr: "11px",
              borderRadius: "50%",
            }}
          />
          <Typography variant="description" color="text.secondary">
            {label.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
