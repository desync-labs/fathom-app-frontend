import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const TotalSupplyAPYTooltip: FC<TextWithTooltipProps> = ({
  ...rest
}) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        The weighted average of APY for all supplied assets, including
        incentives.
      </>
    </TextWithTooltip>
  );
};
