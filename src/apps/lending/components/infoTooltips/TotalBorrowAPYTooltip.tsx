import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const TotalBorrowAPYTooltip: FC<TextWithTooltipProps> = ({
  ...rest
}) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        The weighted average of APY for all borrowed assets, including
        incentives.
      </>
    </TextWithTooltip>
  );
};
