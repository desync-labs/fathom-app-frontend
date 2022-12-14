import { useCallback, useEffect, useMemo, useState } from "react";
import { useStores } from "stores";
import useMetaMask from "context/metamask";
import debounce from "lodash.debounce";
import { SmartContractFactory } from "config/SmartContractFactory";
import useSyncContext from "context/sync";

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

  const [feeIn, setFeeIn] = useState<number>(0);
  const [feeOut, setFeeOut] = useState<number>(0);

  const [fxdPrice, setFxdPrice] = useState<number>(0);

  const { stableSwapStore, poolStore } = useStores();

  const { account, chainId } = useMetaMask()!;
  const { setLastTransactionBlock } = useSyncContext();

  const setOppositeCurrency = useCallback(
    (amount: number, currency: string, type: string) => {
      const oppositeValue =
        Number(
          currency === options[0] ? amount / fxdPrice : amount * fxdPrice
        ) || null;

      type === "input"
        ? setOutputValue(oppositeValue)
        : setInputValue(oppositeValue);
    },
    [fxdPrice, setInputValue, setOutputValue, options]
  );

  const approvalStatus = useMemo(
    () =>
      debounce(async (input: number, currency: string, type: string) => {
        let approved;
        approved =
          currency === options[0]
            ? await stableSwapStore.approvalStatusUsdt(account, input)
            : await stableSwapStore.approvalStatusStableCoin(account, input);

        type === "input"
          ? approved
            ? setApproveInputBtn(false)
            : setApproveInputBtn(true)
          : approved
          ? setApproveOutputBtn(false)
          : setApproveOutputBtn(true);
      }, 1000),
    [stableSwapStore, account, options, setApproveInputBtn, setApproveOutputBtn]
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
    (inputValue: number, outputValue: number) => {
      setInputCurrency(outputCurrency);
      setOutputCurrency(inputCurrency);

      approvalStatus(outputValue, outputCurrency, "input");

      setOutputValue(inputValue);
      setOppositeCurrency(inputValue, inputCurrency, "output");
    },
    [
      inputCurrency,
      outputCurrency,
      setInputCurrency,
      setOutputCurrency,
      setOppositeCurrency,
      approvalStatus,
    ]
  );

  useEffect(() => {
    handleCurrencyChange(inputCurrency, outputCurrency);
  }, [inputCurrency, outputCurrency, chainId, handleCurrencyChange]);

  useEffect(() => {
    Promise.all([stableSwapStore.getFeeIn(), stableSwapStore.getFeeOut()]).then(
      ([feeIn, feeOut]) => {
        setFeeIn(feeIn);
        setFeeOut(feeOut);
      }
    );
  }, [stableSwapStore, setFeeIn, setFeeOut]);

  const swapFee = useMemo(() => {
    /**
     * US+ to FXD
     */
    if (inputCurrency === options[0]) {
      return (inputValue! * feeIn) / 10 ** 18;
    } else {
      return (inputValue! * feeOut) / 10 ** 18;
    }
  }, [options, inputCurrency, inputValue, feeIn, feeOut]);

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

  const handleSwap = useCallback(async () => {
    setSwapPending(true);
    try {
      const receipt = await stableSwapStore.swapToken(
        inputCurrency,
        account,
        inputValue as number,
        outputValue as number,
        options[0]
      );

      setLastTransactionBlock(receipt.blockNumber);
      handleCurrencyChange(inputCurrency, outputCurrency);
    } catch (e) {
    } finally {
      setSwapPending(false);
    }
  }, [
    options,
    inputCurrency,
    outputCurrency,
    inputValue,
    outputValue,
    account,
    stableSwapStore,
    setSwapPending,
    handleCurrencyChange,
    setLastTransactionBlock,
  ]);

  const approveInput = useCallback(async () => {
    setApprovalPending("input");
    try {
      inputCurrency === options[0]
        ? await stableSwapStore.approveUsdt(account)
        : await stableSwapStore.approveStableCoin(account);
      setApproveInputBtn(false);
    } catch (e) {
      setApproveInputBtn(true);
    }
    setApprovalPending(null);
  }, [
    options,
    inputCurrency,
    stableSwapStore,
    account,
    setApprovalPending,
    setApproveInputBtn,
  ]);

  const approveOutput = useCallback(async () => {
    setApprovalPending("output");
    try {
      outputCurrency === options[0]
        ? await stableSwapStore.approveUsdt(account)
        : await stableSwapStore.approveStableCoin(account);

      setApproveOutputBtn(false);
    } catch (e) {
      setApproveOutputBtn(true);
    }

    setApprovalPending(null);
  }, [
    options,
    outputCurrency,
    stableSwapStore,
    account,
    setApprovalPending,
    setApproveOutputBtn,
  ]);

  const handleInputValueTextFieldChange = useCallback(
    (e: any) => {
      const { value } = e.target;
      setInputValue(value);
      approvalStatus(value, inputCurrency, "input");
      setOppositeCurrency(value, inputCurrency, "input");
    },
    [inputCurrency, setInputValue, setOppositeCurrency, approvalStatus]
  );

  const handleOutputValueTextFieldChange = useCallback(
    (e: any) => {
      const { value } = e.target;
      setOutputValue(value);
      approvalStatus(value, outputCurrency, "output");
      setOppositeCurrency(value, outputCurrency, "output");
    },
    [outputCurrency, setOutputValue, setOppositeCurrency, approvalStatus]
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
    /**
     * FXD to US+
     */
    let formattedBalance;
    if (inputCurrency === options[1]) {
      formattedBalance =
        Number(inputBalance / 10 ** 18) * (1 - feeOut / 10 ** 18);
    } else {
      formattedBalance = Number(inputBalance / 10 ** 18) || null;
    }
    setInputValue(formattedBalance);
    setOppositeCurrency(formattedBalance as number, inputCurrency, "input");
  }, [
    options,
    inputBalance,
    inputCurrency,
    feeOut,
    setOppositeCurrency,
    setInputValue,
  ]);

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
    swapFee,
  };
};

export default useStableSwap;
