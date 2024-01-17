import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const CollateralSwitchTooltip: FC<TextWithTooltipProps> = ({
  ...rest
}) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        Allows you to decide whether to use a supplied asset as collateral. An
        asset used as collateral will affect your borrowing power and health
        factor.
      </>
    </TextWithTooltip>
  );
};
