import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";

export const CollateralTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        The total amount of your assets denominated in USD that can be used as
        collateral for borrowing assets.
      </>
    </TextWithTooltip>
  );
};
