import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const MaxLTVTooltip: FC<TextWithTooltipProps> = ({ ...rest }) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        The Maximum LTV ratio represents the maximum borrowing power of a
        specific collateral. For example, if a collateral has an LTV of 75%, the
        user can borrow up to 0.75 worth of XDC in the principal currency for
        every 1 XDC worth of collateral.
      </>
    </TextWithTooltip>
  );
};
