import React, { FC, useMemo, useState, memo, Dispatch } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import StakingViewItem from "components/Staking/StakingViewItem";
import { useStores } from "stores";
import ClaimRewardsDialog, {
  ClaimRewardsType,
} from "components/Staking/Dialog/ClaimRewardsDialog";
import useStakingView from "hooks/useStakingView";
import UnstakeDialog from "components/Staking/Dialog/UnstakeDialog";
import EarlyUnstakeDialog from "components/Staking/Dialog/EarlyUnstakeDialog";
import { NoResults } from "components/AppComponents/AppBox/AppBox";

type StreamItemProps = {
  token: string;
  showClaimRewards: boolean;
  setShowClaimRewards: Dispatch<boolean>;
};

const StreamItem: FC<StreamItemProps> = ({
  token,
  showClaimRewards,
  setShowClaimRewards,
}) => {
  const { stakingStore } = useStores();

  const [unstake, setUnstake] = useState<null | ILockPosition>(null);

  const [earlyUnstake, setEarlyUnstake] = useState<null | ILockPosition>(null);
  const [showUnclaimedRewards, setShowUnclaimedRewards] =
    useState<boolean>(false);

  const { calculateTotalRewards } = useStakingView();

  const totalRewards = useMemo(() => {
    return calculateTotalRewards(stakingStore.lockPositions);
  }, [calculateTotalRewards, stakingStore.lockPositions]);

  return (
    <>
      {useMemo(
        () => (
          <>
            {stakingStore.lockPositions.length === 0 ? (
              <NoResults variant="h6">You have no open positions!</NoResults>
            ) : (
              stakingStore.lockPositions.map(
                (lockPosition: ILockPosition, index: number) => (
                  <StakingViewItem
                    index={index}
                    key={lockPosition.lockId}
                    token={token}
                    lockPosition={lockPosition}
                    setUnstake={setUnstake}
                    setEarlyUnstake={setEarlyUnstake}
                  />
                )
              )
            )}
          </>
        ),

        [stakingStore.lockPositions, token]
      )}

      {showClaimRewards && (
        <ClaimRewardsDialog
          token={token}
          totalRewards={totalRewards}
          onClose={() => {
            setShowClaimRewards(false);
          }}
          type={ClaimRewardsType.FUll}
        />
      )}

      {useMemo(
        () =>
          unstake && (
            <UnstakeDialog
              onClose={() => {
                setUnstake(null);
              }}
              token={token}
              lockPosition={unstake}
            />
          ),
        [unstake, stakingStore.lockPositions, token]
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
