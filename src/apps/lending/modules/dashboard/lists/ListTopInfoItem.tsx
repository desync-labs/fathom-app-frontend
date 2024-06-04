import { Paper, Typography } from "@mui/material";
import { FC, memo, ReactNode } from "react";

import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";

interface ListTopInfoItemProps {
  title: ReactNode;
  value: number | string;
  percent?: boolean;
  tooltip?: ReactNode;
}

export const ListTopInfoItem: FC<ListTopInfoItemProps> = memo(
  ({ title, value, percent, tooltip }) => {
    return (
      <Paper
        variant="outlined"
        sx={{
          mr: 1,
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          boxShadow: "none",
          bgcolor: "transparent",
          border: "none",
          color: "primary.light",
        }}
      >
        <Typography sx={{ mr: 0.5 }} noWrap>
          {title}
        </Typography>
        <FormattedNumber
          value={value}
          percent={percent}
          variant="secondary14"
          symbol="USD"
        />

        {tooltip}
      </Paper>
    );
  }
);
