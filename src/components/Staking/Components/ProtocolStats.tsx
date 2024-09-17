import { Box } from "@mui/material";
import { formatCompact, formatNumber, formatPercentage } from "utils/format";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import useSharedContext from "context/shared";

import LockedSrc from "assets/svg/locked.svg";
import RewardsSrc from "assets/svg/rewards.svg";
import PriceSrc from "assets/svg/price.svg";
import PercentSrc from "assets/svg/percent.svg";

const StatsBlocks = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px 8px;
  width: 100%;
  padding: 12px 0;
  border-bottom: 1px solid #1d2d49;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    gap: 10px;
  }
`;

const StatsBlock = styled(Box)`
  display: flex;
  align-items: center;
  width: calc(50% - 4px);
  gap: 8px;
  padding: 0;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: calc(52% - 4px);
    &:nth-child(2n) {
        width: 46%;
    },
  }
`;

const StatsLabel = styled("span")`
  display: inline-block;
  color: #b7c8e5;
  font-size: 11px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-bottom: 8px;
`;

const StatsValue = styled(Box)`
  display: flex;
  align-items: center;
  gap: 7px;
  strong {
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
    ${({ theme }) => theme.breakpoints.down("sm")} {
      font-size: 15px;
    }
  }
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #9fadc6;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    align-items: start;
    gap: 0;
  }
`;

const ValueLockedWrapper = styled(Box)`
  display: flex;
  gap: 5px;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: block;
  }
`;

type ProtocolStatsProps = {
  protocolStatsInfo: any;
  fthmPriceFormatted: number;
};

const ProtocolStats: FC<ProtocolStatsProps> = ({
  protocolStatsInfo,
  fthmPriceFormatted,
}) => {
  const { isMobile } = useSharedContext();

  if (isMobile) {
    return (
      <StatsBlocks>
        <StatsBlock>
          <img src={LockedSrc} alt={"locked"} />
          <Box>
            <StatsLabel>Total Value Locked</StatsLabel>
            {protocolStatsInfo ? (
              <StatsValue>
                <ValueLockedWrapper>
                  <strong>
                    {formatNumber(protocolStatsInfo.totalStakeFTHM / 10 ** 18)}
                  </strong>{" "}
                  FTHM
                </ValueLockedWrapper>
                <span>
                  $
                  {formatCompact(
                    (protocolStatsInfo.totalStakeFTHM / 10 ** 18) *
                      fthmPriceFormatted
                  )}
                </span>
              </StatsValue>
            ) : (
              <CustomSkeleton
                animation={"wave"}
                width={150}
                height={isMobile ? 41 : 22}
              />
            )}
          </Box>
        </StatsBlock>

        <StatsBlock>
          <img src={RewardsSrc} alt={"rewards"} />
          <Box>
            <StatsLabel>Daily rewards</StatsLabel>
            {protocolStatsInfo ? (
              <StatsValue>
                <Box>
                  <strong>
                    {formatNumber(protocolStatsInfo.oneDayRewards / 10 ** 18)}
                  </strong>{" "}
                  FTHM
                </Box>
                <span>
                  $
                  {formatCompact(
                    (protocolStatsInfo.oneDayRewards / 10 ** 18) *
                      fthmPriceFormatted
                  )}
                </span>
              </StatsValue>
            ) : (
              <CustomSkeleton
                animation={"wave"}
                width={50}
                height={isMobile ? 41 : 22}
              />
            )}
          </Box>
        </StatsBlock>

        <StatsBlock>
          <img src={PercentSrc} alt={"percent"} />
          <Box>
            <StatsLabel>APR</StatsLabel>
            {protocolStatsInfo ? (
              <StatsValue>
                <strong>
                  {formatNumber(protocolStatsInfo.stakingAPR / 10 ** 18)}%
                </strong>
              </StatsValue>
            ) : (
              <CustomSkeleton animation={"wave"} width={40} height={20} />
            )}
          </Box>
        </StatsBlock>

        <StatsBlock>
          <img src={PriceSrc} alt={"price"} />
          <Box>
            <StatsLabel>Price</StatsLabel>
            {protocolStatsInfo ? (
              <StatsValue>
                <strong>
                  $
                  {fthmPriceFormatted
                    ? formatPercentage(fthmPriceFormatted)
                    : 0}
                </strong>
              </StatsValue>
            ) : (
              <CustomSkeleton animation={"wave"} width={93} height={20} />
            )}
          </Box>
        </StatsBlock>
      </StatsBlocks>
    );
  }

  return (
    <StatsBlocks>
      <StatsBlock>
        <img src={PercentSrc} alt={"percent"} />
        <Box>
          <StatsLabel>APR</StatsLabel>
          {protocolStatsInfo ? (
            <StatsValue>
              <strong>
                {formatNumber(protocolStatsInfo.stakingAPR / 10 ** 18)}%
              </strong>
            </StatsValue>
          ) : (
            <CustomSkeleton animation={"wave"} width={40} height={20} />
          )}
        </Box>
      </StatsBlock>

      <StatsBlock>
        <img src={LockedSrc} alt={"locked"} />
        <Box>
          <StatsLabel>Total Value Locked</StatsLabel>
          {protocolStatsInfo ? (
            <StatsValue>
              <ValueLockedWrapper>
                <strong>
                  {formatNumber(protocolStatsInfo.totalStakeFTHM / 10 ** 18)}
                </strong>{" "}
                FTHM
              </ValueLockedWrapper>
              <span>
                $
                {formatCompact(
                  (protocolStatsInfo.totalStakeFTHM / 10 ** 18) *
                    fthmPriceFormatted
                )}
              </span>
            </StatsValue>
          ) : (
            <CustomSkeleton
              animation={"wave"}
              width={150}
              height={isMobile ? 41 : 22}
            />
          )}
        </Box>
      </StatsBlock>
      <StatsBlock>
        <img src={RewardsSrc} alt={"rewards"} />
        <Box>
          <StatsLabel>Daily rewards</StatsLabel>
          {protocolStatsInfo ? (
            <StatsValue>
              <Box>
                <strong>
                  {formatNumber(protocolStatsInfo.oneDayRewards / 10 ** 18)}
                </strong>{" "}
                FTHM
              </Box>
              <span>
                $
                {formatCompact(
                  (protocolStatsInfo.oneDayRewards / 10 ** 18) *
                    fthmPriceFormatted
                )}
              </span>
            </StatsValue>
          ) : (
            <CustomSkeleton
              animation={"wave"}
              width={50}
              height={isMobile ? 41 : 22}
            />
          )}
        </Box>
      </StatsBlock>
      <StatsBlock>
        <img src={PriceSrc} alt={"price"} />
        <Box>
          <StatsLabel>Price</StatsLabel>
          {protocolStatsInfo ? (
            <StatsValue>
              <strong>
                ${fthmPriceFormatted ? formatPercentage(fthmPriceFormatted) : 0}
              </strong>
            </StatsValue>
          ) : (
            <CustomSkeleton animation={"wave"} width={93} height={20} />
          )}
        </Box>
      </StatsBlock>
    </StatsBlocks>
  );
};

export default ProtocolStats;
