import { FC } from "react";
import ILockPosition from "../../stores/interfaces/ITimeObject";

const StakingCountdown: FC<{ timeObject: ILockPosition }> = ({
  timeObject,
}) => {
  return (
    <>
      {timeObject.days} days {timeObject.hour} hrs {timeObject.min} min{" "}
      {timeObject.sec} sec
    </>
  );
};

export default StakingCountdown;
