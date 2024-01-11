import { ExclamationIcon } from "@heroicons/react/outline";
import { SvgIcon } from "@mui/material";

import { ContentWithTooltip } from "apps/lending/components/ContentWithTooltip";
import { CapType } from "apps/lending/components/caps/helper";

interface CapsTooltipProps {
  availableValue: number;
  isUSD?: boolean;
  capType: CapType;
}

export const CapsTooltip = ({
  availableValue,
  isUSD,
  capType,
}: CapsTooltipProps) => {
  const messageValue = isUSD ? `${availableValue}$` : availableValue;

  let message = undefined;
  if (availableValue > 0) {
    message =
      capType === CapType.supplyCap ? (
        <>
          This asset has almost reached its supply cap. There can only be{" "}
          {messageValue} supplied to this market.
        </>
      ) : (
        <>
          This asset has almost reached its borrow cap. There is only{" "}
          {messageValue} available to be borrowed from this market.
        </>
      );
  } else if (availableValue <= 0) {
    message =
      capType === CapType.supplyCap ? (
        <>
          This asset has reached its supply cap. Nothing is available to be
          supplied from this market.
        </>
      ) : (
        <>
          This asset has reached its borrow cap. Nothing is available to be
          borrowed from this market.
        </>
      );
  }

  return (
    <ContentWithTooltip tooltipContent={<>{message || ""}</>}>
      <SvgIcon sx={{ fontSize: "14px", color: "error.main" }}>
        <ExclamationIcon />
      </SvgIcon>
    </ContentWithTooltip>
  );
};
