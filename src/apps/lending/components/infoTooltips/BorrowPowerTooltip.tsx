import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const BorrowPowerTooltip: FC<TextWithTooltipProps> = ({ ...rest }) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        The % of your total borrowing power used. This is based on the amount of
        your collateral supplied and the total amount that you can borrow.
      </>
    </TextWithTooltip>
  );
};
