import { FC } from "react";
import { Link } from "react-router-dom";
import { Trade, TradeType } from "into-the-fathom-swap-sdk";
import { styled } from "@mui/material";

import { Field } from "apps/dex/state/swap/actions";
import { useUserSlippageTolerance } from "apps/dex/state/user/hooks";
import { TYPE } from "apps/dex/theme";
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
} from "apps/dex/utils/prices";
import { AutoColumn } from "apps/dex/components/Column";
import QuestionHelper from "apps/dex/components/QuestionHelper";
import { RowBetween, RowFixed } from "apps/dex/components/Row";
import FormattedPriceImpact from "apps/dex/components/swap/FormattedPriceImpact";
import SwapRoute from "apps/dex/components/swap/SwapRoute";

const InfoLink = styled(Link)`
  width: 100%;
  border: 1px solid #43fff6;
  padding: 6px 6px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: #ffffff;
`;

type TradeSummaryProps = {
  trade: Trade;
  allowedSlippage: number;
};

const TradeSummary: FC<TradeSummaryProps> = ({ trade, allowedSlippage }) => {
  const { priceImpactWithoutFee, realizedLPFee } =
    computeTradePriceBreakdown(trade);
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT;
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(
    trade,
    allowedSlippage
  );

  return (
    <>
      <AutoColumn style={{ padding: "0 16px" }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={"#4F658C"}>
              {isExactIn ? "Minimum received" : "Maximum sold"}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={"#ffffff"} fontSize={14}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${
                    trade.outputAmount.currency.symbol
                  }` ?? "-"
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${
                    trade.inputAmount.currency.symbol
                  }` ?? "-"}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={"#4F658C"}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={"#4F658C"}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <TYPE.black fontSize={14} color={"#ffffff"}>
            {realizedLPFee
              ? `${realizedLPFee.toSignificant(4)} ${
                  trade.inputAmount.currency.symbol
                }`
              : "-"}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  );
};

export interface AdvancedSwapDetailsProps {
  trade?: Trade;
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance();

  const showRoute = Boolean(trade && trade.route.path.length > 2);

  return (
    <AutoColumn gap="0px">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <RowBetween style={{ padding: "0 16px" }}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <TYPE.black fontSize={14} fontWeight={400} color={"#4F658C"}>
                    Route
                  </TYPE.black>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
          {!showRoute && (
            <AutoColumn style={{ padding: "12px 16px 0 16px" }}>
              <InfoLink
                to={
                  "/charts/pair/" + trade.route.pairs[0].liquidityToken.address
                }
                target="_blank"
              >
                View pair analytics ↗
              </InfoLink>
            </AutoColumn>
          )}
        </>
      )}
    </AutoColumn>
  );
}
