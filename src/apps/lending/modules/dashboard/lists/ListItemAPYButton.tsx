import { FC, memo, MouseEvent, useState } from "react";
import { InterestRate } from "@into-the-fathom/lending-contract-helpers";
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
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { CustomMarket } from "apps/lending/ui-config/marketsConfig";

import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CheckIcon from "@mui/icons-material/Check";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface ListItemAPYButtonProps {
  stableBorrowRateEnabled: boolean;
  borrowRateMode: string;
  disabled: boolean;
  onClick: () => void;
  stableBorrowAPY: string;
  variableBorrowAPY: string;
  underlyingAsset: string;
  currentMarket: CustomMarket;
}

export const ListItemAPYButton: FC<ListItemAPYButtonProps> = memo(
  ({
    stableBorrowRateEnabled,
    borrowRateMode,
    disabled,
    onClick,
    stableBorrowAPY,
    variableBorrowAPY,
    underlyingAsset,
    currentMarket,
  }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <Button
          variant="outlined"
          onClick={handleClick}
          size="small"
          endIcon={
            stableBorrowRateEnabled && (
              <SvgIcon sx={{ fontSize: "20px" }}>
                {open ? (
                  <KeyboardArrowUpRoundedIcon />
                ) : (
                  <KeyboardArrowDownRoundedIcon />
                )}
              </SvgIcon>
            )
          }
          disabled={disabled}
          data-cy={`apyButton_${borrowRateMode}`}
        >
          {borrowRateMode}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          keepMounted={true}
          data-cy={`apyMenu_${borrowRateMode}`}
        >
          <Typography
            variant="subheader2"
            color="text.light"
            sx={{ px: 2, py: 1.5 }}
          >
            Select APY type to switch
          </Typography>

          <MenuItem
            selected={borrowRateMode === InterestRate.Variable}
            value={InterestRate.Variable}
            onClick={() => {
              if (borrowRateMode === InterestRate.Stable) {
                onClick();
              }
              handleClose();
            }}
            sx={{ color: "text.light" }}
          >
            <ListItemIcon>
              <SvgIcon>
                {borrowRateMode === InterestRate.Variable && <CheckIcon />}
              </SvgIcon>
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ variant: "description" }}>
              APY, variable
            </ListItemText>
            <FormattedNumber
              value={Number(variableBorrowAPY)}
              percent
              variant="description"
            />
          </MenuItem>

          <MenuItem
            selected={borrowRateMode === InterestRate.Stable}
            value={InterestRate.Stable}
            onClick={() => {
              if (borrowRateMode === InterestRate.Variable) {
                onClick();
              }
              handleClose();
            }}
            sx={{ color: "text.light" }}
          >
            <ListItemIcon>
              <SvgIcon>
                {borrowRateMode === InterestRate.Stable && <CheckIcon />}
              </SvgIcon>
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ variant: "description" }}>
              APY, stable
            </ListItemText>
            <FormattedNumber
              value={Number(stableBorrowAPY)}
              percent
              variant="description"
            />
          </MenuItem>

          <Divider />

          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Button
              sx={{ mb: 1, ml: 2, color: "text.primary" }}
              size="small"
              component={Link}
              target="_blank"
              href={ROUTES.reserveOverview(underlyingAsset, currentMarket)}
              endIcon={
                <SvgIcon>
                  <OpenInNewIcon />
                </SvgIcon>
              }
            >
              SEE CHARTS
            </Button>
          </Box>
        </Menu>
      </>
    );
  }
);
