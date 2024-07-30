import { memo, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Box, styled } from "@mui/material";
import { IVaultStrategyReport, VaultType } from "fathom-sdk";
import { AppListVault } from "components/AppComponents/AppList/AppList";
import VaultHistoryChart, {
  HistoryChartDataType,
} from "components/Vaults/VaultDetail/VaultHistoryChart";
import useVaultContext from "context/vault";
import VaultAboutTabContent from "components/Vaults/VaultDetail/VaultAboutTabContent";
import { VaultAboutSkeleton } from "components/Base/Skeletons/VaultSkeletons";

export const VaultInfoWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding-top: 24px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    gap: 20px;
  }
`;

export const VaultDescriptionWrapper = styled(Box)`
  font-size: 14px;
  font-weight: 400;
  color: #b7c8e5;

  span {
    font-size: 14px;
    font-weight: 400;
    color: #b7c8e5;
  }

  ul {
    list-style: none;
    padding: 0;
    strong {
      font-weight: 600;
      font-size: 14px;
      text-decoration-line: underline;
    }
    li {
      margin-bottom: 12px;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
    span {
      font-size: 12px;
    }
  }
`;

export const VaultContractAddress = styled(Box)`
  font-size: 14px;
  color: #b7c8e5;
  a {
    color: #b7c8e5;
    text-decoration: underline;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
  }
`;

export const AppListApy = styled(AppListVault)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    & li {
      color: #b7c8e5;
      padding: 0;
      &.MuiListItemText-root {
        margin-top: 2px;
        margin-bottom: 2px;
      }
      span {
        color: #b7c8e5;
      }
      & div:last-child {
        font-weight: 400;
      }
    }
  }
`;

export const AppListFees = styled(AppListVault)`
  padding: 0;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 4px 0;
    & li {
      color: #6d86b2;
      font-size: 13px;
      font-weight: 600;
      padding: 0;
      &.MuiListItemText-root {
        margin-top: 2px;
        margin-bottom: 2px;
      }
      span {
        color: #6d86b2;
        font-size: 13px;
        font-weight: 600;
      }
      & div:last-child {
        color: #fff;
        font-weight: 600;
      }
    }
  }
`;

const VaultDetailInfoTabAbout = () => {
  const {
    vault,
    reports,
    historicalApr,
    vaultLoading,
    isReportsLoaded,
    activeTfPeriod,
  } = useVaultContext();
  const [earnedHistoryArr, setEarnedHistoryArr] = useState<
    HistoryChartDataType[]
  >([]);
  const { type } = vault;

  useEffect(() => {
    if (!Object.keys(reports).length) {
      return;
    }

    const extractedData = [];
    let allReports: IVaultStrategyReport[] = [];
    let accumulatedTotalEarned = "0";

    for (const reportsCollection of Object.values(reports)) {
      allReports = [...allReports, ...reportsCollection];
    }

    allReports.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

    for (let i = 0; i <= allReports.length - 1; i++) {
      const report = allReports[i];

      const currentTotalEarned = BigNumber(report.gain)
        .minus(report.loss)
        .dividedBy(10 ** 18)
        .plus(accumulatedTotalEarned)
        .toString();

      accumulatedTotalEarned = currentTotalEarned;

      extractedData.push({
        timestamp: report.timestamp,
        chartValue: currentTotalEarned,
      });
    }

    setEarnedHistoryArr(extractedData);
  }, [reports, historicalApr]);

  return (
    <VaultInfoWrapper>
      {vaultLoading || !vault.id ? (
        <VaultAboutSkeleton />
      ) : (
        <VaultAboutTabContent />
      )}
      {type === VaultType.TRADEFI && activeTfPeriod === 0 ? null : (
        <VaultHistoryChart
          title={
            type === VaultType.TRADEFI && activeTfPeriod < 2
              ? "Expected Cumulative Earnings"
              : "Cumulative Earnings"
          }
          chartDataArray={earnedHistoryArr}
          valueLabel="Earnings"
          valueUnits={` ${vault?.token?.name}`}
          isLoading={!isReportsLoaded}
        />
      )}
    </VaultInfoWrapper>
  );
};

export default memo(VaultDetailInfoTabAbout);
