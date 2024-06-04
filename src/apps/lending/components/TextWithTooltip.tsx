import InfoIcon from "@mui/icons-material/Info";
import { Box, BoxProps, IconButton, SvgIcon, Typography } from "@mui/material";
import { TypographyProps } from "@mui/material/Typography";
import {
  FC,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useState,
} from "react";
import { TrackEventProps } from "apps/lending/store/analyticsSlice";
import { useRootStore } from "apps/lending/store/root";

import { ContentWithTooltip } from "apps/lending/components/ContentWithTooltip";

export interface TextWithTooltipProps extends TypographyProps {
  text?: ReactNode;
  icon?: ReactNode;
  iconSize?: number;
  iconColor?: string;
  iconMargin?: number;
  textColor?: string;
  // eslint-disable-next-line
  children?: ReactElement<any, string | JSXElementConstructor<any>>;
  wrapperProps?: BoxProps;
  event?: TrackEventProps;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export const TextWithTooltip: FC<TextWithTooltipProps> = ({
  text,
  icon,
  iconSize = 15,
  iconColor,
  iconMargin,
  children,
  textColor,
  wrapperProps: { sx: boxSx, ...boxRest } = {},
  event,
  open: openProp = false,
  setOpen: setOpenProp,
  ...rest
}) => {
  const [open, setOpen] = useState(openProp);
  const trackEvent = useRootStore((store) => store.trackEvent);

  const toggleOpen = () => {
    if (setOpenProp) setOpenProp(!open);
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", ...boxSx }} {...boxRest}>
      {text && (
        <Typography {...rest} color={textColor}>
          {text}
        </Typography>
      )}

      <ContentWithTooltip
        tooltipContent={<>{children}</>}
        open={open}
        setOpen={toggleOpen}
      >
        <IconButton
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: iconSize,
            height: iconSize,
            borderRadius: "50%",
            p: 0,
            minWidth: 0,
            ml: iconMargin || 0.25,
          }}
          onClick={() => {
            if (event) {
              trackEvent(event.eventName, { ...event.eventParams });
            }
          }}
        >
          <SvgIcon
            sx={{
              fontSize: iconSize,
              color: iconColor
                ? iconColor
                : open
                ? "other.fathomAccentMute"
                : "text.muted",
              borderRadius: "50%",
              "&:hover": { color: iconColor || "other.fathomAccent" },
            }}
          >
            {icon || <InfoIcon />}
          </SvgIcon>
        </IconButton>
      </ContentWithTooltip>
    </Box>
  );
};
