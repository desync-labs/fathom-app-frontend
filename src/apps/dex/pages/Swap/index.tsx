import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import {
  Currency,
  CurrencyAmount,
  JSBI,
  Token,
  Trade,
} from "into-the-fathom-swap-sdk";
import { Box, CircularProgress, styled, Typography } from "@mui/material";

import useConnector from "context/connector";
import AddressInputPanel from "apps/dex/components/AddressInputPanel";
import {
  ButtonError,
  ButtonLight,
  ButtonPrimary,
  ButtonConfirmed,
} from "apps/dex/components/Button";
import Card, { GreyCard } from "apps/dex/components/Card";
import Column, { AutoColumn } from "apps/dex/components/Column";
import ConfirmSwapModal from "apps/dex/components/swap/ConfirmSwapModal";
import CurrencyInputPanel from "apps/dex/components/CurrencyInputPanel";
import { SwapPoolTabs } from "apps/dex/components/NavigationTabs";
import { AutoRow, RowBetween } from "apps/dex/components/Row";
import AdvancedSwapDetailsDropdown from "apps/dex/components/swap/AdvancedSwapDetailsDropdown";
import confirmPriceImpactWithoutFee from "apps/dex/components/swap/confirmPriceImpactWithoutFee";
import {
  ArrowDownWrapped,
  ArrowWrapper,
  BottomGrouping,
  SwapCallbackError,
  Wrapper,
} from "apps/dex/components/swap/styleds";
import TradePrice from "apps/dex/components/swap/TradePrice";
import TokenWarningModal from "apps/dex/components/TokenWarningModal";
import ProgressSteps from "apps/dex/components/ProgressSteps";
import SwapHeader from "apps/dex/components/swap/SwapHeader";

import { INITIAL_ALLOWED_SLIPPAGE } from "apps/dex/constants";
import { useActiveWeb3React } from "apps/dex/hooks";
import { useCurrency, useAllTokens } from "apps/dex/hooks/Tokens";
import {
  ApprovalState,
  useApproveCallbackFromTrade,
} from "apps/dex/hooks/useApproveCallback";
import { useSwapCallback } from "apps/dex/hooks/useSwapCallback";
import useWrapCallback, { WrapType } from "apps/dex/hooks/useWrapCallback";
import { useToggleSettingsMenu } from "apps/dex/state/application/hooks";
import { Field } from "apps/dex/state/swap/actions";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "apps/dex/state/swap/hooks";
import {
  useExpertModeManager,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
} from "apps/dex/state/user/hooks";
import { LinkStyledButton, TYPE } from "apps/dex/theme";
import { maxAmountSpend } from "apps/dex/utils/maxAmountSpend";
import {
  computeTradePriceBreakdown,
  warningSeverity,
} from "apps/dex/utils/prices";
import AppBody from "apps/dex/pages/AppBody";
import { ClickableText } from "apps/dex/pages/Pool/styleds";
import Loader from "apps/dex/components/Loader";
import { useIsTransactionUnsupported } from "apps/dex/hooks/Trades";
import UnsupportedCurrencyFooter from "apps/dex/components/swap/UnsupportedCurrencyFooter";

import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import walletSrc from "apps/dex/assets/svg/wallet.svg";
import walletHover from "apps/dex/assets/svg/wallet-hover.svg";

export const WalletIcon = styled(Box)`
  background: url("${walletSrc}") no-repeat center;
  width: 20px;
  height: 20px;
`;

export const ConnectWalletButton = styled(ButtonLight)`
  &:hover,
  &:active {
    div {
      background: url("${walletHover}") no-repeat center;
    }
  }
`;

const Swap = () => {
  const loadedUrlParams = useDefaultsFromURLSearch();
  const navigate = useNavigate();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const [dismissTokenWarning, setDismissTokenWarning] =
    useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c instanceof Token
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens();

  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens);
    });

  const { account } = useActiveWeb3React();

  const { openConnectorMenu } = useConnector();

  // for expert mode
  const toggleSettings = useToggleSettingsMenu();
  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo();

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
    wrappingLoading,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const trade = showWrap ? undefined : v2Trade;

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]:
          independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]:
          independentField === Field.OUTPUT
            ? parsedAmount
            : trade?.outputAmount,
      };

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
    navigate("/swap");
  }, [navigate]);

  // modal and loading
  const [
    { showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Trade | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ""
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const route = trade?.route;
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );
  const noRoute = !route;

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(
    trade,
    allowedSlippage
  );

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
    currencyBalances[Field.INPUT]
  );
  const atMaxAmountInput = Boolean(
    maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput)
  );

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient
  );

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const [singleHopOnly] = useUserSingleHopOnly();

  const handleSwap = useCallback(() => {
    if (
      priceImpactWithoutFee &&
      !confirmPriceImpactWithoutFee(priceImpactWithoutFee)
    ) {
      return;
    }
    if (!swapCallback) {
      return;
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    });
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        });

        ReactGA.event({
          category: "Swap",
          action:
            recipient === null
              ? "Swap w/o Send"
              : recipient === account
              ? "Swap w/o Send + recipient"
              : "Swap w/ Send",
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
          ].join("/"),
        });

        ReactGA.event({
          category: "Routing",
          action: singleHopOnly
            ? "Swap with multihop disabled"
            : "Swap with multihop enabled",
        });
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [
    priceImpactWithoutFee,
    swapCallback,
    tradeToConfirm,
    showConfirm,
    recipient,
    account,
    trade,
    singleHopOnly,
  ]);

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is an above the threshold in non-expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      approval === ApprovalState.APPROVED) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      showConfirm: false,
      tradeToConfirm,
      attemptingTxn,
      swapErrorMessage,
      txHash,
    });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, "");
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toSignificant(6));
  }, [maxAmountInput, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) =>
      onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  const swapIsUnsupported = useIsTransactionUnsupported(
    currencies?.INPUT,
    currencies?.OUTPUT
  );

  return (
    <>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
        onDismiss={handleDismissTokenWarning}
      />
      <SwapPoolTabs />
      <AppBody>
        <SwapHeader />
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />

          <AutoColumn gap={"md"}>
            <CurrencyInputPanel
              label={
                independentField === Field.OUTPUT && !showWrap && trade
                  ? "From (estimated)"
                  : "From"
              }
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="swap-currency-input"
            />
            <AutoColumn justify="space-between">
              <AutoRow justify={"center"} style={{ padding: "0 1rem" }}>
                <ArrowWrapper clickable>
                  <ArrowDownWrapped>
                    <ArrowDownwardRoundedIcon
                      onClick={() => {
                        onSwitchTokens();
                      }}
                      sx={{
                        width: "20px",
                        height: "20px",
                        color: "#000",
                      }}
                    />
                  </ArrowDownWrapped>
                </ArrowWrapper>
              </AutoRow>
            </AutoColumn>
            <CurrencyInputPanel
              value={formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              label={
                independentField === Field.INPUT && !showWrap && trade
                  ? "To (estimated)"
                  : "To"
              }
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              id="swap-currency-output"
            />
            {recipient === null && !showWrap && isExpertMode ? (
              <LinkStyledButton
                id="add-recipient-button"
                onClick={() => onChangeRecipient("")}
                style={{ textAlign: "right" }}
              >
                + Add a send (optional)
              </LinkStyledButton>
            ) : null}
            {recipient !== null && !showWrap ? (
              <LinkStyledButton
                id="remove-recipient-button"
                onClick={() => onChangeRecipient(null)}
                style={{ textAlign: "right", position: "relative", zIndex: 10 }}
              >
                - Remove send
              </LinkStyledButton>
            ) : null}
            {recipient !== null && !showWrap ? (
              <>
                <AutoRow justify="center" style={{ marginTop: "-35px" }}>
                  <ArrowWrapper clickable={false}>
                    <ArrowDownWrapped>
                      <ArrowDownwardRoundedIcon
                        sx={{
                          width: "20px",
                          height: "20px",
                          color: "#000",
                        }}
                      />
                    </ArrowDownWrapped>
                  </ArrowWrapper>
                </AutoRow>
                <AddressInputPanel
                  id="recipient"
                  value={recipient}
                  onChange={onChangeRecipient}
                />
              </>
            ) : null}

            {showWrap ? null : (
              <Card sx={{ padding: showWrap ? ".25rem 1rem 0 1rem" : 0 }}>
                <AutoColumn gap="8px" sx={{ padding: "0 16px" }}>
                  {Boolean(trade) && (
                    <RowBetween align="center">
                      <Typography
                        fontWeight={500}
                        fontSize={14}
                        color={"#4F658C"}
                      >
                        Price
                      </Typography>
                      <TradePrice
                        price={trade?.executionPrice}
                        showInverted={showInverted}
                        setShowInverted={setShowInverted}
                      />
                    </RowBetween>
                  )}
                  {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                    <RowBetween align="center">
                      <ClickableText
                        fontWeight={500}
                        fontSize={14}
                        color={"#4F658C"}
                        onClick={toggleSettings}
                      >
                        Slippage Tolerance
                      </ClickableText>
                      <ClickableText
                        fontWeight={500}
                        fontSize={14}
                        color={"#4F658C"}
                        onClick={toggleSettings}
                      >
                        {allowedSlippage / 100}%
                      </ClickableText>
                    </RowBetween>
                  )}
                </AutoColumn>
              </Card>
            )}
          </AutoColumn>
          <BottomGrouping>
            {swapIsUnsupported ? (
              <ButtonPrimary disabled={true}>
                <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
              </ButtonPrimary>
            ) : !account ? (
              <ConnectWalletButton
                onClick={openConnectorMenu}
                data-testid="dex-swap-connectWalletButton"
              >
                <WalletIcon></WalletIcon>
                Connect Wallet
              </ConnectWalletButton>
            ) : showWrap ? (
              <ButtonPrimary
                disabled={Boolean(wrapInputError) || wrappingLoading}
                onClick={onWrap}
                data-testid="dex-wrap-button"
              >
                {wrappingLoading ? (
                  <CircularProgress size={20} sx={{ color: "#00332f" }} />
                ) : (
                  wrapInputError ??
                  (wrapType === WrapType.WRAP
                    ? "Wrap"
                    : wrapType === WrapType.UNWRAP
                    ? "Unwrap"
                    : null)
                )}
              </ButtonPrimary>
            ) : noRoute && userHasSpecifiedInputOutput ? (
              <GreyCard style={{ textAlign: "center" }}>
                <TYPE.main mb="4px">
                  Insufficient liquidity for this trade.
                </TYPE.main>
                {singleHopOnly && (
                  <TYPE.main mb="4px">Try enabling multi-hop trades.</TYPE.main>
                )}
              </GreyCard>
            ) : showApproveFlow ? (
              <RowBetween>
                <ButtonConfirmed
                  onClick={approveCallback}
                  disabled={approval !== ApprovalState.NOT_APPROVED}
                  sx={{ width: "48%" }}
                  altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                  confirmed={approval === ApprovalState.APPROVED}
                >
                  {approval === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      Approving <Loader stroke="#061023" />
                    </AutoRow>
                  ) : approval === ApprovalState.APPROVED ? (
                    "Approved"
                  ) : (
                    "Approve " + currencies[Field.INPUT]?.symbol
                  )}
                </ButtonConfirmed>
                <ButtonError
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap();
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      });
                    }
                  }}
                  id="swap-button"
                  disabled={
                    !isValid ||
                    approval !== ApprovalState.APPROVED ||
                    (priceImpactSeverity > 3 && !isExpertMode)
                  }
                  error={isValid && priceImpactSeverity > 2}
                  sx={{ width: "48%" }}
                >
                  <Typography fontSize={16} fontWeight={500}>
                    {priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact High`
                      : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`}
                  </Typography>
                </ButtonError>
              </RowBetween>
            ) : (
              <ButtonError
                onClick={() => {
                  if (isExpertMode) {
                    handleSwap();
                  } else {
                    setSwapState({
                      tradeToConfirm: trade,
                      attemptingTxn: false,
                      swapErrorMessage: undefined,
                      showConfirm: true,
                      txHash: undefined,
                    });
                  }
                }}
                id="swap-button"
                disabled={
                  !isValid ||
                  (priceImpactSeverity > 3 && !isExpertMode) ||
                  !!swapCallbackError
                }
                error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
              >
                <Typography fontSize={20} fontWeight={500}>
                  {swapInputError
                    ? swapInputError
                    : priceImpactSeverity > 3 && !isExpertMode
                    ? `Price Impact Too High`
                    : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`}
                </Typography>
              </ButtonError>
            )}
            {showApproveFlow && (
              <Column style={{ marginTop: "1rem" }}>
                <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
              </Column>
            )}
            {isExpertMode && swapErrorMessage ? (
              <SwapCallbackError error={swapErrorMessage} />
            ) : null}
          </BottomGrouping>
        </Wrapper>
      </AppBody>
      {!swapIsUnsupported ? (
        <AdvancedSwapDetailsDropdown trade={trade} />
      ) : (
        <UnsupportedCurrencyFooter
          show={swapIsUnsupported}
          currencies={[currencies.INPUT, currencies.OUTPUT]}
        />
      )}
    </>
  );
};

export default Swap;
