import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const NetAPYTooltip: FC<TextWithTooltipProps> = ({ ...rest }) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        Net APY is the combined effect of all supply and borrow positions on net
        worth, including incentives. It is possible to have a negative net APY
        if debt APY is higher than supply APY.
      </>
    </TextWithTooltip>
  );
};
