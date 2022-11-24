import React, {
  FC,
  useMemo,
  useState,
  memo
} from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import StakingViewItem from "components/Staking/StakingViewItem";
import { useStores } from "stores";
import ClaimRewardsDialog, {
  ClaimRewardsAll,
  ClaimRewardsType,
} from "components/Staking/Dialog/ClaimRewardsDialog";
import useStakingView from "hooks/useStakingView";
import UnstakeDialog, {
  UNSTAKE_TYPE,
} from "components/Staking/Dialog/UnstakeDialog";
import EarlyUnstakeDialog from "components/Staking/Dialog/EarlyUnstakeDialog";


type StreamItemProps =  {
  token: string
}

const StreamItem: FC<StreamItemProps> = ({ token }) => {
  const { stakingStore } = useStores();

  const [unstake, setUnstake] = useState<null | ILockPosition>(null);
  const [unstakeType, setUnstakeType] = useState<UNSTAKE_TYPE>(
    UNSTAKE_TYPE.ITEM
  );

  const [earlyUnstake, setEarlyUnstake] = useState<null | ILockPosition>(null);

  const [rewardsPosition, setRewardsPosition] = useState<null | ILockPosition>(
    null
  );
  const [totalRewardsData, setTotalRewardsData] =
    useState<null | ClaimRewardsAll>(null);

  const { calculateTotalRewards } = useStakingView();

  const totalRewards = useMemo(() => {
    return calculateTotalRewards(stakingStore.lockPositions);
  }, [calculateTotalRewards, stakingStore.lockPositions]);

  console.log(stakingStore.lockPositions);

  return (
    <>
      {useMemo(
        () => (
          <>
            {stakingStore.lockPositions.map((lockPosition: ILockPosition, index: number) => (
              <StakingViewItem
                index={index}
                key={lockPosition.lockId}
                token={token}
                lockPosition={lockPosition}
                setUnstake={setUnstake}
                setEarlyUnstake={setEarlyUnstake}
                setRewardsPosition={setRewardsPosition}
              />
            ))}
          </>
        ),

        [stakingStore.lockPositions, totalRewards, token]
      )}

      {(rewardsPosition || totalRewardsData) && (
        <ClaimRewardsDialog
          lockPosition={rewardsPosition}
          totalRewards={totalRewardsData}
          token={token}
          onClose={() => {
            setRewardsPosition(null);
            setTotalRewardsData(null);
          }}
          type={
            totalRewardsData ? ClaimRewardsType.FUll : ClaimRewardsType.ITEM
          }
        />
      )}

      {useMemo(
        () =>
          (unstake || unstakeType === UNSTAKE_TYPE.ALL) && (
            <UnstakeDialog
              onClose={() => {
                setUnstake(null);
                setUnstakeType(UNSTAKE_TYPE.ITEM);
              }}
              token={token}
              type={unstakeType}
              lockPosition={unstake}
              lockPositions={stakingStore.lockPositions}
            />
          ),
        [unstake, unstakeType, stakingStore.lockPositions, token]
      )}

      {useMemo(
        () =>
          earlyUnstake && (
            <EarlyUnstakeDialog
              token={token}
              onClose={() => setEarlyUnstake(null)}
              lockPosition={earlyUnstake!}
            />
          ),
        [earlyUnstake, token]
      )}
    </>
  );
};

export default memo(StreamItem);
