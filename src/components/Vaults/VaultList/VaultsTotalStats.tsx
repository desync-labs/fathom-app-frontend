import { FC, memo } from "react";
import { Box, styled } from "@mui/material";
import { IVaultPosition } from "fathom-sdk";
import BigNumber from "bignumber.js";
import { formatNumber } from "utils/format";
import usePricesContext from "context/prices";
import useSharedContext from "context/shared";
import useTotalStats from "hooks/Vaults/useTotalStats";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import { BaseSkeletonValue } from "components/Base/Skeletons/StyledSkeleton";

import { ReactComponent as DepositedIcon } from "assets/svg/icons/vault-stats-deposited.svg";
import { ReactComponent as EarnedIcon } from "assets/svg/icons/vault-stats-earning.svg";

const StatsWrapper = styled(AppFlexBox)`
  gap: 16px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    gap: 4px;
  }
`;

const StatItemWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 80px;
  border-radius: 12px;
  background: #1e2f4c;
  padding: 20px 24px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 50%;
    & svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const StatItemInfo = styled(AppFlexBox)`
  gap: 12px;
  justify-content: space-between;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 0;
  }
`;
const StatItemLabel = styled(Box)`
  color: #6d86b2;
  font-size: 20px;
  font-weight: 600;
  line-height: 16px;
  text-transform: capitalize;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
  }
`;

const StatItemValue = styled(Box)`
  color: #fff;
  text-align: right;
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

type VaultsTotalStatsType = {
  positionsList: IVaultPosition[];
  positionsLoading: boolean;
};

type StatItemPropsType = { title: string; value: string; icon: JSX.Element };

const StatItem: FC<StatItemPropsType> = memo(({ title, value, icon }) => {
  const { fxdPrice, fetchPricesInProgress } = usePricesContext();
  const { isMobile } = useSharedContext();
  return (
    <StatItemWrapper>
      {icon}
      <StatItemInfo>
        <StatItemLabel>{title}</StatItemLabel>
        <StatItemValue>
          {value === "-1" || fetchPricesInProgress ? (
            <BaseSkeletonValue
              animation={"wave"}
              width={isMobile ? 80 : 110}
              height={isMobile ? 24 : 28}
            />
          ) : BigNumber(value).isGreaterThan(0) ? (
            `$${formatNumber(
              BigNumber(value)
                .multipliedBy(fxdPrice)
                .dividedBy(10 ** 36)
                .toNumber()
            )}`
          ) : (
            "$0"
          )}
        </StatItemValue>
      </StatItemInfo>
    </StatItemWrapper>
  );
});

const VaultsTotalStats: FC<VaultsTotalStatsType> = ({
  positionsList,
  positionsLoading,
}) => {
  const { totalBalance, balanceEarned } = useTotalStats(
    positionsList,
    positionsLoading
  );

  return (
    <StatsWrapper>
      <StatItem
        title="Deposited"
        value={totalBalance}
        icon={<DepositedIcon />}
      />
      <StatItem title="Earnings" value={balanceEarned} icon={<EarnedIcon />} />
    </StatsWrapper>
  );
};

export default memo(VaultsTotalStats);
