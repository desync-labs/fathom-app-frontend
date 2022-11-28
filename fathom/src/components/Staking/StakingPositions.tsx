import { TitleSecondary } from "components/AppComponents/AppBox/AppBox";
import * as React from "react";
import { Dispatch, FC } from "react";
import StreamItem from "components/Staking/StreamItem";

type StakingPositionsProps = {
  showClaimRewards: boolean;
  setShowClaimRewards: Dispatch<boolean>;
};

const StakingPositions: FC<StakingPositionsProps> = ({
  showClaimRewards,
  setShowClaimRewards,
}) => {
  return (
    <>
      <TitleSecondary>My Positions</TitleSecondary>
      <StreamItem
        token={"FTHM"}
        showClaimRewards={showClaimRewards}
        setShowClaimRewards={setShowClaimRewards}
      />
    </>
  );
};

export default StakingPositions;
