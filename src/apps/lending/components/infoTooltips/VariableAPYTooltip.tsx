import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const VariableAPYTooltip: FC<TextWithTooltipProps> = ({ ...rest }) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        Variable interest rate will <b>fluctuate</b> based on the market
        conditions. Recommended for short-term positions.
      </>
    </TextWithTooltip>
  );
};
