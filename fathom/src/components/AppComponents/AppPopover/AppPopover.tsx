import React, {
  FC,
  ReactNode,
  useState
} from "react";
import {
  Popover,
  Typography
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";

const AppPopoverWrapper = styled(Popover)`
  .MuiPaper-root {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    padding: 8px 12px;
    color: #000C24;
    max-width: 400px;

    p {
      font-size: 13px;
      line-height: 16px;
    }
  }
`;


type AppPopoverProps = {
  id: string,
  text: ReactNode
}

const AppPopover: FC<AppPopoverProps> = ({
  id,
  text
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <span
        style={{ cursor: "pointer" }}
        aria-owns={open ? id : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <InfoIcon sx={{ fontSize: "18px" }} />
      </span>
      <AppPopoverWrapper
        id={id}
        sx={{
          pointerEvents: "none"
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>{text}</Typography>
      </AppPopoverWrapper>
    </>
  );
};

export default AppPopover;