import { Link } from "apps/lending/components/primitives/Link";
import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

interface ReserveFactorTooltipProps extends TextWithTooltipProps {
  collectorLink?: string;
}

export const ReserveFactorTooltip: FC<ReserveFactorTooltipProps> = ({
  collectorLink,
  ...rest
}) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        Reserve factor is a percentage of interest which goes to a{" "}
        {collectorLink ? (
          <Link href={collectorLink}>collector contract</Link>
        ) : (
          "collector contract"
        )}{" "}
        that is controlled by Fathom governance to promote ecosystem growth.{" "}
      </>
    </TextWithTooltip>
  );
};
