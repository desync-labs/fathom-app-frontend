import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
} from "@mui/material";
import { SlippageTooltip } from "apps/lending/components/infoTooltips/SlippageTooltip";
import { useRootStore } from "apps/lending/store/root";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { ReactComponent as Paraswap } from "apps/lending/assets/paraswap.svg";
import { useState } from "react";

interface ListSlippageButtonProps {
  setSlippage: (value: string) => void;
  selectedSlippage: string;
}

export const ListSlippageButton = ({
  setSlippage,
  selectedSlippage,
}: ListSlippageButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const values: string[] = ["0.1", "0.5", "1"];

  return (
    <>
      <Button
        variant="text"
        onClick={handleClick}
        size="medium"
        endIcon={
          <SlippageTooltip
            text={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <>
                  <Typography color="text.secondary" variant="description">
                    Slippage tolerance{" "}
                  </Typography>
                  <Typography
                    color="text.main"
                    variant="secondary14"
                    sx={{ px: "4px" }}
                  >
                    {selectedSlippage}%{" "}
                  </Typography>
                  <SvgIcon sx={{ fontSize: "14px !important", mr: "4px" }}>
                    {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </SvgIcon>
                </>
              </Box>
            }
            variant="secondary14"
          />
        }
        disabled={false}
        data-cy={`slippageButton_${selectedSlippage}`}
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        keepMounted={true}
        data-cy={`slippageMenu_${selectedSlippage}`}
      >
        <Box sx={{ px: "16px", py: "12px" }}>
          <Typography variant="secondary12" color="text.secondary">
            <>Select slippage tolerance</>
          </Typography>
        </Box>

        {values.map((slippageValue) => {
          const selected = slippageValue === selectedSlippage;

          return (
            <MenuItem
              key={slippageValue}
              selected={selected}
              value={slippageValue}
              onClick={() => {
                setSlippage(slippageValue);
                trackEvent(GENERAL.SET_SLIPPAGE, { amount: slippageValue });
                handleClose();
              }}
            >
              <ListItemText primaryTypographyProps={{ variant: "subheader1" }}>
                {slippageValue}%
              </ListItemText>
              <ListItemIcon>
                <SvgIcon>{selected && <CheckIcon />}</SvgIcon>
              </ListItemIcon>
            </MenuItem>
          );
        })}

        <Divider />
        <Box
          sx={{
            px: "16px",
            py: "12px",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="secondary12"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <>Powered by</>
            <SvgIcon
              sx={{
                fontSize: "20px",
                width: "20px",
                color: "#2669F5",
                position: "relative",
                top: "5px",
                left: "5px",
              }}
            >
              <Paraswap />
            </SvgIcon>
          </Typography>
          <Typography variant="main12" color="text.secondary">
            Paraswap
          </Typography>
        </Box>
      </Menu>
    </>
  );
};
