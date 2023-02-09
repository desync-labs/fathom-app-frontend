import { Box, CircularProgress, TableCell, Stack } from "@mui/material";
import { PoolName, TVL } from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ClosePositionButton,
} from "components/AppComponents/AppButton/AppButton";
import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import React, {
  memo,
  Dispatch,
  FC,
  SetStateAction,
  useRef,
  useState,
} from "react";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import { ClosingType } from "hooks/useClosePosition";
import TokenLogo from "components/Common/TokenLogo";
import { getTokenLogoURL } from "utils/tokenLogo";

import { formatCurrency, formatNumber } from "utils/format";
import usePositionDebtValue from "hooks/usePositionDebtValue";


export type PositionListItemProps = {
  position: IOpenPosition;
  setSelectedPosition: Dispatch<SetStateAction<IOpenPosition | undefined>>;
  approve: () => void;
  approvalPending: boolean;
  approveBtn: boolean;
  setType: Dispatch<ClosingType>;
};

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
  padding-right: 20px;
  justify-content: right;
`;

const PositionListItem: FC<PositionListItemProps> = ({
  position,
  setSelectedPosition,
  approvalPending,
  approveBtn,
  approve,
  setType,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const {debtValue} = usePositionDebtValue(position.debtShare,position.collateralPool);

  return (
    <AppTableRow
      key={position.id}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        td: { paddingLeft: "10px", textAlign: "left" },
      }}
    >
      <TableCell component="td" scope="row">
        {position.positionId}
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <TokenLogo
            src={getTokenLogoURL(
              position?.collateralPoolName?.toUpperCase() === "XDC"
                ? "WXDC"
                : position?.collateralPoolName
            )}
            alt={position?.collateralPoolName}
          />
          <Box>
            <PoolName>{position.collateralPoolName}</PoolName>
            <TVL>TVL: {formatCurrency(Number(position.tvl))}</TVL>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>{formatCurrency(Number(position.liquidationPrice))}</TableCell>
      <TableCell>{formatNumber(Number(debtValue))} FXD</TableCell>
      <TableCell>
        {position.lockedCollateral} {position.collateralPoolName}
      </TableCell>
      <TableCell>
        {formatNumber(Number(position.safetyBufferInPercent) * 100)}%
      </TableCell>
      <TableCell>
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
                variant="contained"
                ref={anchorRef}
                aria-label="split button"
              >
                <ClosePositionButton
                  size="small"
                  aria-controls={open ? "split-button-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={() => setOpen(!open)}
                >
                  Close position
                  <ArrowDropDownIcon />
                </ClosePositionButton>
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
      </TableCell>
    </AppTableRow>
  );
};

export default memo(PositionListItem);
