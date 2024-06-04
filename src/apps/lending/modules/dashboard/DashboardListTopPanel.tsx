import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { FaucetButton } from "apps/lending/components/FaucetButton";
import { useRootStore } from "apps/lending/store/root";
import { DEV_ENV } from "apps/lending/utils/marketsAndNetworksConfig";
import { DASHBOARD } from "apps/lending/utils/mixPanelEvents";

import { BridgeButton } from "apps/lending/components/BridgeButton";
import { toggleLocalStorageClick } from "apps/lending/helpers/toggle-local-storage-click";
import { NetworkConfig } from "apps/lending/ui-config/networksConfig";
import { FC, memo } from "react";

interface DashboardListTopPanelProps extends Pick<NetworkConfig, "bridge"> {
  value: boolean;
  onClick: (value: boolean) => void;
  localStorageName: string;
}

export const DashboardListTopPanel: FC<DashboardListTopPanelProps> = memo(
  ({ value, onClick, localStorageName, bridge }) => {
    const trackEvent = useRootStore((store) => store.trackEvent);

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", xsm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column-reverse", xsm: "row" },
          px: { xs: 2, xsm: 3 },
          py: 1,
          pl: { xs: "18px", xsm: "27px" },
        }}
      >
        <FormControlLabel
          sx={{ mt: { xs: 2, sm: 0 } }}
          control={<Checkbox sx={{ p: "6px" }} />}
          checked={value}
          onChange={() => {
            trackEvent(DASHBOARD.SHOW_ASSETS_0_BALANCE, {});

            toggleLocalStorageClick(value, onClick, localStorageName);
          }}
          label={"Show assets with 0 balance"}
        />
        {DEV_ENV && <FaucetButton />}
        <BridgeButton bridge={bridge} />
      </Box>
    );
  }
);
