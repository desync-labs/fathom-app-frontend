import { cloneElement, FC, ReactElement, ReactNode, useState } from "react";
import { Popover, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";

const PopoverWrapper = styled(Popover)<{ type: PopoverType }>`
  .MuiPaper-root {
    background: ${({ type }) =>
      type === PopoverType.Error ? "#FF6767" : "#3D5580"};
    box-shadow: 0 4px 40px 0 rgba(0, 7, 21, 0.3);
    color: #fff;
    max-width: 400px;
    border-radius: 12px;
    padding: 12px 16px;

    p {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    .MuiPaper-root {
      max-width: 350px;
      p {
        font-size: 12px;
        line-height: 15px;
      }
    }
  }
`;

export enum PopoverType {
  Info = "info",
  Error = "error",
}

type AppPopoverProps = {
  id: string;
  text: ReactNode;
  element?: ReactElement;
  type?: PopoverType;
  iconSize?: string;
  iconColor?: string;
};

const BasePopover: FC<AppPopoverProps> = ({
  id,
  text,
  element,
  type = PopoverType.Info,
  iconSize = "16px",
  iconColor = "#6379A1",
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {element ? (
        cloneElement(element, {
          onMouseEnter: handlePopoverOpen,
          onMouseLeave: handlePopoverClose,
          "aria-owns": open ? id : undefined,
          style: { cursor: "pointer" },
        })
      ) : (
        <span
          style={{ display: "inline-flex", cursor: "pointer" }}
          aria-owns={open ? id : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <InfoIcon sx={{ fontSize: iconSize, color: iconColor }} />
        </span>
      )}
      <PopoverWrapper
        id={id}
        sx={{
          pointerEvents: "none",
        }}
        type={type}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>{text}</Typography>
      </PopoverWrapper>
    </>
  );
};

export default BasePopover;
