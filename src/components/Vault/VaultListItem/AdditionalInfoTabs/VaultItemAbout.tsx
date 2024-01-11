import { FC, useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Box, ListItemText, Typography, styled } from "@mui/material";
import { IVault, IVaultStrategy, IVaultStrategyReport } from "fathom-sdk";
import { formatNumber, formatPercentage } from "utils/format";
import useSharedContext from "context/shared";
import { VaultItemInfoWrapper } from "components/Vault/VaultListItem";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import VaultHistoryChart, {
  HistoryChartDataType,
} from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultHistoryChart";

export const VaultAboutTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #fff;
  margin-bottom: 16px;
`;

export const VaultFlexColumns = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 25px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
  }
`;

type VaultItemAboutPropsTypes = {
  vaultItemData: IVault;
};

const VaultItemAbout: FC<VaultItemAboutPropsTypes> = ({ vaultItemData }) => {
  const { strategies, token, totalFees, protocolFees } = vaultItemData;
  const [earnedHistoryArr, setEarnedHistoryArr] = useState<
    HistoryChartDataType[]
  >([]);
  const { isMobile } = useSharedContext();

  useEffect(() => {
    if (!vaultItemData) return;

    const extractedData = [];
    let accumulatedTotalEarned = "0";

    for (const strategy of vaultItemData.strategies) {
      for (let i = strategy.reports.length - 1; i >= 0; i--) {
        const report = strategy.reports[i];

        const currentTotalEarned = BigNumber(report.gain)
          .minus(BigNumber(report.loss))
          .dividedBy(10 ** 18)
          .plus(accumulatedTotalEarned)
          .toString();

        accumulatedTotalEarned = currentTotalEarned;

        extractedData.push({
          timestamp: report.timestamp,
          chartValue: currentTotalEarned,
        });
      }
    }

    extractedData.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));

    setEarnedHistoryArr(extractedData);
  }, [vaultItemData]);

  const getAvgAprForPeriod = useCallback(
    (strategy: IVaultStrategy, numberOfDays: number) => {
      const reportsWithinPeriod = strategy.reports.filter(
        (report: IVaultStrategyReport) => {
          const reportTimestamp = parseInt(report.timestamp, 10);
          const currentTimestamp = new Date().getTime();
          const daysDifference = Math.floor(
            (currentTimestamp - reportTimestamp) / (1000 * 60 * 60 * 24)
          );

          return daysDifference <= numberOfDays;
        }
      );

      if (!reportsWithinPeriod.length) {
        return strategy.reports[0].results[0].apr;
      }

      const aprValues = reportsWithinPeriod.flatMap(
        (report: IVaultStrategyReport) =>
          report.results.map((result: any) => parseFloat(result.apr))
      );

      if (aprValues.length > 0) {
        const avgApr =
          aprValues.reduce((sum: number, apr: number) => sum + apr, 0) /
          aprValues.length;
        return avgApr.toString();
      } else {
        return "0";
      }
    },
    [vaultItemData]
  );

  const getLastReportApr = useCallback(
    (strategy: IVaultStrategy) => {
      const lastReport = strategy.reports[strategy.reports.length - 1];

      if (lastReport.results.length > 0) {
        const lastResult = lastReport.results[lastReport.results.length - 1];
        const lastApr = lastResult.apr;

        return lastApr;
      } else {
        return "0";
      }
    },
    [vaultItemData]
  );

  return (
    <VaultItemInfoWrapper>
      <VaultFlexColumns>
        <Box width={isMobile ? "100%" : "50%"}>
          <Box>
            <VaultAboutTitle variant={"h5"}>Description</VaultAboutTitle>
            <Typography component={"span"} fontSize="14px">
              Welcome to our state-of-the-art Crypto Vault, an innovative
              platform designed for astute investors seeking to enhance their
              digital asset portfolio. Inspired by the pioneering model of Yearn
              Finance, our vault offers a secure and dynamic way to grow your
              cryptocurrency investments.
            </Typography>
          </Box>
          <Box pt="25px">
            <VaultAboutTitle variant={"h5"}>APR</VaultAboutTitle>
            <VaultFlexColumns>
              <Box width={isMobile ? "100%" : "50%"}>
                <AppList>
                  <AppListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <>
                        {formatNumber(
                          BigNumber(
                            getAvgAprForPeriod(strategies[0], 7)
                          ).toNumber()
                        )}
                        %
                      </>
                    }
                    sx={{ padding: "0 !important" }}
                  >
                    <ListItemText primary={"Weekly APR"} />
                  </AppListItem>
                  <AppListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <>
                        {formatNumber(
                          BigNumber(
                            getAvgAprForPeriod(strategies[0], 30)
                          ).toNumber()
                        )}
                        %
                      </>
                    }
                    sx={{ padding: "0 !important" }}
                  >
                    <ListItemText primary={"Monthly APR"} />
                  </AppListItem>
                  <AppListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <>
                        {formatNumber(
                          BigNumber(getLastReportApr(strategies[0])).toNumber()
                        )}
                        %
                      </>
                    }
                    sx={{ padding: "0 !important" }}
                  >
                    <ListItemText primary={"Inception APR"} />
                  </AppListItem>
                </AppList>
              </Box>
              <Box width={isMobile ? "100%" : "50%"}>
                <AppList>
                  <AppListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <>
                        {formatNumber(
                          BigNumber(
                            strategies[0].reports[0].results[0].apr
                          ).toNumber()
                        )}
                        %
                      </>
                    }
                    sx={{ padding: "0 !important" }}
                  >
                    <ListItemText primary={"Net APR"} />
                  </AppListItem>
                </AppList>
              </Box>
            </VaultFlexColumns>
          </Box>
        </Box>
        <Box width={isMobile ? "100%" : "40%"}>
          <Box>
            <VaultAboutTitle>Fees</VaultAboutTitle>
            <AppList sx={{ padding: 0 }}>
              <AppListItem
                alignItems="flex-start"
                secondaryAction={
                  <>{`${formatPercentage(
                    BigNumber(protocolFees).toNumber()
                  )}%`}</>
                }
                sx={{ padding: "0 !important" }}
              >
                <ListItemText primary={"Protocol fee"} />
              </AppListItem>
              <AppListItem
                alignItems="flex-start"
                secondaryAction={
                  <>{`${formatPercentage(BigNumber(totalFees).toNumber())}%`}</>
                }
                sx={{ padding: "0 !important" }}
              >
                <ListItemText primary={"Total fee"} />
              </AppListItem>
            </AppList>
          </Box>
          <VaultHistoryChart
            title={"Cumulative Earnings"}
            chartDataArray={earnedHistoryArr}
            valueLabel="Earnings"
            valueUnits={` ${token.name}`}
          />
        </Box>
      </VaultFlexColumns>
    </VaultItemInfoWrapper>
  );
};

export default VaultItemAbout;
