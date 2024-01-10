import { Trans } from "@lingui/macro";
import {
  Box,
  FormControlLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Switch,
  useTheme,
} from "@mui/material";
import { useRootStore } from "apps/lending/store/root";
import { SETTINGS } from "apps/lending/utils/mixPanelEvents";

import { ColorModeContext } from "apps/lending/layouts/AppGlobalStyles";
import { useContext } from "react";

interface DarkModeSwitcherProps {
  component?: typeof MenuItem | typeof ListItem;
}

export const DarkModeSwitcher = ({
  component = ListItem,
}: DarkModeSwitcherProps) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <Box
      component={component}
      onClick={colorMode.toggleColorMode}
      sx={{
        color: { xs: "#F1F1F3", md: "text.primary" },
        py: { xs: 1.5, md: 2 },
      }}
    >
      <ListItemText>
        <Trans>Dark mode</Trans>
      </ListItemText>
      <FormControlLabel
        sx={{ mr: 0 }}
        value="darkmode"
        control={
          <Switch
            onClick={() =>
              trackEvent(SETTINGS.DARK_MODE, { mode: theme.palette.mode })
            }
            disableRipple
            checked={theme.palette.mode === "dark"}
            sx={{
              ".MuiSwitch-track": {
                bgcolor: { xs: "#FFFFFF1F", md: "primary.light" },
              },
            }}
          />
        }
        label={theme.palette.mode === "dark" ? "On" : "Off"}
        labelPlacement="start"
      />
    </Box>
  );
};
