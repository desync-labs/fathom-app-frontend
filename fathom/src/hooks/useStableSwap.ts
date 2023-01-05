import { useCallback, useEffect, useMemo, useState } from "react";
import { useStores } from "stores";
import debounce from "lodash.debounce";
import { SmartContractFactory } from "config/SmartContractFactory";
import useSyncContext from "context/sync";
import BigNumber from "bignumber.js";
import Xdc3 from "xdc3";
import { useMediaQuery, useTheme } from "@mui/material";
import useConnector from "context/connector";

const useStableSwap = (options: string[]) => {
  const [inputBalance, setInputBalance] = useState<number>(0);
  const [outputBalance, setOutputBalance] = useState<number>(0);

  const [inputCurrency, setInputCurrency] = useState<string>(options[0]);
  const [outputCurrency, setOutputCurrency] = useState<string>(options[1]);

  const [inputValue, setInputValue] = useState<number | string>("");
  const [outputValue, setOutputValue] = useState<number | string>("");

  const [approveInputBtn, setApproveInputBtn] = useState<boolean>(false);
  const [approveOutputBtn, setApproveOutputBtn] = useState<boolean>(false);

  const [approvalPending, setApprovalPending] = useState<string | null>(null);
  const [swapPending, setSwapPending] = useState<boolean>(false);

  const [feeIn, setFeeIn] = useState<number>(0);
  const [feeOut, setFeeOut] = useState<number>(0);

  const [fxdPrice, setFxdPrice] = useState<number>(0);

  const { stableSwapStore, poolStore } = useStores();

  const { account, chainId, library } = useConnector()!;
  const { setLastTransactionBlock } = useSyncContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const setOppositeCurrency = useCallback(
    (amount: number, currency: string, type: string) => {
      let oppositeValue;
      if (currency === options[0]) {
        console.log("US+ -> FXD", 1 - feeIn / 10 ** 18);
        oppositeValue = amount * (1 - feeIn / 10 ** 18);
      } else {
        console.log("FXD -> US+", feeOut / 10 ** 18 + 1);
        oppositeValue = amount / (feeOut / 10 ** 18 + 1);
      }

      type === "input"
        ? setOutputValue(oppositeValue)
        : setInputValue(oppositeValue);
    },
    [options, feeIn, feeOut, setInputValue, setOutputValue]
  );

  const approvalStatus = useMemo(
    () =>
      debounce(async (input: number, currency: string, type: string) => {
        if (account) {
          let approved;
          approved =
            currency === options[0]
              ? await stableSwapStore.approvalStatusUsdt(account, input, library)
              : await stableSwapStore.approvalStatusStableCoin(account, input, library);

          type === "input"
            ? approved
              ? setApproveInputBtn(false)
              : setApproveInputBtn(true)
            : approved
            ? setApproveOutputBtn(false)
            : setApproveOutputBtn(true);
        }
      }, 1000),
    [stableSwapStore, account, library, options, setApproveInputBtn, setApproveOutputBtn]
  );

  const inputError = useMemo(() => {
    const formattedBalance = inputBalance / 10 ** 18;

    return (inputValue as number) > formattedBalance;
  }, [inputValue, inputBalance]);

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
              poolStore.getUserTokenBalance(account, inputContractAddress, library)
            );
            promises.push(
              poolStore.getUserTokenBalance(account, outputCurrencyAddress, library)
            );
            promises.push(poolStore.getDexPrice(FXDContractAddress, library));

            const [inputBalance, outputBalance, fxdPrice] = await Promise.all(
              promises
            );

            setInputBalance(inputBalance);
            setOutputBalance(outputBalance);
            setFxdPrice(fxdPrice / 10 ** 18);
          } catch (e) {}
        }
      }, 100),
    [account, chainId, poolStore, library, setInputBalance, setOutputBalance]
  );

  const changeCurrenciesPosition = useCallback(
    (inputValue: number, outputValue: number) => {
      setInputCurrency(outputCurrency);
      setOutputCurrency(inputCurrency);

      approvalStatus(outputValue, outputCurrency, "input");

      setOutputValue("");
      setInputValue("");
    },
    [
      inputCurrency,
      outputCurrency,
      setInputCurrency,
      setOutputCurrency,
      approvalStatus,
      setInputValue,
      setOutputValue,
    ]
  );

  useEffect(() => {
    chainId && handleCurrencyChange(inputCurrency, outputCurrency);
  }, [inputCurrency, outputCurrency, chainId, handleCurrencyChange]);

  useEffect(() => {
    if (chainId) {
      Promise.all([
        stableSwapStore.getFeeIn(library),
        stableSwapStore.getFeeOut(library),
      ]).then(([feeIn, feeOut]) => {
        setFeeIn(feeIn);
        setFeeOut(feeOut);
      });
    }
  }, [stableSwapStore, chainId, library, setFeeIn, setFeeOut]);

  const swapFee = useMemo(() => {
    /**
     * US+ to FXD
     */
    if (inputCurrency === options[0]) {
      return (Number(inputValue) * feeIn) / 10 ** 18;
    } else {
      return (Number(inputValue) * feeOut) / 10 ** 18;
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
        options[0],
        library
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
    library,
    stableSwapStore,
    setSwapPending,
    handleCurrencyChange,
    setLastTransactionBlock,
  ]);

  const approveInput = useCallback(async () => {
    setApprovalPending("input");
    try {
      inputCurrency === options[0]
        ? await stableSwapStore.approveUsdt(account, library)
        : await stableSwapStore.approveStableCoin(account, library);
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
    library,
    setApprovalPending,
    setApproveInputBtn,
  ]);

  const approveOutput = useCallback(async () => {
    setApprovalPending("output");
    try {
      outputCurrency === options[0]
        ? await stableSwapStore.approveUsdt(account, library)
        : await stableSwapStore.approveStableCoin(account, library);

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
    library,
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
      formattedBalance = new BigNumber(
        Xdc3.utils.fromWei(inputBalance.toString())
      )
        .multipliedBy(
          1 - new BigNumber(Xdc3.utils.fromWei(feeOut.toString())).toNumber()
        )
        .toNumber();
    } else {
      formattedBalance =
        new BigNumber(Xdc3.utils.fromWei(inputBalance.toString())).toNumber() ||
        0;
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
    inputError,

    isMobile,
  };
};

export default useStableSwap;
