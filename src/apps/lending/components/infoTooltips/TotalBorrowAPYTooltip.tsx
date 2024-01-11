import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";

export const TotalBorrowAPYTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        The weighted average of APY for all borrowed assets, including
        incentives.
      </>
    </TextWithTooltip>
  );
};
