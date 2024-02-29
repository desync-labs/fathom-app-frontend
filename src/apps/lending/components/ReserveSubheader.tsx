import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { FC } from "react";

type ReserveSubheaderProps = {
  value: string;
  rightAlign?: boolean;
};

export const ReserveSubheader: FC<ReserveSubheaderProps> = ({
  value,
  rightAlign,
}) => {
  return (
    <Box
      sx={{
        p: rightAlign
          ? { xs: "0", xsm: "2px 0" }
          : { xs: "0", xsm: "3.625px 0px" },
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {value === "Disabled" ? (
        <Typography
          component="span"
          sx={{ mr: 0.25 }}
          variant="secondary12"
          color="text.muted"
        >
          Disabled
        </Typography>
      ) : (
        <FormattedNumber
          compact
          value={value}
          variant="secondary12"
          color="text.secondary"
          symbolsVariant="secondary12"
          symbolsColor="text.secondary"
          symbol="USD"
        />
      )}
    </Box>
  );
};
