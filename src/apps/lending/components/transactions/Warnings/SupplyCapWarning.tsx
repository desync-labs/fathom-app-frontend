import { Trans } from "@lingui/macro";
import { AlertProps } from "@mui/material";
import { AssetCapData } from "apps/lending/hooks/useAssetCaps";

import { Link } from "apps/lending/components/primitives/Link";
import { Warning } from "apps/lending/components/primitives/Warning";

type SupplyCapWarningProps = AlertProps & {
  supplyCap: AssetCapData;
  icon?: boolean;
};

export const SupplyCapWarning = ({
  supplyCap,
  icon = true,
  ...rest
}: SupplyCapWarningProps) => {
  // Don't show a warning when less than 98% utilized
  if (!supplyCap.percentUsed || supplyCap.percentUsed < 98) return null;

  const severity = "warning";

  const renderText = () => {
    return supplyCap.isMaxed ? (
      <Trans>
        Protocol supply cap is at 100% for this asset. Further supply
        unavailable.
      </Trans>
    ) : (
      <Trans>
        Maximum amount available to supply is limited because protocol supply
        cap is at {supplyCap.percentUsed.toFixed(2)}%.
      </Trans>
    );
  };

  return (
    <Warning severity={severity} icon={icon} {...rest}>
      {renderText()}{" "}
      <Link
        href="https://docs.aave.com/developers/whats-new/supply-borrow-caps"
        underline="always"
      >
        <Trans>Learn more</Trans>
      </Link>
    </Warning>
  );
};
