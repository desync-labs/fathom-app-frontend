import {
  Box,
  Button,
  CircularProgress,
  TableCell,
  TableRow,
} from "@mui/material";
import * as React from "react";
import ILockPosition from "../../stores/interfaces/ILockPosition";
import { FC } from "react";
import { ActionType, StakingViewItemMethodsPropsType } from "./StakingView";

type StakingViewItemPropsType = {
  lockPosition: ILockPosition;
  action: ActionType | undefined;
};

const StakingViewItem: FC<
  StakingViewItemPropsType & StakingViewItemMethodsPropsType
> = ({
  lockPosition,
  action,
  handleEarlyWithdrawal,
  isItUnlockable,
  handleUnlock,
}) => {
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell component="td" scope="row">
        {lockPosition.MAINTokenBalance} FTHM
      </TableCell>

      <TableCell component="td" scope="row">
        {lockPosition.VOTETokenBalance} VOTES
      </TableCell>

      <TableCell component="td" scope="row">
        {lockPosition.RewardsAvailable}
      </TableCell>

      <TableCell component="td" scope="row">
        {lockPosition.EndTime > 0 && (
          <Box sx={{ textAlign: "center" }}>
            {lockPosition.timeObject.days} days {lockPosition.timeObject.hour}{" "}
            hrs {lockPosition.timeObject.min} min {lockPosition.timeObject.sec}{" "}
            sec
          </Box>
        )}
        {lockPosition.EndTime < 0 && (
          <Box sx={{ textAlign: "center" }}>Lock Open</Box>
        )}
      </TableCell>

      <TableCell component="td" scope="row">
        <Button
          onClick={() => handleUnlock(lockPosition.lockId)}
          disabled={!isItUnlockable(lockPosition.lockId)}
          variant="outlined"
        >
          {action?.type === "unlock" && action?.id === lockPosition.lockId ? (
            <CircularProgress size={30} />
          ) : (
            "Unlock"
          )}
        </Button>
      </TableCell>

      <TableCell component="td" scope="row">
        <Button
          onClick={() => handleEarlyWithdrawal(lockPosition.lockId)}
          disabled={isItUnlockable(lockPosition.lockId)}
          variant="outlined"
        >
          {action?.type === "early" && action?.id === lockPosition.lockId ? (
            <CircularProgress size={30} />
          ) : (
            "Early Unlock"
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default StakingViewItem;
