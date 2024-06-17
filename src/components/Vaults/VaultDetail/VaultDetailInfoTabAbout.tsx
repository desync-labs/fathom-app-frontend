import { memo, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Box, ListItemText, styled, Typography } from "@mui/material";
import { IVaultStrategyReport } from "fathom-sdk";
import { formatNumber, formatPercentage } from "utils/format";
import {
  AppListItem,
  AppListVault,
} from "components/AppComponents/AppList/AppList";
import VaultHistoryChart, {
  HistoryChartDataType,
} from "components/Vaults/VaultDetail/VaultHistoryChart";
import { getAccountUrl } from "utils/explorer";
import { DEFAULT_CHAIN_ID } from "utils/Constants";
import {
  VaultAboutTitle,
  vaultDescription,
} from "utils/getVaultTitleAndDescription";
import { Link } from "react-router-dom";
import { useAprNumber } from "hooks/Vaults/useApr";
import useVaultContext from "context/vault";

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
  const { vault, protocolFee, performanceFee, reports, historicalApr } =
    useVaultContext();
  const { token } = vault;
  const aprNumber = useAprNumber(vault);
  const [earnedHistoryArr, setEarnedHistoryArr] = useState<
    HistoryChartDataType[]
  >([]);

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
    <VaultInfoWrapper>
      <VaultDescriptionWrapper>
        {vaultDescription[vault.id.toLowerCase()] ? (
          vaultDescription[vault.id.toLowerCase()]
        ) : (
          <>
            <VaultAboutTitle variant={"h5"}>Description</VaultAboutTitle>
            <Typography component={"span"}>
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
            </Typography>
          </>
        )}
      </VaultDescriptionWrapper>
      <VaultContractAddress>
        Vault contract address:{" "}
        <Link to={getAccountUrl(vault.id, DEFAULT_CHAIN_ID)} target="_blank">
          {vault.id}
        </Link>
      </VaultContractAddress>
      <Box>
        <VaultAboutTitle variant={"h5"} sx={{ marginBottom: 0 }}>
          APY
        </VaultAboutTitle>
        <Box width={"100%"}>
          <AppListApy>
            <AppListItem
              alignItems="flex-start"
              secondaryAction={
                <>
                  {formatNumber(BigNumber(aprNumber).dividedBy(52).toNumber())}%
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
                  {formatNumber(BigNumber(aprNumber).dividedBy(12).toNumber())}%
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
          </AppListApy>
        </Box>
      </Box>
      <Box>
        <VaultAboutTitle sx={{ marginBottom: 0 }}>Fees</VaultAboutTitle>
        <AppListFees>
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
        </AppListFees>
      </Box>
      <VaultHistoryChart
        title={"Cumulative Earnings"}
        chartDataArray={earnedHistoryArr}
        valueLabel="Earnings"
        valueUnits={` ${token.name}`}
      />
    </VaultInfoWrapper>
  );
};

export default memo(VaultDetailInfoTabAbout);
