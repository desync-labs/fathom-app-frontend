import { TitleSecondary } from "components/AppComponents/AppBox/AppBox";
import { FC } from "react";
import StreamItem from "components/Staking/StreamItem";

const StakingPositions: FC = () => {
  return (
    <>
      <TitleSecondary>My Positions</TitleSecondary>
      <StreamItem token={"FTHM"} />
    </>
  );
};

export default StakingPositions;
