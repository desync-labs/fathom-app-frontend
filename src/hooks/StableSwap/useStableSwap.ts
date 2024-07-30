import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useServices } from "context/services";
import debounce from "lodash.debounce";
import { SmartContractFactory } from "fathom-sdk";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { formatNumber } from "utils/format";
import { PricesContext } from "context/prices";
import { useNavigate } from "react-router-dom";
import BigNumber from "bignumber.js";

const useStableSwap = (options: string[]) => {
  const [inputBalance, setInputBalance] = useState<string>("0");
  const [outputBalance, setOutputBalance] = useState<string>("0");

  const [fxdAvailable, setFxdAvailable] = useState<string>("0");
  const [usStableAvailable, setUsStableAvailable] = useState<string>("0");

  const [inputCurrency, setInputCurrency] = useState<string>(options[0]);
  const [outputCurrency, setOutputCurrency] = useState<string>(options[1]);

  const [inputDecimals, setInputDecimals] = useState<string>("18");
  const [outputDecimals, setOutputDecimals] = useState<string>("18");

  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");

  const [approveInputBtn, setApproveInputBtn] = useState<boolean>(false);
  const [approveOutputBtn, setApproveOutputBtn] = useState<boolean>(false);

  const [approvalPending, setApprovalPending] = useState<string | null>(null);
  const [swapPending, setSwapPending] = useState<boolean>(false);

  const [oneTimeSwapLimit, setOneTimeSwapLimit] = useState<string>("0");
  const [displayDailyLimit, setDisplayDailyLimit] = useState<string>("0");

  const [feeIn, setFeeIn] = useState<string>("0");
  const [feeOut, setFeeOut] = useState<string>("0");

  const [depositTracker, setDepositTracker] = useState<string>("0");
  const [totalLocked, setTotalLocked] = useState<string>("0");

  const { fxdPrice: fxdPriceInWei } = useContext(PricesContext);

  const { stableSwapService, poolService } = useServices();

  const { account, chainId, isDecentralizedState, isUserWhiteListed } =
    useConnector();
  const { setLastTransactionBlock } = useSyncContext();

  const navigate = useNavigate();

  const fxdPrice = useMemo(() => {
    return BigNumber(fxdPriceInWei)
      .dividedBy(10 ** 18)
      .toNumber();
  }, [fxdPriceInWei]);

  const setOppositeCurrency = useCallback(
    (amount: string, currency: string, type: string) => {
      let oppositeValue;
      if (currency === options[0]) {
        console.log(
          "xUSDT -> FXD",
          BigNumber(1)
            .minus(BigNumber(feeIn).dividedBy(10 ** 18))
            .toString()
        );
        oppositeValue = BigNumber(amount).multipliedBy(
          BigNumber(1).minus(BigNumber(feeIn).dividedBy(10 ** 18))
        );
      } else {
        console.log(
          "FXD -> xUSDT",
          BigNumber(feeOut)
            .dividedBy(10 ** 18)
            .plus(1)
            .toString()
        );
        oppositeValue = BigNumber(amount).dividedBy(
          BigNumber(feeOut)
            .dividedBy(10 ** 18)
            .plus(1)
        );
      }

      oppositeValue = oppositeValue.isGreaterThan(0.0001)
        ? oppositeValue.decimalPlaces(6, BigNumber.ROUND_DOWN).toString()
        : "0";

      type === "input"
        ? setOutputValue(oppositeValue)
        : setInputValue(oppositeValue);
    },
    [options, feeIn, feeOut, setInputValue, setOutputValue]
  );

  const approvalStatus = useMemo(
    () =>
      debounce(async (input: string, currency: string, type: string) => {
        if (account) {
          const approved =
            currency === options[0]
              ? await stableSwapService.approvalStatusUsdt(
                  account,
                  input,
                  inputDecimals
                )
              : await stableSwapService.approvalStatusStableCoin(
                  account,
                  input,
                  inputDecimals
                );

          type === "input"
            ? approved
              ? setApproveInputBtn(false)
              : setApproveInputBtn(true)
            : approved
            ? setApproveOutputBtn(false)
            : setApproveOutputBtn(true);
        }
      }, 1000),
    [
      account,
      stableSwapService,
      options,
      inputDecimals,
      setApproveInputBtn,
      setApproveOutputBtn,
    ]
  );

  const inputError = useMemo(() => {
    const formattedBalance = BigNumber(inputBalance).dividedBy(
      BigNumber(10).exponentiatedBy(inputDecimals)
    );

    if (BigNumber(inputValue).isGreaterThan(formattedBalance)) {
      return `You do not have enough ${inputCurrency}`;
    }

    if (
      isDecentralizedState &&
      BigNumber(inputValue).isGreaterThan(displayDailyLimit)
    ) {
      return `You can't swap more then remaining daily limit ${formatNumber(
        Number(displayDailyLimit)
      )} FXD`;
    }

    if (BigNumber(inputValue).isGreaterThan(oneTimeSwapLimit)) {
      return `You can't swap more then one time limit ${formatNumber(
        Number(oneTimeSwapLimit)
      )} FXD`;
    }

    return false;
  }, [
    inputValue,
    inputCurrency,
    inputDecimals,
    inputBalance,
    displayDailyLimit,
    isDecentralizedState,
  ]);

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
              chainId,
              inputCurrency
            );

          const outputCurrencyAddress =
            SmartContractFactory.getAddressByContractName(
              chainId,
              outputCurrency
            );

          const FXDContractAddress =
            SmartContractFactory.getAddressByContractName(chainId, "FXD");

          const UsStableContractAddress =
            SmartContractFactory.getAddressByContractName(chainId, "xUSDT");

          const [
            inputBalance,
            outputBalance,
            inputDecimals,
            outputDecimals,
            fxdAvailable,
            usStableAvailable,
            totalLocked,
            depositTracker,
          ] = await Promise.all([
            poolService.getUserTokenBalance(account, inputContractAddress),
            poolService.getUserTokenBalance(account, outputCurrencyAddress),
            poolService.getTokenDecimals(inputContractAddress),
            poolService.getTokenDecimals(outputCurrencyAddress),
            stableSwapService.getPoolBalance(FXDContractAddress),
            stableSwapService.getPoolBalance(UsStableContractAddress),
            stableSwapService.getTotalValueLocked(),
            stableSwapService.getDepositTracker(account),
          ]);

          setTotalLocked(totalLocked.toString());
          setDepositTracker(depositTracker.toString());
          setFxdAvailable(
            BigNumber(fxdAvailable.toString())
              .dividedBy(
                BigNumber(10).exponentiatedBy(
                  (inputCurrency === options[1]
                    ? inputDecimals
                    : outputDecimals
                  ).toString()
                )
              )
              .toString()
          );
          setUsStableAvailable(
            BigNumber(usStableAvailable.toString())
              .dividedBy(
                BigNumber(10).exponentiatedBy(
                  (inputCurrency === options[0]
                    ? inputDecimals
                    : outputDecimals
                  ).toString()
                )
              )
              .toString()
          );

          setInputDecimals(inputDecimals.toString());
          setOutputDecimals(outputDecimals.toString());

          setInputBalance(inputBalance.toString());
          setOutputBalance(outputBalance.toString());
        }
      }, 100),
    [
      account,
      chainId,
      poolService,
      stableSwapService,
      options,
      setInputDecimals,
      setOutputDecimals,
      setInputBalance,
      setOutputBalance,
      setTotalLocked,
      setDepositTracker,
    ]
  );

  const changeCurrenciesPosition = useCallback(
    (_: string, outputValue: string) => {
      setInputCurrency(outputCurrency);
      setOutputCurrency(inputCurrency);
      if (outputValue) {
        approvalStatus(outputValue, outputCurrency, "input");
      }

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
    if (isDecentralizedState) {
      updateDailySwapLimit();
    }
    updateOneTimeSwapLimit();
  }, [stableSwapService, isDecentralizedState]);

  useEffect(() => {
    if (chainId) {
      Promise.all([
        stableSwapService.getFeeIn(),
        stableSwapService.getFeeOut(),
      ]).then(([feeIn, feeOut]) => {
        setFeeIn(feeIn.toString());
        setFeeOut(feeOut.toString());
      });
    }
  }, [stableSwapService, chainId, setFeeIn, setFeeOut]);

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

  const updateDailySwapLimit = useCallback(() => {
    stableSwapService.getDailySwapLimit().then((dailyLimitRes) => {
      setDisplayDailyLimit(
        BigNumber(dailyLimitRes.toString())
          .dividedBy(10 ** 18)
          .toString()
      );
    });
  }, [stableSwapService]);

  const updateOneTimeSwapLimit = useCallback(() => {
    Promise.all([
      stableSwapService.getTotalValueDeposited(),
      stableSwapService.getSingleSwapLimitNumerator(),
      stableSwapService.getSingleSwapLimitDenominator(),
    ])
      .then(
        ([
          totalValueDeposited,
          singleSwapLimitNumerator,
          singleSwapLimitDenominator,
        ]) => {
          const oneTimeSwapLimit = BigNumber(totalValueDeposited.toString())
            .multipliedBy(singleSwapLimitNumerator.toString())
            .dividedBy(singleSwapLimitDenominator.toString());

          setOneTimeSwapLimit(oneTimeSwapLimit.dividedBy(10 ** 18).toString());
        }
      )
      .catch((e) => {
        console.log("Swap one time limit error", e);
      });
  }, [stableSwapService]);

  const swapFee = useMemo(() => {
    if (inputValue) {
      /**
       * xUSDT to FXD
       */
      if (inputCurrency === options[0]) {
        return BigNumber(inputValue)
          .multipliedBy(feeIn)
          .dividedBy(10 ** 18)
          .toNumber();
      } else {
        return BigNumber(inputValue)
          .multipliedBy(feeOut)
          .dividedBy(10 ** 18)
          .toNumber();
      }
    } else {
      return 0;
    }
  }, [options, inputCurrency, inputValue, feeIn, feeOut]);

  const handleSwap = useCallback(async () => {
    setSwapPending(true);
    try {
      const tokenName = options[0];
      let blockNumber;
      /**
       * xUSDT -> FXD swap
       */
      if (inputCurrency === tokenName) {
        blockNumber = await stableSwapService.swapTokenToStableCoin(
          account,
          inputValue,
          inputDecimals,
          tokenName
        );
      } else {
        const fee = BigNumber(1).plus(BigNumber(feeOut).dividedBy(10 ** 18));
        const outputValueWithFee = BigNumber(outputValue)
          .multipliedBy(fee)
          .toString();

        blockNumber = await stableSwapService.swapStableCoinToToken(
          account,
          outputValueWithFee,
          tokenName
        );
      }

      setInputValue("");
      setOutputValue("");

      setLastTransactionBlock(blockNumber as number);
      handleCurrencyChange(inputCurrency, outputCurrency);
    } finally {
      setSwapPending(false);
      updateDailySwapLimit();
      updateOneTimeSwapLimit();
    }
  }, [
    feeOut,
    options,
    inputCurrency,
    outputCurrency,
    inputDecimals,
    outputDecimals,
    inputValue,
    outputValue,
    account,
    stableSwapService,
    handleCurrencyChange,
    setLastTransactionBlock,
    setSwapPending,
    updateDailySwapLimit,
    updateOneTimeSwapLimit,
  ]);

  const approveInput = useCallback(async () => {
    setApprovalPending("input");
    try {
      inputCurrency === options[0]
        ? await stableSwapService.approveUsdt(account)
        : await stableSwapService.approveStableCoin(account);
      setApproveInputBtn(false);
    } catch (e) {
      setApproveInputBtn(true);
    }
    setApprovalPending(null);
  }, [
    account,
    options,
    inputCurrency,
    stableSwapService,
    setApprovalPending,
    setApproveInputBtn,
  ]);

  const approveOutput = useCallback(async () => {
    setApprovalPending("output");
    try {
      outputCurrency === options[0]
        ? await stableSwapService.approveUsdt(account)
        : await stableSwapService.approveStableCoin(account);

      setApproveOutputBtn(false);
    } catch (e) {
      setApproveOutputBtn(true);
    }

    setApprovalPending(null);
  }, [
    account,
    options,
    outputCurrency,
    stableSwapService,
    setApprovalPending,
    setApproveOutputBtn,
  ]);

  const handleInputValueTextFieldChange = useCallback(
    (e: any) => {
      const { value } = e.target;
      setInputValue(value);
      if (value) {
        approvalStatus(value, inputCurrency, "input");
      }
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
      setOppositeCurrency(inputValue, currency, "input");
    },
    [inputValue, setInputCurrency, setOppositeCurrency]
  );

  const setOutputCurrencyHandler = useCallback(
    (currency: string) => {
      setOutputCurrency(currency);
      setOppositeCurrency(outputValue, currency, "output");
    },
    [outputValue, setOutputCurrency, setOppositeCurrency]
  );

  const setMax = useCallback(() => {
    /**
     * FXD to xUSDT
     */
    let formattedBalance;
    if (inputCurrency === options[1]) {
      formattedBalance = BigNumber(inputBalance).dividedBy(
        BigNumber(10).exponentiatedBy(inputDecimals)
      );

      formattedBalance = formattedBalance.isGreaterThan(usStableAvailable)
        ? usStableAvailable.toString()
        : formattedBalance.decimalPlaces(18).toString();
    } else {
      /**
       * xUSDT to FXD
       */
      formattedBalance = BigNumber(inputBalance).dividedBy(
        BigNumber(10).exponentiatedBy(inputDecimals)
      );
      formattedBalance = formattedBalance.isGreaterThan(fxdAvailable)
        ? fxdAvailable.toString()
        : formattedBalance.decimalPlaces(18).toString();
    }

    if (
      BigNumber(displayDailyLimit).isGreaterThan(0) &&
      BigNumber(formattedBalance).isGreaterThan(displayDailyLimit)
    ) {
      formattedBalance = displayDailyLimit;
    }

    if (
      BigNumber(oneTimeSwapLimit).isGreaterThan(0) &&
      BigNumber(formattedBalance).isGreaterThan(oneTimeSwapLimit)
    ) {
      formattedBalance = oneTimeSwapLimit;
    }

    if (BigNumber(formattedBalance).isLessThan(0.001)) {
      formattedBalance = "0";
    }

    setInputValue(formattedBalance);
    setOppositeCurrency(formattedBalance, inputCurrency, "input");
    if (BigNumber(formattedBalance).isGreaterThan(0)) {
      approvalStatus(formattedBalance, inputCurrency, "input");
    }
  }, [
    fxdAvailable,
    usStableAvailable,
    displayDailyLimit,
    oneTimeSwapLimit,
    options,
    inputBalance,
    inputCurrency,
    feeOut,
    setOppositeCurrency,
    inputDecimals,
    setInputValue,
    approvalStatus,
  ]);

  return {
    depositTracker,
    totalLocked,
    dailyLimit: displayDailyLimit,
    oneTimeSwapLimit,
    isDecentralizedState,
    isUserWhiteListed,
    inputDecimals,
    outputDecimals,
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
    fxdAvailable,
    usStableAvailable,
    navigate,
  };
};

export default useStableSwap;
