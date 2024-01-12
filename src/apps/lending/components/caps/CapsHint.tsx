import { valueToBigNumber } from "@into-the-fathom/lending-math-utils";
import { Box, Typography } from "@mui/material";

import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { CapsTooltip } from "apps/lending/components/caps/CapsTooltip";
import { CapType } from "apps/lending/components/caps/helper";
import { FC } from "react";

interface CapsHintProps {
  capType: CapType;
  capAmount: string;
  totalAmount: string | number;
  isUSD?: boolean;
  withoutText?: boolean;
}

export const CapsHint: FC<CapsHintProps> = ({
  capType,
  capAmount,
  totalAmount,
  isUSD,
  withoutText,
}) => {
  const cap = Number(capAmount);
  if (cap <= 0) return null;

  const percentageOfCap = valueToBigNumber(totalAmount)
    .dividedBy(cap)
    .toNumber();
  const value = valueToBigNumber(cap)
    .minus(totalAmount)
    .multipliedBy("0.995")
    .toNumber();

  const title =
    capType === CapType.supplyCap
      ? "Available to supply"
      : "Available to borrow";

  if (percentageOfCap < 0.99) return null;

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", ml: withoutText ? 1 : 0 }}
    >
      <CapsTooltip availableValue={value} isUSD={isUSD} capType={capType} />

      {!withoutText && (
        <>
          <Typography variant="tooltip" color="text.secondary">
            {title}
          </Typography>
          <FormattedNumber
            value={value >= 0 ? value : 0}
            compact
            symbol={isUSD ? "USD" : undefined}
            variant="tooltip"
          />
        </>
      )}
    </Box>
  );
};
