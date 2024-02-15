import { FC, useMemo, useState } from "react";
import { Trade, TradeType } from "into-the-fathom-swap-sdk";
import { Typography } from "@mui/material";

import { Field } from "apps/dex/state/swap/actions";
import { TYPE } from "apps/dex/theme";
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from "apps/dex/utils/prices";
import { ButtonError } from "apps/dex/components/Button";
import { AutoColumn } from "apps/dex/components/Column";
import QuestionHelper from "apps/dex/components/QuestionHelper";
import { AutoRow, RowBetween, RowFixed } from "apps/dex/components/Row";
import FormattedPriceImpact from "apps/dex/components/swap/FormattedPriceImpact";
import {
  StyledBalanceMaxMini,
  SwapCallbackError,
} from "apps/dex/components/swap/styleds";

import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";

type SwapModalFooterProps = {
  trade: Trade;
  allowedSlippage: number;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  disabledConfirm: boolean;
};

const SwapModalFooter: FC<SwapModalFooterProps> = ({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}) => {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade]
  );
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(
    () => computeTradePriceBreakdown(trade),
    [trade]
  );
  const severity = warningSeverity(priceImpactWithoutFee);

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Typography fontWeight={400} fontSize={14} color={"#4F658C"}>
            Price
          </Typography>
          <Typography
            fontWeight={500}
            fontSize={14}
            color={"#fff"}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              textAlign: "right",
              paddingLeft: "10px",
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini
              onClick={() => setShowInverted(!showInverted)}
            >
              <RepeatRoundedIcon sx={{ width: "18px", height: "18px" }} />
            </StyledBalanceMaxMini>
          </Typography>
        </RowBetween>

        <RowBetween>
          <RowFixed sx={{ color: "#4F658C" }}>
            <TYPE.black fontSize={14} fontWeight={400} color={"#4F658C"}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? "Minimum received"
                : "Maximum sold"}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed sx={{ color: "#4F658C" }}>
            <TYPE.white fontSize={14}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? "-"
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? "-"}
            </TYPE.white>
            <TYPE.white fontSize={14} marginLeft={"4px"}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </TYPE.white>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed sx={{ color: "#4F658C" }}>
            <TYPE.black color={"#4F658C"} fontSize={14} fontWeight={400}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and your price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed sx={{ color: "#4F658C" }}>
            <TYPE.black fontSize={14} fontWeight={400} color={"#4F658C"}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <TYPE.white fontSize={14}>
            {realizedLPFee
              ? realizedLPFee?.toSignificant(6) +
                " " +
                trade.inputAmount.currency.symbol
              : "-"}
          </TYPE.white>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          error={severity > 2}
          style={{ margin: "10px 0 0 0" }}
          id="confirm-swap-or-send"
        >
          <Typography fontSize={20} fontWeight={500}>
            {severity > 2 ? "Swap Anyway" : "Confirm Swap"}
          </Typography>
        </ButtonError>

        {swapErrorMessage ? (
          <SwapCallbackError error={swapErrorMessage} />
        ) : null}
      </AutoRow>
    </>
  );
};

export default SwapModalFooter;
