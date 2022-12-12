import { useCallback, useEffect, useMemo, useState } from "react";
import { useStores } from "stores";
import useMetaMask from "context/metamask";
import debounce from "lodash.debounce";
import { SmartContractFactory } from "config/SmartContractFactory";

const useStableSwap = (options: string[]) => {
  const [inputBalance, setInputBalance] = useState<number>(0);
  const [outputBalance, setOutputBalance] = useState<number>(0);

  const [inputCurrency, setInputCurrency] = useState<string>(options[0]);
  const [outputCurrency, setOutputCurrency] = useState<string>(options[1]);

  const [inputValue, setInputValue] = useState<number | null>(null);
  const [outputValue, setOutputValue] = useState<number | null>(null);

  const [approveInputBtn, setApproveInputBtn] = useState<boolean>(false);
  const [approveOutputBtn, setApproveOutputBtn] = useState<boolean>(false);

  const [approvalPending, setApprovalPending] = useState<string | null>(null);
  const [swapPending, setSwapPending] = useState<boolean>(false);

  const [fxdPrice, setFxdPrice] = useState<number>(0);

  const { stableSwapStore, poolStore } = useStores();

  const { account, chainId } = useMetaMask()!;

  const setOppositeCurrency = useCallback(
    (amount: number, currency: string, type: string) => {
      const oppositeValue = Number(
        currency === "USDT" ? amount / fxdPrice : amount * fxdPrice
      ) || null;

      type === "input"
        ? setOutputValue(oppositeValue)
        : setInputValue(oppositeValue);
    },
    [fxdPrice, setInputValue, setOutputValue]
  );

  const approvalStatus = useMemo(
    () =>
      debounce(async (input: number, currency: string, type: string) => {
        let approved;
        approved =
          currency === "USDT"
            ? await stableSwapStore.approvalStatusUsdt(account, input)
            : await stableSwapStore.approvalStatusStableCoin(account, input);

        type === "input"
          ? approved
            ? setApproveInputBtn(false)
            : setApproveInputBtn(true)
          : approved
          ? setApproveOutputBtn(false)
          : setApproveOutputBtn(true);
      }, 300),
    [stableSwapStore, account, setApproveInputBtn, setApproveOutputBtn]
  );

  const handleCurrencyChange = useMemo(
    () =>
      debounce(async (inputCurrency: string, outputCurrency: string) => {
        if (
          inputCurrency &&
          outputCurrency &&
          inputCurrency !== outputCurrency
        ) {
          const inputContractAddress =
            SmartContractFactory.getAddressByContractName(
              chainId!,
              inputCurrency
            );

          const outputCurrencyAddress =
            SmartContractFactory.getAddressByContractName(
              chainId!,
              outputCurrency
            );

          const FXDContractAddress =
            SmartContractFactory.getAddressByContractName(chainId, "FXD");

          try {
            const promises = [];
            promises.push(
              poolStore.getUserTokenBalance(account, inputContractAddress)
            );
            promises.push(
              poolStore.getUserTokenBalance(account, outputCurrencyAddress)
            );
            promises.push(poolStore.getDexPrice(FXDContractAddress));

            const [inputBalance, outputBalance, fxdPrice] = await Promise.all(
              promises
            );

            setInputBalance(inputBalance);
            setOutputBalance(outputBalance);
            setFxdPrice(fxdPrice / 10 ** 18);
          } catch (e) {}
        }
      }, 100),
    [account, chainId, poolStore, setInputBalance, setOutputBalance]
  );

  const changeCurrenciesPosition = useCallback(
    (inputValue: number) => {
      setInputCurrency(outputCurrency);
      setOutputCurrency(inputCurrency);

      setOutputValue(inputValue);
      setOppositeCurrency(inputValue, inputCurrency, "output");
    },
    [
      inputCurrency,
      outputCurrency,
      setInputCurrency,
      setOutputCurrency,
      setOppositeCurrency,
    ]
  );

  useEffect(() => {
    if (inputValue) {
      approvalStatus(inputValue, inputCurrency, "input");
    }
  }, [inputValue, inputCurrency, approvalStatus]);

  useEffect(() => {
    handleCurrencyChange(inputCurrency, outputCurrency);
  }, [inputCurrency, outputCurrency, chainId, handleCurrencyChange]);

  useEffect(() => {
    if (inputCurrency) {
      let index = options.indexOf(inputCurrency);
      index++;
      index = index > options.length - 1 ? 0 : index;
      setOutputCurrency(options[index]);
    }
  }, [inputCurrency, options]);

  useEffect(() => {
    if (outputCurrency) {
      let index = options.indexOf(outputCurrency);
      index++;
      index = index > options.length - 1 ? 0 : index;
      setInputCurrency(options[index]);
    }
  }, [outputCurrency, options]);

  useEffect(() => {
    if (outputValue) {
      approvalStatus(outputValue, outputCurrency, "output");
    }
  }, [outputValue, outputCurrency, approvalStatus]);

  const handleSwap = useCallback(async () => {
    setSwapPending(true);
    try {
      await stableSwapStore.swapToken(inputCurrency, account, inputValue as number);
      handleCurrencyChange(inputCurrency, outputCurrency);
    } catch (e) {}
    setSwapPending(false);
  }, [
    inputCurrency,
    outputCurrency,
    inputValue,
    account,
    stableSwapStore,
    setSwapPending,
    handleCurrencyChange,
  ]);

  const approveInput = useCallback(async () => {
    setApprovalPending("input");
    try {
      inputCurrency === "USDT"
        ? await stableSwapStore.approveUsdt(account)
        : await stableSwapStore.approveStableCoin(account);
      setApproveInputBtn(false);
    } catch (e) {
      setApproveInputBtn(true);
    }
    setApprovalPending(null);
  }, [
    setApprovalPending,
    setApproveInputBtn,
    inputCurrency,
    stableSwapStore,
    account,
  ]);

  const approveOutput = useCallback(async () => {
    setApprovalPending("output");
    try {
      outputCurrency === "USDT"
        ? await stableSwapStore.approveUsdt(account)
        : await stableSwapStore.approveStableCoin(account);

      setApproveOutputBtn(false);
    } catch (e) {
      setApproveOutputBtn(true);
    }

    setApprovalPending(null);
  }, [
    setApprovalPending,
    setApproveOutputBtn,
    outputCurrency,
    stableSwapStore,
    account,
  ]);

  const handleInputValueTextFieldChange = useCallback(
    (e: any) => {
      const { value } = e.target;
      setInputValue(value);
      setOppositeCurrency(value, inputCurrency, "input");
    },
    [inputCurrency, setInputValue, setOppositeCurrency]
  );

  const handleOutputValueTextFieldChange = useCallback(
    (e: any) => {
      const { value } = e.target;
      setOutputValue(value);
      setOppositeCurrency(value, outputCurrency, "output");
    },
    [outputCurrency, setOutputValue, setOppositeCurrency]
  );

  const setInputCurrencyHandler = useCallback(
    (currency: string) => {
      setInputCurrency(currency);
      setOppositeCurrency(inputValue as number, currency, "input");
    },
    [inputValue, setInputCurrency, setOppositeCurrency]
  );

  const setOutputCurrencyHandler = useCallback(
    (currency: string) => {
      setOutputCurrency(currency);
      setOppositeCurrency(outputValue as number, currency, "output");
    },
    [outputValue, setOutputCurrency, setOppositeCurrency]
  );

  const setMax = useCallback(() => {
    const formattedBalance = Number(inputBalance / 10 ** 18) || null;
    setInputValue(formattedBalance);
    setOppositeCurrency(formattedBalance as number, inputCurrency, "input");
  }, [inputBalance, inputCurrency, setInputValue, setOppositeCurrency]);

  return {
    inputValue,
    outputValue,

    handleInputValueTextFieldChange,
    handleOutputValueTextFieldChange,

    approvalPending,
    swapPending,

    approveInputBtn,
    approveOutputBtn,

    approveInput,
    approveOutput,

    handleSwap,
    inputCurrency,
    setInputCurrency,
    outputCurrency,
    setOutputCurrency,

    inputBalance,
    outputBalance,
    fxdPrice,

    changeCurrenciesPosition,
    setMax,

    setInputCurrencyHandler,
    setOutputCurrencyHandler,
  };
};

export default useStableSwap;
