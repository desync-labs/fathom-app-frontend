import { Trans } from "@lingui/macro";

import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";

export const VariableAPYTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
        Variable interest rate will <b>fluctuate</b> based on the market
        conditions. Recommended for short-term positions.
      </Trans>
    </TextWithTooltip>
  );
};
