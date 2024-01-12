import { Box } from "@mui/material";
import { FC, memo, ReactNode } from "react";
import { DASHBOARD_LIST_COLUMN_WIDTHS } from "apps/lending/utils/dashboardSortUtils";

interface ListButtonsColumnProps {
  children?: ReactNode;
  isColumnHeader?: boolean;
}

export const ListButtonsColumn: FC<ListButtonsColumnProps> = memo(
  ({ children, isColumnHeader = false }) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          maxWidth: DASHBOARD_LIST_COLUMN_WIDTHS.BUTTONS,
          minWidth: DASHBOARD_LIST_COLUMN_WIDTHS.BUTTONS,
          flex: isColumnHeader ? 1 : 1,
          ".MuiButton-root": {
            ml: "6px",
          },
        }}
      >
        {children}
      </Box>
    );
  }
);
