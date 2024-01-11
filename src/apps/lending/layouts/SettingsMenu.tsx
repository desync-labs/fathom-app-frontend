import { CogIcon } from "@heroicons/react/solid";
import { Button, Menu, MenuItem, SvgIcon, Typography } from "@mui/material";
import React, { useState } from "react";
import { PROD_ENV } from "apps/lending/utils/marketsAndNetworksConfig";

import { TestNetModeSwitcher } from "apps/lending/layouts/components/TestNetModeSwitcher";

export const LANG_MAP = {
  en: "English",
  es: "Spanish",
  fr: "French",
  el: "Greek",
};

// Define the type for the language codes

// Example usage

export function SettingsMenu() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [languagesOpen, setLanguagesOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  //const trackEvent = useRootStore((store) => store.trackEvent);
  const handleSettingsClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
    setSettingsOpen(true);
    setLanguagesOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSettingsOpen(false);
    setLanguagesOpen(false);
  };

  return (
    <>
      <Button
        variant="surface"
        aria-label="settings"
        id="settings-button"
        aria-controls={settingsOpen ? "settings-menu" : undefined}
        aria-expanded={settingsOpen ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleSettingsClick}
        sx={{ p: "7px 8px", minWidth: "unset", ml: 2 }}
      >
        <SvgIcon sx={{ color: "#F1F1F3" }} fontSize="small">
          <CogIcon />
        </SvgIcon>
      </Button>

      <Menu
        id="settings-menu"
        MenuListProps={{
          "aria-labelledby": "settings-button",
        }}
        anchorEl={anchorEl}
        open={settingsOpen}
        onClose={handleClose}
        sx={{ ".MuiMenuItem-root.Mui-disabled": { opacity: 1 } }}
        keepMounted={true}
      >
        <MenuItem disabled sx={{ mb: "4px" }}>
          <Typography variant="subheader2" color="text.secondary">
            Global settings
          </Typography>
        </MenuItem>

        {/* <DarkModeSwitcher component={MenuItem} /> */}
        {PROD_ENV && <TestNetModeSwitcher />}
        {/* <LanguageListItem onClick={handleLanguageClick} component={MenuItem} /> */}
      </Menu>

      <Menu
        id="settings-menu"
        MenuListProps={{
          "aria-labelledby": "settings-button",
        }}
        anchorEl={anchorEl}
        open={languagesOpen}
        onClose={handleClose}
        keepMounted={true}
      ></Menu>
    </>
  );
}
