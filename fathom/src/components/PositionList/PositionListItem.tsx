import { observer } from "mobx-react";
import {
  CircularProgress,
  Grid,
  TableCell
} from "@mui/material";
import { Adjust } from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ClosePositionButton
} from "components/AppComponents/AppButton/AppButton";
import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useRef,
  useState
} from "react";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import BigNumber from "bignumber.js";
import { Constants } from "helpers/Constants";
import { useStores } from "stores";
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

type PositionListItemProps = {
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

const PositionListItem: FC<PositionListItemProps> = observer(
  ({
    position,
    setSelectedPosition,
    approvalPending,
    approveBtn,
    approve,
    setType,
  }) => {
    const { poolStore } = useStores();
    const anchorRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean>(false);

    const getFormattedSafetyBuffer = useCallback((safetyBuffer: BigNumber) => {
      return safetyBuffer.div(Constants.WeiPerWad).decimalPlaces(2).toString();
    }, []);

    return (
      <AppTableRow
        key={position.id}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          td: { paddingLeft: "10px", textAlign: "left" },
        }}
      >
        <TableCell component="td" scope="row">
          {position.id}
        </TableCell>
        <TableCell>{poolStore.getPool(position.pool)?.name}</TableCell>
        <TableCell>
          {getFormattedSafetyBuffer(position.debtShare)} FXD
        </TableCell>
        <TableCell>
          {getFormattedSafetyBuffer(position?.lockedCollateral)}{" "}
          {poolStore.getPool(position.pool)?.name}
        </TableCell>
        <TableCell>
          $ {getFormattedSafetyBuffer(position.lockedValue)}
        </TableCell>
        <TableCell>{position.ltv.toNumber() / 10}%</TableCell>
        <TableCell align="right">
          <Grid container justifyContent="center">
            <Grid xs={2} item>
              <Adjust>Adjust</Adjust>
            </Grid>
            {(approvalPending || approveBtn) && (
              <Grid xs={4} item>
                {approveBtn ? (
                  <ButtonPrimary onClick={approve} sx={{ height: "32px" }}>
                    {approvalPending ? (
                      <CircularProgress size={20} sx={{ color: "#0D1526" }} />
                    ) : (
                      "Approve FXD"
                    )}
                  </ButtonPrimary>
                ) : null}
              </Grid>
            )}
            <Grid xs={3} item>
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
                              setType(ClosingType.Partial)
                              setSelectedPosition(position)
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
            </Grid>
          </Grid>
        </TableCell>
      </AppTableRow>
    );
  }
);

export default PositionListItem;
