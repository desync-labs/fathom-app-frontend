import { AlertProps } from "@mui/material";
import { AssetCapData } from "apps/lending/hooks/useAssetCaps";

import { Warning } from "apps/lending/components/primitives/Warning";
import { FC } from "react";

type BorrowCapWarningProps = AlertProps & {
  borrowCap: AssetCapData;
  icon?: boolean;
};

export const BorrowCapWarning: FC<BorrowCapWarningProps> = ({
  borrowCap,
  icon = true,
  ...rest
}) => {
  // Don't show a warning when less than 98% utilized
  if (!borrowCap.percentUsed || borrowCap.percentUsed < 98) return null;

  const severity = "warning";

  const renderText = () => {
    return borrowCap.isMaxed ? (
      <>
        Protocol borrow cap is at 100% for this asset. Further borrowing
        unavailable.
      </>
    ) : (
      <>
        Maximum amount available to borrow is limited because protocol borrow
        cap is nearly reached.
      </>
    );
  };

  return (
    <Warning severity={severity} icon={icon} {...rest}>
      {renderText()}
    </Warning>
  );
};
