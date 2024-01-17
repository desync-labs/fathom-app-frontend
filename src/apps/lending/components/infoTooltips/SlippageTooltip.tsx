import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const SlippageTooltip: FC<TextWithTooltipProps> = ({ ...rest }) => {
  return (
    <TextWithTooltip
      event={{
        eventName: GENERAL.TOOL_TIP,
        eventParams: { tooltip: "Slippage Tolerance" },
      }}
      {...rest}
    >
      <>
        Slippage is the difference between the quoted and received amounts from
        changing market conditions between the moment the transaction is
        submitted and its verification.
      </>
    </TextWithTooltip>
  );
};
