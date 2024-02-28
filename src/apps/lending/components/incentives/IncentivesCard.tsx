import { ReserveIncentiveResponse } from "@into-the-fathom/lending-math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";
import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { NoData } from "apps/lending/components/primitives/NoData";
import { IncentivesButton } from "apps/lending/components/incentives/IncentivesButton";

interface IncentivesCardProps {
  symbol: string;
  value: string | number;
  incentives?: ReserveIncentiveResponse[];
  variant?: "main14" | "main16" | "secondary14";
  symbolsVariant?: "secondary14" | "secondary16";
  align?: "center" | "flex-end";
  color?: string;
  tooltip?: ReactNode;
}

export const IncentivesCard: FC<IncentivesCardProps> = ({
  symbol,
  value,
  incentives,
  variant = "secondary14",
  symbolsVariant,
  align,
  color,
  tooltip,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: align || { xs: "flex-end", xsm: "center" },
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {value.toString() !== "-1" ? (
        <Box sx={{ display: "flex" }}>
          <FormattedNumber
            data-cy={`apy`}
            value={value}
            percent
            variant={variant}
            symbolsVariant={symbolsVariant}
            color={color}
            symbolsColor={color}
          />
          {tooltip}
        </Box>
      ) : (
        <NoData variant={variant} color={"text.secondary"} />
      )}

      <IncentivesButton incentives={incentives} symbol={symbol} />
    </Box>
  );
};
