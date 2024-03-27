import { FC, memo, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Box, ListItemText, styled, Typography } from "@mui/material";
import { IVault, IVaultStrategyReport } from "fathom-sdk";
import { formatNumber, formatPercentage } from "utils/format";
import useSharedContext from "context/shared";
import { VaultItemInfoWrapper } from "components/Vault/VaultListItem";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import VaultHistoryChart, {
  HistoryChartDataType,
} from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultHistoryChart";
import { getAccountUrl } from "utils/explorer";
import { DEFAULT_CHAIN_ID } from "utils/Constants";
import { Link } from "react-router-dom";
import { useAprNumber } from "hooks/useApr";
import { IVaultStrategyHistoricalApr } from "hooks/useVaultListItem";

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
  reports: Record<string, IVaultStrategyReport[]>;
  historicalApr: Record<string, IVaultStrategyHistoricalApr[]>;
};

const VaultItemAbout: FC<VaultItemAboutPropsTypes> = ({
  vaultItemData,
  protocolFee,
  performanceFee,
  reports,
  historicalApr,
}) => {
  const { token } = vaultItemData;
  const aprNumber = useAprNumber(vaultItemData);
  const [earnedHistoryArr, setEarnedHistoryArr] = useState<
    HistoryChartDataType[]
  >([]);
  const { isMobile } = useSharedContext();

  useEffect(() => {
    if (!Object.keys(reports).length || !Object.keys(historicalApr).length) {
      return;
    }

    const extractedData = [];
    let allReports: IVaultStrategyReport[] = [];
    let accumulatedTotalEarned = "0";

    for (const reportsCollection of Object.values(reports)) {
      allReports = [...allReports, ...reportsCollection];
    }

    allReports.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));

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
    <VaultItemInfoWrapper>
      <VaultFlexColumns>
        <Box width={isMobile ? "100%" : "50%"}>
          <Box>
            <VaultAboutTitle variant={"h5"}>Description</VaultAboutTitle>
            <Typography component={"span"} fontSize="14px">
              The FXD vault functions as a pool of funds with an
              auto-compounding strategy that manages and executes various tasks
              based on predefined conditions. Users can deposit FXD only into
              this vault, which then uses algorithms to perform actions such as
              yield farming: lending, borrowing, etc. The FXD can consist of
              different strategies, all separately investable. Each strategy
              investment returns a strategy share token. Note that this is a
              share token and so not 1:1 equivalent with FXD deposited. The FXD
              vault only charges performance fees when strategy tokens are
              redeemed. There is no management fee. Note that the vault
              strategies have been carefully audited, nevertheless users are -
              as always in defi - exposed to smart contract risk.
              <Box mt={2}>
                Vault contract address:{" "}
                <Link
                  to={getAccountUrl(vaultItemData.id, DEFAULT_CHAIN_ID)}
                  target="_blank"
                  style={{
                    display: "inline-flex",
                    fontSize: "12px",
                    marginBottom: "16px",
                  }}
                >
                  {vaultItemData.id}
                </Link>
              </Box>
            </Typography>
          </Box>
          <Box pt="25px">
            <VaultAboutTitle variant={"h5"}>APY</VaultAboutTitle>
            <VaultFlexColumns>
              <Box width={"100%"}>
                <AppList>
                  <AppListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <>
                        {formatNumber(
                          BigNumber(aprNumber).dividedBy(52).toNumber()
                        )}
                        %
                      </>
                    }
                    sx={{ padding: "0 !important" }}
                  >
                    <ListItemText primary={"Weekly APY"} />
                  </AppListItem>
                  <AppListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <>
                        {formatNumber(
                          BigNumber(aprNumber).dividedBy(12).toNumber()
                        )}
                        %
                      </>
                    }
                    sx={{ padding: "0 !important" }}
                  >
                    <ListItemText primary={"Monthly APY"} />
                  </AppListItem>
                  <AppListItem
                    alignItems="flex-start"
                    secondaryAction={<>{formatNumber(aprNumber)}%</>}
                    sx={{ padding: "0 !important" }}
                  >
                    <ListItemText primary={"Yearly APY"} />
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
