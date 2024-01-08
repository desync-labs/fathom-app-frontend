import { FC, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IVaultStrategy, IVaultStrategyReport } from "fathom-sdk";
import { formatNumber } from "utils/format";
import useSharedContext from "context/shared";
import VaultHistoryChart, {
  HistoryChartDataType,
} from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultHistoryChart";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

export const VaultItemAccordion = styled(Accordion)`
  background: #132340;
  border-radius: 8px !important;
  padding: 20px 32px;
  margin-bottom: 5px;
  box-shadow: none;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 20px;
    margin: 16px 0;

    &.mb-0 {
      margin-bottom: 0;
    }

    &.mt-3 {
      margin-top: 3px;
    }
  }
`;

export const VaultStrategyStatsWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 25px;
  padding: 15px 0;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    width: 100%;
  }
`;

export const VaultIndicatorsWrapper = styled(Box)`
  display: flex;
  width: 50%;
  flex-direction: column;
  justify-content: space-evenly;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    gap: 20px;
    width: 100%;
  }
`;

export const VaultIndicatorList = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 25px;
`;

export const VaultIndicatorItemWrapper = styled(Box)`
  flex-direction: column;
  flex-grow: 1;
  background: #2a3e5a;
  padding: 18px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 10px;
  }
`;

export const VaultIndicatorItemValue = styled(Typography)`
  font-size: 20px;
  font-weight: 700;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

type VaultIndicatorItemPropsType = {
  title: string;
  value: string | number;
  units: string;
};

type VaultStrategyItemPropsType = {
  strategyData: IVaultStrategy;
  vaultBalanceTokens: string;
  tokenName: string;
  totalFees: string;
};

const VaultIndicatorItem: FC<VaultIndicatorItemPropsType> = ({
  title,
  value,
  units,
}) => {
  return (
    <VaultIndicatorItemWrapper>
      <Typography fontSize="12px" color={"#5977a0"}>
        {title}
      </Typography>
      <VaultIndicatorItemValue>{value + units}</VaultIndicatorItemValue>
    </VaultIndicatorItemWrapper>
  );
};

const VaultStrategyItem: FC<VaultStrategyItemPropsType> = ({
  strategyData,
  vaultBalanceTokens,
  tokenName,
  totalFees,
}) => {
  const [aprHistoryArr, setAprHistoryArr] = useState<HistoryChartDataType[]>(
    []
  );
  const [lastReportDate, setLastReportDate] = useState<string>("");
  const [allocationShare, setAllocationShare] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean>(true);
  const { isMobile } = useSharedContext();

  useEffect(() => {
    if (!strategyData) return;

    const extractedData = [];

    for (const report of strategyData.reports) {
      extractedData.push({
        timestamp: report.timestamp,
        chartValue: BigNumber(report.results[0]?.apr || "0").toFixed(2),
      });
    }

    extractedData.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));

    const lastReport = dayjs(
      parseInt(strategyData.reports[0].timestamp, 10)
    ).fromNow();

    setLastReportDate(lastReport);
    setAprHistoryArr(extractedData);
  }, [strategyData]);

  useEffect(() => {
    const allocation =
      vaultBalanceTokens !== "0"
        ? BigNumber(strategyData.currentDebt)
            .dividedBy(BigNumber(vaultBalanceTokens).dividedBy(100))
            .toNumber()
        : 0;

    setAllocationShare(allocation);
  }, [strategyData, vaultBalanceTokens]);

  const totalGain = strategyData.reports.reduce(
    (acc: string, report: IVaultStrategyReport) => {
      return BigNumber(acc).plus(BigNumber(report.gain)).toString();
    },
    "0"
  );

  return (
    <VaultItemAccordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ width: "30px", height: "30px" }} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ padding: "0" }}
      >
        <Typography>Dynamic Market Analysis for Optimal Returns</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "0" }}>
        <Typography component={"p"} fontSize="12px" pb={2}>
          {strategyData.id}
        </Typography>
        <Typography fontSize="14px" pb={2}>
          Our strategy involves dynamically allocating our reserves to different
          investment opportunities. This flexibility allows us to capitalize on
          the best market conditions.
        </Typography>
        <Typography fontSize="14px">{`Last report ${lastReportDate}.`}</Typography>
        <VaultStrategyStatsWrapper>
          <VaultIndicatorsWrapper>
            <VaultIndicatorList>
              <VaultIndicatorItem
                title="Capital Allocation"
                value={`${formatNumber(
                  BigNumber(strategyData.currentDebt)
                    .dividedBy(10 ** 18)
                    .toNumber()
                )}`}
                units={` ${tokenName}`}
              />
              <VaultIndicatorItem
                title="Total Gain"
                value={formatNumber(
                  BigNumber(totalGain)
                    .dividedBy(10 ** 18)
                    .toNumber()
                )}
                units={` ${tokenName}`}
              />
            </VaultIndicatorList>
            <VaultIndicatorList sx={{ gap: 0 }}>
              <VaultIndicatorItem
                title="APR"
                value={formatNumber(
                  BigNumber(strategyData.reports[0].results[0].apr).toNumber()
                )}
                units="%"
              />
              <VaultIndicatorItem
                title="Allocation"
                value={formatNumber(allocationShare)}
                units="%"
              />
              <VaultIndicatorItem
                title="Perfomance fee"
                value={formatNumber(BigNumber(totalFees).toNumber())}
                units="%"
              />
            </VaultIndicatorList>
          </VaultIndicatorsWrapper>
          <Box width={isMobile ? "100%" : "50%"}>
            <VaultHistoryChart
              title={"Historical APR"}
              chartDataArray={aprHistoryArr}
              valueLabel="APR"
              valueUnits="%"
            />
          </Box>
        </VaultStrategyStatsWrapper>
      </AccordionDetails>
    </VaultItemAccordion>
  );
};

export default VaultStrategyItem;
