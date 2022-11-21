import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";
import { getTokenLogoURL } from "utils/tokenLogo";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import React, {
  FC,
  useMemo,
  useState
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

const StreamHeaderWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
`;

const HeaderLockedPositions = styled(Box)`
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #9fadc6;
`;

const HeaderTokenLogo = styled(Box)`
  width: 48px;
  height: 48px;
  background: rgba(79, 101, 140, 0.2);
  border-radius: 58px;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const HeaderStreamName = styled(Box)`
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: #3665ff;
`;

const TotalRewards = styled(Box)`
  background: linear-gradient(304.5deg, #003cff 0%, #0026a2 95.93%);
  border: 1px solid #1d2d49;
  border-radius: 8px;
  width: 100%;
  height: 56px;
  display: grid;
  grid-template-columns: 5fr 1fr 0.75fr 1fr;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
  grid-column-gap: 10px;
`;

const TotalRewardsTitle = styled(Box)`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
`;

const TotalRewardsTokenLogo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UnstakeAllButton = styled(ButtonPrimary)`
  height: 32px;
`;

const ClaimAllButton = styled(Button)`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: #43fff1;
  text-transform: none;
`;

const TokenName = styled(Box)`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
`;

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

  return (
    <>
      <StreamHeaderWrapper>
        <HeaderTokenLogo>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={28} />
        </HeaderTokenLogo>
        <HeaderStreamName>{ token } Stream</HeaderStreamName>
        <HeaderLockedPositions>
          {stakingStore.lockPositions.length} Locked Positions
        </HeaderLockedPositions>
      </StreamHeaderWrapper>

      {useMemo(
        () => (
          <>
            <TotalRewards>
              <TotalRewardsTitle>Total Rewards</TotalRewardsTitle>
              <TotalRewardsTokenLogo>
                <img src={getTokenLogoURL(token)} alt={token} width={24} />
                <TokenName>{totalRewards} { token }</TokenName>
              </TotalRewardsTokenLogo>
              <ClaimAllButton
                onClick={() =>
                  setTotalRewardsData({
                    rewardsToken: token,
                    totalRewards: totalRewards,
                  })
                }
              >
                Claim all
              </ClaimAllButton>
              <UnstakeAllButton
                onClick={() => setUnstakeType(UNSTAKE_TYPE.ALL)}
              >
                Unstake all
              </UnstakeAllButton>
            </TotalRewards>
            {stakingStore.lockPositions.map((lockPosition: ILockPosition) => (
              <StakingViewItem
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

        [stakingStore.lockPositions, totalRewards]
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
        [unstake, unstakeType, stakingStore.lockPositions]
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
        [earlyUnstake]
      )}
    </>
  );
};

export default StreamItem;
