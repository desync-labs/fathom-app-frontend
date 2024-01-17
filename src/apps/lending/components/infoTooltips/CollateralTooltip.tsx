import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const CollateralTooltip: FC<TextWithTooltipProps> = ({ ...rest }) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        The total amount of your assets denominated in USD that can be used as
        collateral for borrowing assets.
      </>
    </TextWithTooltip>
  );
};
