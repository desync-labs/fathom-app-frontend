import { valueToBigNumber } from "@into-the-fathom/lending-math-utils";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { TypographyProps } from "@mui/material/Typography";
import BigNumber from "bignumber.js";

import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { FC } from "react";

interface HealthFactorNumberProps extends TypographyProps {
  value: string;
  onInfoClick?: () => void;
  HALIntegrationComponent?: React.ReactNode;
}

export const HealthFactorNumber: FC<HealthFactorNumberProps> = ({
  value,
  onInfoClick,
  HALIntegrationComponent,
  ...rest
}) => {
  const { palette } = useTheme();

  const formattedHealthFactor = Number(
    valueToBigNumber(value).toFixed(2, BigNumber.ROUND_DOWN)
  );
  let healthFactorColor;
  if (formattedHealthFactor >= 3) {
    healthFactorColor = palette.success.main;
  } else if (formattedHealthFactor < 1.1) {
    healthFactorColor = palette.error.main;
  } else {
    healthFactorColor = palette.warning.main;
  }

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: { xs: "center" },
        flexDirection: "row",
        gap: { xs: "7px", sm: "0" },
      }}
      data-cy={"HealthFactorTopPannel"}
    >
      {value === "-1" ? (
        <Typography variant="secondary14" color={palette.success.main}>
          ∞
        </Typography>
      ) : (
        <FormattedNumber
          value={formattedHealthFactor}
          sx={{ color: healthFactorColor, ...rest.sx }}
          visibleDecimals={2}
          compact
          {...rest}
        />
      )}

      {onInfoClick && (
        <Button
          onClick={onInfoClick}
          variant="surface"
          size="small"
          sx={{ minWidth: "unset", ml: { xs: 0, xsm: 1 } }}
        >
          Risk details
        </Button>
      )}

      {HALIntegrationComponent && (
        <Box ml={{ xs: 0, xsm: 1 }} mt={{ xs: 0.5, xsm: 0 }}>
          {HALIntegrationComponent}
        </Box>
      )}
    </Box>
  );
};
