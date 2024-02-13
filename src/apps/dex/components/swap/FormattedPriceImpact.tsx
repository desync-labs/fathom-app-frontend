import { Percent } from "into-the-fathom-swap-sdk";
import { ONE_BIPS } from "apps/dex/constants";
import { warningSeverity } from "apps/dex/utils/prices";
import { ErrorText } from "apps/dex/components/swap/styleds";
import { FC } from "react";

/**
 * Formatted version of a price impact text with warning colors
 */
type FormattedPriceImpactProps = {
  priceImpact?: Percent;
};

const FormattedPriceImpact: FC<FormattedPriceImpactProps> = ({
  priceImpact,
}) => {
  return (
    <ErrorText
      fontWeight={500}
      fontSize={14}
      severity={warningSeverity(priceImpact)}
    >
      {priceImpact
        ? priceImpact.lessThan(ONE_BIPS)
          ? "<0.01%"
          : `${priceImpact.toFixed(2)}%`
        : "-"}
    </ErrorText>
  );
};

export default FormattedPriceImpact;
