import { FC, memo, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Box, ListItemText, styled, Typography } from "@mui/material";
import { IVault } from "fathom-sdk";
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
  protocolFee: number;
  performanceFee: number;
};

const VaultItemAbout: FC<VaultItemAboutPropsTypes> = ({
  vaultItemData,
  protocolFee,
  performanceFee,
}) => {
  const { token, apr } = vaultItemData;
  const [earnedHistoryArr, setEarnedHistoryArr] = useState<
    HistoryChartDataType[]
  >([]);
  const { isMobile } = useSharedContext();

  useEffect(() => {
    if (!vaultItemData) return;

    const extractedData = [];
    const allReports = [];
    let accumulatedTotalEarned = "0";

    for (const strategy of vaultItemData.strategies) {
      allReports.push(...strategy.reports);
    }

    allReports.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));

    for (let i = allReports.length - 1; i >= 0; i--) {
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
  }, [vaultItemData]);

  return (
    <VaultItemInfoWrapper>
      <VaultFlexColumns>
        <Box width={isMobile ? "100%" : "50%"}>
          <Box>
            <VaultAboutTitle variant={"h5"}>Description</VaultAboutTitle>
            <Typography component={"span"} fontSize="14px">
              FXD Educational Vault is used to onboard the Fathom community into
              Fathom Vaults. It allows users to learn how to use the Fathom
              digital asset management platform. In this Vault, we onboard only
              Strategies with no loss risk. Fathom Vaults are the most secure
              and dynamic way to grow cryptocurrency investments.
            </Typography>
          </Box>
          <Box pt="25px">
            <VaultAboutTitle variant={"h5"}>APR</VaultAboutTitle>
            <VaultFlexColumns>
              <Box width={"100%"}>
                <AppList>
                  <AppListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <>
                        {formatNumber(BigNumber(apr).dividedBy(52).toNumber())}%
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
                        {formatNumber(BigNumber(apr).dividedBy(12).toNumber())}%
                      </>
                    }
                    sx={{ padding: "0 !important" }}
                  >
                    <ListItemText primary={"Monthly APR"} />
                  </AppListItem>
                  <AppListItem
                    alignItems="flex-start"
                    secondaryAction={<>{formatNumber(Number(apr))}%</>}
                    sx={{ padding: "0 !important" }}
                  >
                    <ListItemText primary={"Yearly APR"} />
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
                    Number(performanceFee * (protocolFee / 100))
                  )}%`}</>
                }
                sx={{ padding: "0 !important" }}
              >
                <ListItemText primary={"Protocol fee"} />
              </AppListItem>
              <AppListItem
                alignItems="flex-start"
                secondaryAction={
                  <>{`${formatPercentage(Number(performanceFee))}%`}</>
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

export default memo(VaultItemAbout);
