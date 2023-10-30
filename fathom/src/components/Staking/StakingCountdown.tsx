import { FC } from "react";
import ILockPosition from "services/interfaces/ITimeObject";

const StakingCountdown: FC<{ timeObject: ILockPosition }> = ({
  timeObject,
}) => {
  return (
    <>
      {timeObject.days} days {timeObject.hour} hrs {timeObject.min} min{" "}
      {timeObject.sec} sec left
    </>
  );
};

export default StakingCountdown;
