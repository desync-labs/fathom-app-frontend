import { AlertProps } from "@mui/material";
import { AssetCapData } from "apps/lending/hooks/useAssetCaps";

import { Warning } from "apps/lending/components/primitives/Warning";
import { FC } from "react";

type DebtCeilingWarningProps = AlertProps & {
  debtCeiling: AssetCapData;
  icon?: boolean;
};

export const DebtCeilingWarning: FC<DebtCeilingWarningProps> = ({
  debtCeiling,
  icon = true,
  ...rest
}) => {
  // Don't show a warning when less than 98% utilized
  if (!debtCeiling.percentUsed || debtCeiling.percentUsed < 98) return null;

  const severity = debtCeiling.isMaxed ? "error" : "warning";

  const renderText = () => {
    return debtCeiling.isMaxed ? (
      <>
        Protocol debt ceiling is at 100% for this asset. Further borrowing
        against this asset is unavailable.
      </>
    ) : (
      <>
        Maximum amount available to borrow against this asset is limited because
        debt ceiling is at {debtCeiling.percentUsed.toFixed(2)}%.
      </>
    );
  };

  return (
    <Warning severity={severity} icon={icon} {...rest}>
      {renderText()}
    </Warning>
  );
};
