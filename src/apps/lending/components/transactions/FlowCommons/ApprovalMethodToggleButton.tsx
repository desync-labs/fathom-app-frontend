import { useState, MouseEvent, FC } from "react";
import {
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
} from "@mui/material";
import { ApprovalMethod } from "apps/lending/store/walletSlice";

import SettingsIcon from "@mui/icons-material/Settings";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

interface ApprovalMethodToggleButtonProps {
  currentMethod: ApprovalMethod;
  setMethod: (newMethod: ApprovalMethod) => void;
}

export const ApprovalMethodToggleButton: FC<
  ApprovalMethodToggleButtonProps
> = ({ currentMethod, setMethod }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          color: "other.fathomLink",
        }}
        data-cy={`approveButtonChange`}
      >
        <Typography variant="subheader2" color="other.fathomLink">
          {currentMethod}
        </Typography>
        <SvgIcon sx={{ fontSize: 16, ml: 0.5, color: "other.fathomLink" }}>
          <SettingsIcon />
        </SvgIcon>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        keepMounted={true}
        data-cy={`approveMenu_${currentMethod}`}
      >
        <MenuItem
          data-cy={`approveOption_${ApprovalMethod.PERMIT}`}
          selected={currentMethod === ApprovalMethod.PERMIT}
          value={ApprovalMethod.PERMIT}
          onClick={() => {
            if (currentMethod === ApprovalMethod.APPROVE) {
              setMethod(ApprovalMethod.PERMIT);
            }
            handleClose();
          }}
        >
          <ListItemText primaryTypographyProps={{ variant: "subheader1" }}>
            {ApprovalMethod.PERMIT}
          </ListItemText>
          <ListItemIcon>
            <SvgIcon>
              {currentMethod === ApprovalMethod.PERMIT && <DoneRoundedIcon />}
            </SvgIcon>
          </ListItemIcon>
        </MenuItem>

        <MenuItem
          data-cy={`approveOption_${ApprovalMethod.APPROVE}`}
          selected={currentMethod === ApprovalMethod.APPROVE}
          value={ApprovalMethod.APPROVE}
          onClick={() => {
            if (currentMethod === ApprovalMethod.PERMIT) {
              setMethod(ApprovalMethod.APPROVE);
            }
            handleClose();
          }}
        >
          <ListItemText primaryTypographyProps={{ variant: "subheader1" }}>
            {ApprovalMethod.APPROVE}
          </ListItemText>
          <ListItemIcon>
            <SvgIcon>
              {currentMethod === ApprovalMethod.APPROVE && <DoneRoundedIcon />}
            </SvgIcon>
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </>
  );
};
