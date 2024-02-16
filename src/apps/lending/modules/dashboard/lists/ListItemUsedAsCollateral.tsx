import { Switch } from "@mui/material";

import { ListItemIsolationBadge } from "apps/lending/modules/dashboard/lists/ListItemIsolationBadge";
import { FC, memo } from "react";

interface ListItemUsedAsCollateralProps {
  isIsolated: boolean;
  usageAsCollateralEnabledOnUser: boolean;
  canBeEnabledAsCollateral: boolean;
  onToggleSwitch: () => void;
  // directly disable without additional canBeEnabledAsCollateral check for migration page
  disabled?: boolean;
}

export const ListItemUsedAsCollateral: FC<ListItemUsedAsCollateralProps> = memo(
  ({
    isIsolated,
    usageAsCollateralEnabledOnUser,
    canBeEnabledAsCollateral,
    onToggleSwitch,
    disabled,
  }) => {
    const isEnabled =
      usageAsCollateralEnabledOnUser && canBeEnabledAsCollateral;
    return (
      <>
        {!isIsolated ? (
          <Switch
            onClick={onToggleSwitch}
            disableRipple
            checked={isEnabled}
            disabled={!canBeEnabledAsCollateral || disabled}
          />
        ) : (
          <ListItemIsolationBadge>
            <Switch
              onClick={onToggleSwitch}
              disableRipple
              checked={isEnabled}
              disabled={!canBeEnabledAsCollateral || disabled}
            />
          </ListItemIsolationBadge>
        )}
      </>
    );
  }
);
