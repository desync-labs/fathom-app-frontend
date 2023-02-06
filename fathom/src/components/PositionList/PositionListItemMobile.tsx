import { PositionListItemProps } from "components/PositionList/PositionListItem";
import React, { FC, useRef, useState } from "react";
import { getTokenLogoURL } from "utils/tokenLogo";
import { PoolName, TVL } from "components/AppComponents/AppBox/AppBox";
import { formatCurrency, formatNumber } from "utils/format";
import { styled } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";
import {
  ButtonPrimary,
  ClosePositionButton,
} from "components/AppComponents/AppButton/AppButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { ClosingType } from "../../hooks/useClosePosition";
import { AppPaper } from "../AppComponents/AppPaper/AppPaper";

const PositionListItemMobileContainer = styled(Box)`
  width: 100%;
  background: #131f35;
  border-bottom: 1px solid #131f35;
  border-radius: 8px;
  padding: 20px 16px;
  margin-bottom: 5px;
`;

const ListItemWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ListLabel = styled(Box)`
  color: #6379a1;
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: start;
`;

const ListValue = styled(Box)`
  display: flex;
  justify-content: right;
  flex-direction: column;
`;

const PoolWrapper = styled(Box)`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
`;

const ClosePositionPaper = styled(AppPaper)`
  background: #253656;
  border: 1px solid #4f658c;
  box-shadow: 0px 12px 32px #000715;
  border-radius: 8px;
  padding: 4px;

  ul {
    padding: 0;
    li {
      padding: 10px 16px;
      &:hover {
        background: #324567;
        border-radius: 6px;
      }
    }
  }
`;

const ButtonsWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: right;
  margin-top: 20px;
`;

const ClosePositionButtonMobile = styled(ClosePositionButton)`
  height: 40px;
  width: 100%;
`;

const PositionListItemMobile: FC<PositionListItemProps> = ({
  position,
  setSelectedPosition,
  approvalPending,
  approveBtn,
  approve,
  setType,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <PositionListItemMobileContainer>
      <ListItemWrapper>
        <ListLabel>Asset</ListLabel>
        <ListValue>
          <PoolWrapper>
            <img
              src={getTokenLogoURL(
                position?.collateralPoolName?.toUpperCase() === "XDC"
                  ? "WXDC"
                  : position?.collateralPoolName
              )}
              alt={position?.collateralPoolName}
              width={20}
              height={20}
            />
            <PoolName>{position?.collateralPoolName}</PoolName>
          </PoolWrapper>
          <TVL sx={{ textAlign: "right" }}>
            TVL: {formatCurrency(Number(position.tvl))}
          </TVL>
        </ListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListLabel>Liquidation price</ListLabel>
        <ListValue>
          {formatCurrency(Number(position.liquidationPrice))}
        </ListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListLabel>Borrowed</ListLabel>
        <ListValue>{formatNumber(Number(position.debtShare))} FXD</ListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListLabel>Collateral</ListLabel>
        <ListValue>
          {position.lockedCollateral} {position.collateralPoolName}
        </ListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListLabel>Safety buffer</ListLabel>
        <ListValue>
          {formatNumber(Number(position.safetyBufferInPercent) * 100)}%
        </ListValue>
      </ListItemWrapper>
      <ButtonsWrapper>
        {approveBtn ? (
          <ButtonPrimary onClick={approve} sx={{ height: "32px" }}>
            {approvalPending ? (
              <CircularProgress size={20} sx={{ color: "#0D1526" }} />
            ) : (
              `Approve FXD`
            )}
          </ButtonPrimary>
        ) : (
          <>
            <ButtonGroup
              sx={{ width: "100%" }}
              variant="contained"
              ref={anchorRef}
              aria-label="split button"
            >
              <ClosePositionButtonMobile
                aria-controls={open ? "split-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={() => setOpen(!open)}
              >
                Close position
                <ArrowDropDownIcon />
              </ClosePositionButtonMobile>
            </ButtonGroup>
            <Popper
              sx={{
                zIndex: 1,
              }}
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: "center bottom",
                  }}
                >
                  <ClosePositionPaper>
                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                      <MenuList id="split-button-menu" autoFocusItem>
                        <MenuItem
                          onClick={() => {
                            setType(ClosingType.Full);
                            setSelectedPosition(position);
                          }}
                        >
                          Repay entirely
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setType(ClosingType.Partial);
                            setSelectedPosition(position);
                          }}
                        >
                          Repay partially
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </ClosePositionPaper>
                </Grow>
              )}
            </Popper>
          </>
        )}
      </ButtonsWrapper>
    </PositionListItemMobileContainer>
  );
};

export default PositionListItemMobile;
