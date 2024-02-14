import { FC, useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { Link } from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
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
import { getAccountUrl } from "utils/explorer";
import { DEFAULT_CHAIN_ID } from "utils/Constants";
import useSharedContext from "context/shared";
import VaultHistoryChart, {
  HistoryChartDataType,
} from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultHistoryChart";

dayjs.extend(relativeTime);

export const VaultItemAccordion = styled(Accordion)`
  background: #132340;
  border-radius: 8px !important;
  padding: 20px 32px;
  margin-bottom: 5px;
  box-shadow: none;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    &.MuiPaper-root {
      &:before {
        background: none;
      }
    }
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
  text-align: center;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

type VaultIndicatorItemPropsType = {
  title: string;
  value: string | number;
  units: string;
  sx?: object;
};

type VaultStrategyItemPropsType = {
  strategyData: IVaultStrategy;
  vaultBalanceTokens: string;
  tokenName: string;
  performanceFee: number;
};

const VaultIndicatorItem: FC<VaultIndicatorItemPropsType> = ({
  title,
  value,
  units,
  sx,
}) => {
  return (
    <VaultIndicatorItemWrapper sx={sx}>
      <Typography fontSize="12px" textAlign={"center"} color={"#5977a0"}>
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
  performanceFee,
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

    const extractedData = strategyData.historicalApr
      .map((aprItem) => ({
        timestamp: aprItem.timestamp,
        chartValue: aprItem.apr,
      }))
      .sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));

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

  const totalGain = useMemo(
    () =>
      strategyData.reports.reduce(
        (acc: BigNumber, report: IVaultStrategyReport) => {
          return acc.plus(report.gain);
        },
        BigNumber(0)
      ),
    [strategyData]
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
        <Link
          to={getAccountUrl(strategyData.id, DEFAULT_CHAIN_ID)}
          target="_blank"
          style={{
            display: "inline-flex",
            fontSize: "12px",
            marginBottom: "16px",
          }}
        >
          {strategyData.id}
        </Link>
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
                sx={{ borderRadius: "8px" }}
              />
              <VaultIndicatorItem
                title="Total Gain"
                value={formatNumber(totalGain.dividedBy(10 ** 18).toNumber())}
                units={` ${tokenName}`}
                sx={{ borderRadius: "8px" }}
              />
            </VaultIndicatorList>
            <VaultIndicatorList
              sx={{ gap: 0, borderRadius: "8px", overflow: "hidden" }}
            >
              <VaultIndicatorItem
                title="APR"
                value={formatNumber(Number(strategyData.apr))}
                units="%"
              />
              <VaultIndicatorItem
                title="Allocation"
                value={formatNumber(allocationShare)}
                units="%"
              />
              <VaultIndicatorItem
                title="Perfomance fee"
                value={formatNumber(performanceFee)}
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
