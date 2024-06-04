import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const APYTypeTooltip: FC<TextWithTooltipProps> = ({ ...rest }) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        Allows you to switch between <b>variable</b> and <b>stable</b> interest
        rates, where variable rate can increase and decrease depending on the
        amount of liquidity in the reserve, and stable rate will stay the same
        for the duration of your loan.
      </>
    </TextWithTooltip>
  );
};
