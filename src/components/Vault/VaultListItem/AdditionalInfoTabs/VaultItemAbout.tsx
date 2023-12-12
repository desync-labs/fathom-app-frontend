import { FC, useEffect, useState } from "react";
import { IVault } from "fathom-sdk";
import { VaultItemInfoWrapper } from "components/Vault/VaultListItem";
import { Box, ListItemText, Typography, styled } from "@mui/material";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import { formatNumber } from "utils/format";
import BigNumber from "bignumber.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
`;

type VaultItemAboutPropsTypes = {
  vaultItemData: IVault;
  isMobile: boolean;
};

interface EarnedHistoryItem {
  timestamp: string;
  totalEarned: string;
}

const VaultItemAbout: FC<VaultItemAboutPropsTypes> = ({
  vaultItemData,
  isMobile,
}) => {
  const [earnedHistoryArr, setEarnedHistoryArr] = useState<EarnedHistoryItem[]>(
    []
  );
  const { strategies } = vaultItemData;

  useEffect(() => {
    const extractedData = [];
    // Итерируем по стратегиям
    for (const strategy of vaultItemData.strategies) {
      // Итерируем по отчетам
      for (const report of strategy.reports) {
        // Извлекаем нужные поля и добавляем их в новый массив
        extractedData.push({
          timestamp: report.timestamp,
          totalEarned: BigNumber(report.gain)
            .minus(BigNumber(report.loss))
            .dividedBy(10 ** 18)
            .toString(),
        });
      }
    }

    extractedData.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));

    console.log(extractedData);

    setEarnedHistoryArr(extractedData);
  }, [vaultItemData]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp)).toLocaleString();
  };

  return (
    <VaultItemInfoWrapper>
      <VaultFlexColumns>
        <Box width="50%">
          <Box>
            <VaultAboutTitle variant="h5">Description</VaultAboutTitle>
            <Typography component={"span"} fontSize="14px">
              Sorry, we don't have a description for this asset right now. But
              did you know the correct word for a blob of toothpaste is a
              "nurdle". Fascinating! We'll work on updating the asset
              description, but at least you learnt something interesting. Catch
              ya later nurdles.
            </Typography>
          </Box>
          <Box pt="25px">
            <VaultAboutTitle variant="h5">APR</VaultAboutTitle>
            <VaultFlexColumns>
              <Box width="50%">
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
                    sx={{ padding: "8px 0 !important" }}
                  >
                    <ListItemText primary={"Weekly APR"} />
                  </AppListItem>
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
                    sx={{ padding: "8px 0 !important" }}
                  >
                    <ListItemText primary={"Monthly APR"} />
                  </AppListItem>
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
                    sx={{ padding: "8px 0 !important" }}
                  >
                    <ListItemText primary={"Inception APR"} />
                  </AppListItem>
                </AppList>
              </Box>
              <Box width="50%">
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
                    sx={{ padding: "8px 0 !important" }}
                  >
                    <ListItemText primary={"Net APR"} />
                  </AppListItem>
                </AppList>
              </Box>
            </VaultFlexColumns>
          </Box>
        </Box>
        <Box width="40%">
          <Box>
            <VaultAboutTitle>Fees</VaultAboutTitle>
            <AppList sx={{ padding: 0 }}>
              <AppListItem
                alignItems="flex-start"
                secondaryAction={
                  <>{`${strategies[0].reports[0].totalFees}%`}</>
                }
                sx={{ padding: "0 !important" }}
              >
                <ListItemText primary={"Deposit/Withdrawal fee"} />
              </AppListItem>
            </AppList>
          </Box>
          <Box pt="25px">
            <VaultAboutTitle>Cumulative Earnings</VaultAboutTitle>
            <LineChart
              width={500}
              height={300}
              data={earnedHistoryArr}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
              <YAxis />
              <Tooltip labelFormatter={formatTimestamp} />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalEarned"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </Box>
        </Box>
      </VaultFlexColumns>
    </VaultItemInfoWrapper>
  );
};

export default VaultItemAbout;
