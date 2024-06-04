import { utils } from "fathom-ethers";
import {
  Currency,
  CurrencyAmount,
  JSBI,
  Token,
  TokenAmount,
  Trade,
  XDC,
} from "into-the-fathom-swap-sdk";
import { ParsedQs } from "qs";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useActiveWeb3React } from "apps/dex/hooks";
import { useCurrency } from "apps/dex/hooks/Tokens";
import { useTradeExactIn, useTradeExactOut } from "apps/dex/hooks/Trades";
import useParsedQueryString from "apps/dex/hooks/useParsedQueryString";
import { isAddress } from "apps/dex/utils";
import { AppDispatch, AppState } from "apps/dex/state/index";
import { useCurrencyBalances } from "apps/dex/state/wallet/hooks";
import {
  Field,
  replaceSwapState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from "apps/dex/state/swap/actions";
import { SwapState } from "apps/dex/state/swap/reducer";
// import useToggledVersion from "apps/dex/hooks/useToggledVersion";
import { useUserSlippageTolerance } from "apps/dex/state/user/hooks";
import { computeSlippageAdjustedAmounts } from "apps/dex/utils/prices";

export function useSwapState(): AppState["swap"] {
  return useSelector<AppState, AppState["swap"]>((state) => state.swap);
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void;
  onSwitchTokens: () => void;
  onUserInput: (field: Field, typedValue: string) => void;
  onChangeRecipient: (recipient: string | null) => void;
} {
  const dispatch = useDispatch<AppDispatch>();
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      let currencyId;
      if (currency instanceof Token) {
        currencyId = currency.address;
      } else if (currency === XDC) {
        currencyId = "XDC";
      } else {
        currencyId = "";
      }

      dispatch(
        selectCurrency({
          field,
          currencyId,
        })
      );
    },
    [dispatch]
  );

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies());
  }, [dispatch]);

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch]
  );

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }));
    },
    [dispatch]
  );

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  };
}

// try to parse a user entered amount for a given token
export function tryParseAmount(
  value?: string,
  currency?: Currency
): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined;
  }

  try {
    const typedValueParsed = utils
      .parseUnits(value, currency.decimals)
      .toString();
    if (typedValueParsed !== "0") {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.xdc(JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

const BAD_RECIPIENT_ADDRESSES: string[] = [
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", // v2 factory
  "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a", // v2 router 01
  "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // v2 router 02
];

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade, checksummedAddress: string): boolean {
  return (
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some(
      (pair) => pair.liquidityToken.address === checksummedAddress
    )
  );
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): {
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount };
  parsedAmount: CurrencyAmount | undefined;
  v2Trade: Trade | undefined;
  inputError?: string;
} {
  const { account } = useActiveWeb3React();

  // const toggledVersion = useToggledVersion();

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);
  const to: string | null = (recipient === null ? account : recipient) ?? null;

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);

  const isExactIn: boolean = independentField === Field.INPUT;
  const parsedAmount = tryParseAmount(
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );

  const bestTradeExactIn = useTradeExactIn(
    isExactIn ? parsedAmount : undefined,
    outputCurrency ?? undefined
  );
  const bestTradeExactOut = useTradeExactOut(
    inputCurrency ?? undefined,
    !isExactIn ? parsedAmount : undefined
  );

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  };

  let inputError: string | undefined;
  if (!account) {
    inputError = "Connect Wallet";
  }

  if (!parsedAmount) {
    inputError = inputError ?? "Enter an amount";
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? "Select a token";
  }

  const formattedTo = isAddress(to);
  if (!to || !formattedTo) {
    inputError = inputError ?? "Enter a recipient";
  } else {
    if (
      BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
      (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
      (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
    ) {
      inputError = inputError ?? "Invalid recipient";
    }
  }

  const [allowedSlippage] = useUserSlippageTolerance();

  const slippageAdjustedAmounts =
    v2Trade &&
    allowedSlippage &&
    computeSlippageAdjustedAmounts(v2Trade, allowedSlippage);

  // compare input balance to max input based on a version

  if (
    slippageAdjustedAmounts &&
    currencyBalances[Field.INPUT] &&
    currencyBalances[Field.INPUT].lessThan(
      (slippageAdjustedAmounts as any)[Field.INPUT]
    )
  ) {
    inputError =
      "Insufficient " +
      (slippageAdjustedAmounts as any)[Field.INPUT].currency.symbol +
      " balance";
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
    inputError,
  };
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === "string") {
    const valid = isAddress(urlParam);
    if (valid) return valid;
    if (urlParam.toUpperCase() === "XDC") return "XDC";
    if (valid === false) {
      return "XDC";
    }
  }
  return "XDC";
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === "string" && !isNaN(parseFloat(urlParam))
    ? urlParam
    : "";
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === "string" && urlParam.toLowerCase() === "output"
    ? Field.OUTPUT
    : Field.INPUT;
}

const ENS_NAME_REGEX =
  /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/;
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== "string") return null;
  const address = isAddress(recipient);
  if (address) return address;
  if (ENS_NAME_REGEX.test(recipient)) return recipient;
  if (ADDRESS_REGEX.test(recipient)) return recipient;
  return null;
}

export function queryParametersToSwapState(parsedQs: ParsedQs): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency);
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency);
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === "string") {
      inputCurrency = "";
    } else {
      outputCurrency = "";
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient);

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
  };
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | {
      inputCurrencyId: string | undefined;
      outputCurrencyId: string | undefined;
    }
  | undefined {
  const { chainId } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const parsedQs = useParsedQueryString();
  const [result, setResult] = useState<
    | {
        inputCurrencyId: string | undefined;
        outputCurrencyId: string | undefined;
      }
    | undefined
  >();

  useEffect(() => {
    if (!chainId) return;
    const parsed = queryParametersToSwapState(parsedQs);

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: parsed.recipient,
      })
    );

    setResult({
      inputCurrencyId: parsed[Field.INPUT].currencyId,
      outputCurrencyId: parsed[Field.OUTPUT].currencyId,
    });
  }, [dispatch, chainId]);

  return result;
}
