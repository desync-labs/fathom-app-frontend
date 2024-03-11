import React, { FC, memo } from "react";
import { Box, IconButton, Modal, Paper, SvgIcon } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export interface BasicModalProps {
  open: boolean;
  children: React.ReactNode;
  setOpen: (value: boolean) => void;
  withCloseButton?: boolean;
  contentMaxWidth?: number;
}

export const BasicModal: FC<BasicModalProps> = memo(
  ({
    open,
    setOpen,
    withCloseButton = true,
    contentMaxWidth = 420,
    children,
    ...props
  }) => {
    const handleClose = () => setOpen(false);

    return (
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          ".MuiPaper-root": {
            outline: "none",
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        {...props}
        data-cy={"Modal"}
        className="LendingModal"
      >
        <Paper
          variant="outlined"
          sx={(theme) => ({
            position: "relative",
            margin: "10px",
            overflowY: "auto",
            width: "100%",
            maxWidth: { xs: "359px", xsm: `${contentMaxWidth}px` },
            maxHeight: "calc(100vh - 20px)",
            borderRadius: "16px",
            background: theme.palette.background.surface,
            borderColor: "#324567",
            p: "20px",
          })}
        >
          {children}

          {withCloseButton && (
            <Box
              sx={{
                position: "absolute",
                top: "8px",
                right: "48px",
                zIndex: 5,
              }}
            >
              <IconButton
                sx={{
                  borderRadius: "50%",
                  p: "8px",
                  minWidth: 0,
                  position: "absolute",
                }}
                onClick={handleClose}
                data-cy={"close-button"}
              >
                <SvgIcon sx={{ fontSize: "24px", color: "text.primary" }}>
                  <CloseRoundedIcon data-cy={"CloseModalIcon"} />
                </SvgIcon>
              </IconButton>
            </Box>
          )}
        </Paper>
      </Modal>
    );
  }
);
