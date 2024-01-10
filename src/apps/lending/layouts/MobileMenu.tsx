import { MenuIcon } from "@heroicons/react/outline";
import { Trans } from "@lingui/macro";
import { Box, Button, Divider, List, SvgIcon, Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { PROD_ENV } from "apps/lending/utils/marketsAndNetworksConfig";

import { DrawerWrapper } from "apps/lending/layouts/components/DrawerWrapper";
import { LanguagesList } from "apps/lending/layouts/components/LanguageSwitcher";
import { MobileCloseButton } from "./components/MobileCloseButton";
import { NavItems } from "apps/lending/layouts/components/NavItems";
import { TestNetModeSwitcher } from "apps/lending/layouts/components/TestNetModeSwitcher";

interface MobileMenuProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  headerHeight: number;
}

const MenuItemsWrapper = ({
  children,
  title,
}: {
  children: ReactNode;
  title: ReactNode;
}) => (
  <Box
    sx={{
      mb: 6,
      "&:last-of-type": { mb: 0, ".MuiDivider-root": { display: "none" } },
    }}
  >
    <Box sx={{ px: 2 }}>
      <Typography
        variant="subheader2"
        sx={{ color: "text.primary", px: 4, py: 2 }}
      >
        {title}
      </Typography>

      {children}
    </Box>

    <Divider sx={{ borderColor: "#F2F3F729", mt: 6 }} />
  </Box>
);

export const MobileMenu = ({
  open,
  setOpen,
  headerHeight,
}: MobileMenuProps) => {
  const [isLanguagesListOpen, setIsLanguagesListOpen] = useState(false);

  useEffect(() => setIsLanguagesListOpen(false), [open]);

  return (
    <>
      {open ? (
        <MobileCloseButton setOpen={setOpen} />
      ) : (
        <Button
          id="settings-button-mobile"
          variant="surface"
          sx={{ p: "7px 8px", minWidth: "unset", ml: 2 }}
          onClick={() => setOpen(true)}
        >
          <SvgIcon sx={{ color: "#F1F1F3" }} fontSize="small">
            <MenuIcon />
          </SvgIcon>
        </Button>
      )}

      <DrawerWrapper open={open} setOpen={setOpen} headerHeight={headerHeight}>
        {!isLanguagesListOpen ? (
          <>
            <MenuItemsWrapper title={<Trans>Menu</Trans>}>
              <NavItems setOpen={setOpen} />
            </MenuItemsWrapper>
            <MenuItemsWrapper title={<Trans>Global settings</Trans>}>
              <List>
                {/* <DarkModeSwitcher /> */}
                {PROD_ENV && <TestNetModeSwitcher />}
                {/* <LanguageListItem onClick={() => setIsLanguagesListOpen(true)} /> */}
              </List>
            </MenuItemsWrapper>
          </>
        ) : (
          <List sx={{ px: 2 }}>
            <LanguagesList onClick={() => setIsLanguagesListOpen(false)} />
          </List>
        )}
      </DrawerWrapper>
    </>
  );
};
