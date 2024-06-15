import React, { FC, memo, useState } from "react";
import { Box, Button, styled, SvgIcon, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import { EmodeModalType } from "apps/lending/components/transactions/Emode/EmodeModalContent";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useRootStore } from "apps/lending/store/root";
import { DASHBOARD, GENERAL } from "apps/lending/utils/mixPanelEvents";

import { Row } from "apps/lending/components/primitives/Row";
import { TypographyGradient } from "apps/lending/components/primitives/TypographyGradient";
import { getEmodeMessage } from "apps/lending/components/transactions/Emode/EmodeNaming";

import SettingsIcon from "@mui/icons-material/Settings";
import BoltIcon from "@mui/icons-material/Bolt";

interface DashboardEModeButtonProps {
  userEmodeCategoryId: number;
}

const EModeWrapper = styled(Box)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: 16px;
  }
`;

export const DashboardEModeButton: FC<DashboardEModeButtonProps> = memo(
  ({ userEmodeCategoryId }) => {
    const { openEmode } = useModalContext();
    const { eModes: _eModes } = useAppDataContext();
    const trackEvent = useRootStore((store) => store.trackEvent);

    const iconButtonSize = 12;

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const open = Boolean(anchorEl);
    const handleClick = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      trackEvent(DASHBOARD.E_MODE_INFO_DASHBOARD, { userEmodeCategoryId });

      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const isEModeDisabled = userEmodeCategoryId === 0;

    const EModeLabelMessage = () => (
      <>{getEmodeMessage(_eModes[userEmodeCategoryId].label)}</>
    );

    const eModes = Object.keys(_eModes).length;

    return (
      <EModeWrapper
        sx={{ display: "inline-flex", alignItems: "center" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Typography mr={1} variant="description" color="text.secondary">
          E-Mode
        </Typography>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleClick(e);
          }}
          data-cy={`emode-open`}
          size="small"
          variant="outlined"
          sx={(theme) => ({
            ml: 1,
            borderRadius: "4px",
            p: 0,
            "&:after": {
              content: "''",
              position: "absolute",
              left: -1,
              right: -1,
              bottom: -1,
              top: -1,
              background: isEModeDisabled
                ? "transparent"
                : theme.palette.gradients?.fathomMainGradient,
              borderRadius: "4px",
            },
          })}
        >
          <Box
            sx={(theme) => ({
              display: "inline-flex",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
              bgcolor: isEModeDisabled
                ? open
                  ? theme.palette.background.disabled
                  : theme.palette.background.surface
                : theme.palette.background.paper,
              px: "4px",
              borderRadius: "4px",
            })}
          >
            {isEModeDisabled ? <BoltIcon /> : null}

            {isEModeDisabled ? (
              <Typography variant="buttonS" color="text.secondary">
                <EModeLabelMessage />
              </Typography>
            ) : (
              <TypographyGradient variant="buttonS">
                <EModeLabelMessage />
              </TypographyGradient>
            )}

            <SvgIcon
              sx={{
                fontSize: iconButtonSize,
                ml: "4px",
                color: "primary.light",
              }}
            >
              <SettingsIcon />
            </SvgIcon>
          </Box>
        </Button>

        <Menu
          open={open}
          anchorEl={anchorEl}
          sx={{ ".MuiMenu-paper": { maxWidth: "280px" } }}
          onClose={handleClose}
          keepMounted={true}
        >
          <Box sx={{ px: 4, pt: 2, pb: 3 }}>
            <Typography variant="subheader1" mb={isEModeDisabled ? 1 : 3}>
              Efficiency mode (E-Mode)
            </Typography>

            {!isEModeDisabled && (
              <Box>
                <Typography mb={1} variant="caption" color="text.secondary">
                  Asset category
                </Typography>

                <Box
                  sx={(theme) => ({
                    p: 2,
                    mb: 3,
                    borderRadius: "6px",
                    border: `1px solid ${theme.palette.divider}`,
                  })}
                >
                  <Row
                    caption={
                      <Box
                        sx={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <Typography variant="subheader2" color="text.primary">
                          <EModeLabelMessage />
                        </Typography>
                      </Box>
                    }
                  >
                    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          bgcolor: "success.main",
                          boxShadow:
                            "0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)",
                          mr: "5px",
                        }}
                      />
                      <Typography variant="subheader2" color="success.main">
                        Enabled
                      </Typography>
                    </Box>
                  </Row>
                </Box>
              </Box>
            )}

            <Typography variant="caption" color="text.secondary" mb={4}>
              E-Mode increases your LTV for a selected category of assets up to
              97%.
            </Typography>

            {isEModeDisabled ? (
              <Button
                fullWidth
                variant={"gradient"}
                onClick={() => {
                  trackEvent(GENERAL.OPEN_MODAL, {
                    type: "Enable E-Mode",
                    data: userEmodeCategoryId,
                  });

                  openEmode(EmodeModalType.ENABLE);
                  handleClose();
                }}
                data-cy={"emode-enable"}
              >
                Enable E-Mode
              </Button>
            ) : (
              <>
                {eModes > 2 && (
                  <Button
                    fullWidth
                    sx={{ mb: "6px" }}
                    variant={"outlined"}
                    onClick={() => {
                      trackEvent(GENERAL.OPEN_MODAL, {
                        modal: "Switch E-Mode",
                        data: userEmodeCategoryId,
                      });

                      openEmode(EmodeModalType.SWITCH);
                      handleClose();
                    }}
                    data-cy={"emode-switch"}
                  >
                    Switch E-Mode category
                  </Button>
                )}
                <Button
                  fullWidth
                  variant={"outlined"}
                  onClick={() => {
                    trackEvent(DASHBOARD.E_MODE, {
                      type: "Disable E-Mode",
                      data: userEmodeCategoryId,
                    });

                    openEmode(EmodeModalType.DISABLE);
                    handleClose();
                  }}
                  data-cy={"emode-disable"}
                >
                  Disable E-Mode
                </Button>
              </>
            )}
          </Box>
        </Menu>
      </EModeWrapper>
    );
  }
);
