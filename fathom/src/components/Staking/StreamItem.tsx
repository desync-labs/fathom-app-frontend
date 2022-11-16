import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";
import { getTokenLogoURL } from "utils/tokenLogo";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import React, { useMemo, useState } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import StakingViewItem from "components/Staking/StakingViewItem";
import { useStores } from "stores";
import ClaimRewardsDialog, {
  ClaimRewardsAll,
  ClaimRewardsType,
} from "./Dialog/ClaimRewardsDialog";
import useStakingView from "hooks/useStakingView";

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

const StreamItem = () => {
  const { stakingStore } = useStores();
  const [unstake, setUnstake] = useState<null | ILockPosition>(null);
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
          <img src={getTokenLogoURL("WXDC")} alt={"token-logo"} width={28} />
        </HeaderTokenLogo>
        <HeaderStreamName>XDC Stream</HeaderStreamName>
        <HeaderLockedPositions>3 Locked Positions</HeaderLockedPositions>
      </StreamHeaderWrapper>

      {useMemo(
        () => (
          <>
            <TotalRewards>
              <TotalRewardsTitle>Total Rewards</TotalRewardsTitle>
              <TotalRewardsTokenLogo>
                <img src={getTokenLogoURL("WXDC")} alt={"xdc"} width={24} />
                <TokenName>{totalRewards} XDC</TokenName>
              </TotalRewardsTokenLogo>
              <ClaimAllButton
                onClick={() =>
                  setTotalRewardsData({
                    rewardsToken: "XDC",
                    totalRewards: totalRewards,
                  })
                }
              >
                Claim all
              </ClaimAllButton>
              <UnstakeAllButton>Unstake all</UnstakeAllButton>
            </TotalRewards>
            {stakingStore.lockPositions.map((lockPosition: ILockPosition) => (
              <StakingViewItem
                key={lockPosition.lockId}
                lockPosition={lockPosition}
                setUnstake={setUnstake}
                setEarlyUnstake={setEarlyUnstake}
                setRewardsPosition={setRewardsPosition}
              />
            ))}
          </>
        ),

        [stakingStore.lockPositions]
      )}

      {(rewardsPosition || totalRewardsData) && (
        <ClaimRewardsDialog
          lockPosition={rewardsPosition}
          totalRewards={totalRewardsData}
          onClose={() => {
            setRewardsPosition(null);
            setTotalRewardsData(null);
          }}
          type={
            totalRewardsData ? ClaimRewardsType.FUll : ClaimRewardsType.ITEM
          }
        />
      )}
    </>
  );
};

export default StreamItem;
