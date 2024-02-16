import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const StableAPYTooltip: FC<TextWithTooltipProps> = ({ ...rest }) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        Stable interest rate will <b>stay the same</b> for the duration of your
        loan. Recommended for long-term loan periods and for users who prefer
        predictability.
      </>
    </TextWithTooltip>
  );
};
