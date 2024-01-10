import { valueToBigNumber } from "@aave/math-utils";
import { Trans } from "@lingui/macro";
import { useMediaQuery, useTheme } from "@mui/material";
import { marketContainerProps } from "apps/lending/pages/markets.page";

import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { TopInfoPanel } from "apps/lending/components/TopInfoPanel/TopInfoPanel";
import { TopInfoPanelItem } from "apps/lending/components/TopInfoPanel/TopInfoPanelItem";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";

export const MarketsTopPanel = () => {
  const { reserves, loading } = useAppDataContext();

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down("sm"));

  const aggregatedStats = reserves.reduce(
    (acc, reserve) => {
      return {
        totalLiquidity: acc.totalLiquidity.plus(reserve.totalLiquidityUSD),
        totalDebt: acc.totalDebt.plus(reserve.totalDebtUSD),
      };
    },
    {
      totalLiquidity: valueToBigNumber(0),
      totalDebt: valueToBigNumber(0),
    }
  );

  const valueTypographyVariant = downToSM ? "main16" : "main21";
  const symbolsVariant = downToSM ? "secondary16" : "secondary21";

  return (
    <TopInfoPanel
      containerProps={marketContainerProps}
      pageTitle={<Trans>Markets</Trans>}
      withMarketSwitcher
    >
      <TopInfoPanelItem
        hideIcon
        title={<Trans>Total market size</Trans>}
        loading={loading}
      >
        <FormattedNumber
          value={aggregatedStats.totalLiquidity.toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
      <TopInfoPanelItem
        hideIcon
        title={<Trans>Total available</Trans>}
        loading={loading}
      >
        <FormattedNumber
          value={aggregatedStats.totalLiquidity
            .minus(aggregatedStats.totalDebt)
            .toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
      <TopInfoPanelItem
        hideIcon
        title={<Trans>Total borrows</Trans>}
        loading={loading}
      >
        <FormattedNumber
          value={aggregatedStats.totalDebt.toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
    </TopInfoPanel>
  );
};
