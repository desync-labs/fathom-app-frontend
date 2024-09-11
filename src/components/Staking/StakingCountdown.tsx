import { FC } from "react";
import { ITimeObject } from "fathom-sdk";

const StakingCountdown: FC<{ timeObject: ITimeObject }> = ({ timeObject }) => {
  return (
    <>
      {timeObject.days} D : {timeObject.hour} H : {timeObject.min} M :{" "}
      {timeObject.sec} S
    </>
  );
};

export default StakingCountdown;
