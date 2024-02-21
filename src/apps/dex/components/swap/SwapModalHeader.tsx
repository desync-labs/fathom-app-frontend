import { FC, useMemo } from "react";
import { Trade, TradeType } from "into-the-fathom-swap-sdk";
import { Typography } from "@mui/material";

import { Field } from "apps/dex/state/swap/actions";
import { TYPE } from "apps/dex/theme";
import { ButtonPrimary } from "apps/dex/components/Button";
import { isAddress, shortenAddress } from "apps/dex/utils";
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  warningSeverity,
} from "apps/dex/utils/prices";
import { AutoColumn } from "apps/dex/components/Column";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import { AutoRow, RowBetween, RowFixed } from "apps/dex/components/Row";
import {
  TruncatedText,
  SwapShowAcceptChanges,
  ArrowDownWrapped,
} from "apps/dex/components/swap/styleds";

import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

type SwapModalHeaderProps = {
  trade: Trade;
  allowedSlippage: number;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
};

const SwapModalHeader: FC<SwapModalHeaderProps> = ({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}) => {
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage]
  );
  const { priceImpactWithoutFee } = useMemo(
    () => computeTradePriceBreakdown(trade),
    [trade]
  );
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  return (
    <AutoColumn gap={"md"} style={{ marginTop: "20px" }}>
      <RowBetween align="flex-end">
        <RowFixed gap={"0px"}>
          <CurrencyLogo
            currency={trade.inputAmount.currency}
            size={"24px"}
            style={{ marginRight: "12px" }}
          />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={
              showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT
                ? "#253656"
                : ""
            }
            data-testid="dex-swapModalHeader-fromAmount"
          >
            {trade.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={"0px"}>
          <Typography
            fontSize={24}
            fontWeight={500}
            style={{ marginLeft: "10px" }}
            data-testid="dex-swapModalHeader-fromTokenName"
          >
            {trade.inputAmount.currency.symbol}
          </Typography>
        </RowFixed>
      </RowBetween>
      <AutoRow justify={"center"}>
        <ArrowDownWrapped>
          <ArrowDownwardRoundedIcon
            sx={{ color: "#000", width: "20px", height: "20px" }}
          />
        </ArrowDownWrapped>
      </AutoRow>
      <RowBetween align="flex-end">
        <RowFixed gap={"0px"}>
          <CurrencyLogo
            currency={trade.outputAmount.currency}
            size={"24px"}
            style={{ marginRight: "12px" }}
          />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={
              priceImpactSeverity > 2
                ? "#FD4040"
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? "#253656"
                : ""
            }
            data-testid="dex-swapModalHeader-toAmount"
          >
            {trade.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={"0px"}>
          <Typography
            fontSize={"24px"}
            fontWeight={500}
            style={{ marginLeft: "10px" }}
            data-testid="dex-swapModalHeader-toTokenName"
          >
            {trade.outputAmount.currency.symbol}
          </Typography>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={"0px"}>
          <RowBetween>
            <RowFixed>
              <WarningAmberRoundedIcon
                sx={{ width: "20px", height: "20px", marginRight: "8px" }}
              />
              <TYPE.main color="#253656"> Price Updated</TYPE.main>
            </RowFixed>
            <ButtonPrimary
              style={{
                padding: ".5rem",
                width: "fit-content",
                fontSize: "0.825rem",
                borderRadius: "12px",
              }}
              onClick={onAcceptChanges}
            >
              Accept
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn
        justify="flex-start"
        gap="sm"
        style={{ padding: "12px 0 0 0px" }}
      >
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <TYPE.italic textAlign="left" style={{ width: "100%" }}>
            {`Output is estimated. You will receive at least `}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)}{" "}
              {trade.outputAmount.currency.symbol}
            </b>
            {" or the transaction will revert."}
          </TYPE.italic>
        ) : (
          <TYPE.italic textAlign="left" style={{ width: "100%" }}>
            {`Input is estimated. You will sell at most `}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)}{" "}
              {trade.inputAmount.currency.symbol}
            </b>
            {" or the transaction will revert."}
          </TYPE.italic>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn
          justify="flex-start"
          gap="sm"
          style={{ padding: "12px 0 0 0px" }}
        >
          <TYPE.main>
            Output will be sent to{" "}
            <b title={recipient}>
              {isAddress(recipient) ? shortenAddress(recipient, 4) : recipient}
            </b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  );
};

export default SwapModalHeader;
