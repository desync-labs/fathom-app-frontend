import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

export interface ListColumnProps {
  children?: ReactNode;
  maxWidth?: number;
  minWidth?: number;
  isRow?: boolean;
  align?: "left" | "center" | "right";
  overFlow?: "hidden" | "visible";
  flex?: string | number;
  p?: string | number;
}

export const ListColumn: FC<ListColumnProps> = ({
  isRow,
  children,
  minWidth,
  maxWidth,
  align = "center",
  overFlow = "visible",
  flex = 1,
  p = 0.5,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        alignItems: isRow
          ? "center"
          : align === "left"
          ? "flex-start"
          : align === "right"
          ? "flex-end"
          : align,
        justifyContent: isRow ? "flex-start" : "flex-end",
        flex,
        minWidth: minWidth || "60px",
        maxWidth,
        overflow: overFlow,
        padding: p,
      }}
    >
      {children}
    </Box>
  );
};
