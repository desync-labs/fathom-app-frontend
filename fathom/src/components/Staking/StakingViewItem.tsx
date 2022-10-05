import {
  Box,
  Button,
  CircularProgress,
  TableCell,
  TableRow,
} from "@mui/material";
import * as React from "react";
import ILockPosition from "../../stores/interfaces/ILockPosition";
import {
  FC,
  useEffect,
  useMemo,
  useState
} from "react";
import { ActionType, StakingViewItemMethodsPropsType } from "./StakingView";
import StakingCountdown from "./StakingCountdown";
import { secondsToTime } from '../../utils/secondsToTime';

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
  const [timer, setTimer] = useState();
  const [seconds, setSeconds] = useState(lockPosition.timeObject.seconds);

  useEffect(() => {
    const interval = setInterval(function () {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // @ts-ignore
    setTimer(interval);

    return () => {
      clearInterval(timer);
    };
  }, [lockPosition.timeObject, setTimer, setSeconds]);

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
        <Box sx={{ textAlign: "center" }}>
          { useMemo(() => (
            lockPosition.EndTime > 0 && <StakingCountdown timeObject={secondsToTime(seconds)} />
          ), [seconds, lockPosition.EndTime]) }
        </Box>
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
