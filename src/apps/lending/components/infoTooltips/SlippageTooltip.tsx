import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";

export const SlippageTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip
      event={{
        eventName: GENERAL.TOOL_TIP,
        eventParams: { tooltip: "Slippage Tollerance" },
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
