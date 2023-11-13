import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useServices } from "context/services";
import debounce from "lodash.debounce";
import { SmartContractFactory } from "fathom-sdk";
import useSyncContext from "context/sync";
import BigNumber from "bignumber.js";
import Xdc3 from "xdc3";
import { useMediaQuery, useTheme } from "@mui/material";
import useConnector from "context/connector";
import { useQuery } from "@apollo/client";
import { STABLE_SWAP_STATS } from "apollo/queries";
import { DAY_IN_SECONDS } from "helpers/Constants";
import { formatNumber } from "utils/format";
import { PricesContext } from "context/prices";
import { useNavigate } from "react-router-dom";

const useStableSwap = (options: string[]) => {
  const [inputBalance, setInputBalance] = useState<number>(0);
  const [outputBalance, setOutputBalance] = useState<number>(0);

  const [fxdAvailable, setFxdAvailable] = useState<number>(0);
  const [usStableAvailable, setUsStableAvailable] = useState<number>(0);

  const [inputCurrency, setInputCurrency] = useState<string>(options[0]);
  const [outputCurrency, setOutputCurrency] = useState<string>(options[1]);

  const [inputDecimals, setInputDecimals] = useState<number>(18);
  const [outputDecimals, setOutputDecimals] = useState<number>(18);

  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");

  const [approveInputBtn, setApproveInputBtn] = useState<boolean>(false);
  const [approveOutputBtn, setApproveOutputBtn] = useState<boolean>(false);

  const [approvalPending, setApprovalPending] = useState<string | null>(null);
  const [swapPending, setSwapPending] = useState<boolean>(false);

  const [lastUpdate, setLastUpdate] = useState<string>();
  const [dailyLimit, setDailyLimit] = useState<number>(0);
  const [displayDailyLimit, setDisplayDailyLimit] = useState<number>(0);

  const [feeIn, setFeeIn] = useState<string>("0");
  const [feeOut, setFeeOut] = useState<string>("0");

  const [depositTracker, setDepositTracker] = useState<number>(0);
  const [totalLocked, setTotalLocked] = useState<number>(0);

  const { fxdPrice: fxdPriceInWei } = useContext(PricesContext);

  const { stableSwapService, poolService } = useServices();

  const { account, chainId, library, isDecentralizedState, isUserWhiteListed } =
    useConnector();
  const { setLastTransactionBlock } = useSyncContext();

  const { data, loading, refetch } = useQuery(STABLE_SWAP_STATS, {
    context: { clientName: "stable", chainId },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
        ? oppositeValue.decimalPlaces(18).toString()
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
      library,
      options,
      inputDecimals,
      setApproveInputBtn,
      setApproveOutputBtn,
    ]
  );

  const inputError = useMemo(() => {
    const formattedBalance = BigNumber(inputBalance).dividedBy(
      10 ** inputDecimals
    );

    if (BigNumber(inputValue).isGreaterThan(formattedBalance)) {
      return `You do not have enough ${inputCurrency}`;
    }

    if (
      isDecentralizedState &&
      BigNumber(inputValue).isGreaterThan(displayDailyLimit)
    ) {
      return `You can't swap more then remaining daily limit ${formatNumber(
        displayDailyLimit
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

          const promises = [];
          promises.push(
            poolService.getUserTokenBalance(account, inputContractAddress)
          );
          promises.push(
            poolService.getUserTokenBalance(account, outputCurrencyAddress)
          );
          promises.push(poolService.getTokenDecimals(inputContractAddress));
          promises.push(poolService.getTokenDecimals(outputCurrencyAddress));
          promises.push(stableSwapService.getPoolBalance(FXDContractAddress));
          promises.push(
            stableSwapService.getPoolBalance(UsStableContractAddress)
          );

          promises.push(stableSwapService.getTotalValueLocked());

          promises.push(stableSwapService.getDepositTracker(account));

          const [
            inputBalance,
            outputBalance,
            inputDecimals,
            outputDecimals,
            fxdAvailable,
            usStableAvailable,
            totalLocked,
            depositTracker,
          ] = await Promise.all(promises);

          setTotalLocked(totalLocked);
          setDepositTracker(depositTracker);
          setFxdAvailable(
            fxdAvailable /
              10 **
                (inputCurrency === options[1] ? inputDecimals : outputDecimals)
          );
          setUsStableAvailable(
            usStableAvailable /
              10 **
                (inputCurrency === options[0] ? inputDecimals : outputDecimals)
          );

          setInputDecimals(inputDecimals);
          setOutputDecimals(outputDecimals);

          setInputBalance(inputBalance);
          setOutputBalance(outputBalance);
        }
      }, 100),
    [
      account,
      chainId,
      poolService,
      library,
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
    (inputValue: string, outputValue: string) => {
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
    if (chainId) {
      stableSwapService.getLastUpdate().then((lastUpdate: string) => {
        setLastUpdate(lastUpdate);
      });
    }
  }, [chainId, stableSwapService, library, setLastUpdate]);

  useEffect(() => {
    if (isDecentralizedState) {
      stableSwapService.getDailySwapLimit().then((dailyLimit: number) => {
        setDailyLimit(dailyLimit);
      });
    }
  }, [stableSwapService, isDecentralizedState]);

  useEffect(() => {
    if (chainId) {
      Promise.all([
        stableSwapService.getFeeIn(),
        stableSwapService.getFeeOut(),
      ]).then(([feeIn, feeOut]) => {
        setFeeIn(feeIn);
        setFeeOut(feeOut);
      });
    }
  }, [stableSwapService, chainId, setFeeIn, setFeeOut]);

  useEffect(() => {
    if (data?.stableSwapStats.length && lastUpdate && dailyLimit && !loading) {
      if (
        BigNumber(lastUpdate)
          .plus(DAY_IN_SECONDS)
          .isGreaterThan(BigNumber(Date.now()).dividedBy(1000))
      ) {
        return setDisplayDailyLimit(
          Number(data.stableSwapStats[0].remainingDailySwapAmount) / 10 ** 18
        );
      }
    }

    setDisplayDailyLimit(dailyLimit);
  }, [data, loading, lastUpdate, dailyLimit, setDisplayDailyLimit]);

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
      if (inputCurrency === tokenName) {
        blockNumber = await stableSwapService.swapTokenToStableCoin(
          account,
          inputValue,
          inputDecimals,
          tokenName
        );
      } else {
        blockNumber = await stableSwapService.swapStableCoinToToken(
          account,
          outputValue,
          tokenName
        );
      }

      setInputValue("");
      setOutputValue("");

      /**
       * Refetch data from Graph.
       */
      refetch();

      setLastUpdate((Date.now() / 1000).toString());

      setLastTransactionBlock(blockNumber as number);
      handleCurrencyChange(inputCurrency, outputCurrency);
    } finally {
      setSwapPending(false);
    }
  }, [
    options,
    inputCurrency,
    outputCurrency,
    inputDecimals,
    outputDecimals,
    inputValue,
    outputValue,
    account,
    library,
    stableSwapService,
    handleCurrencyChange,
    setLastTransactionBlock,
    setSwapPending,
    refetch,
    setLastUpdate,
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
    library,
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
    library,
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
    let formattedBalanceWithFee;
    if (inputCurrency === options[1]) {
      formattedBalance = BigNumber(inputBalance).dividedBy(10 ** inputDecimals);

      formattedBalance = formattedBalance.isGreaterThan(usStableAvailable)
        ? usStableAvailable.toString()
        : formattedBalance.decimalPlaces(18).toString();
      formattedBalanceWithFee = BigNumber(formattedBalance)
        .multipliedBy(BigNumber(1).plus(Xdc3.utils.fromWei(feeOut)))
        .toString();
    } else {
      /**
       * xUSDT to FXD
       */
      formattedBalance = BigNumber(inputBalance).dividedBy(10 ** inputDecimals);
      formattedBalance = formattedBalance.isGreaterThan(fxdAvailable)
        ? fxdAvailable.toString()
        : formattedBalance.decimalPlaces(18).toString();
      formattedBalanceWithFee = formattedBalance;
    }

    if (BigNumber(formattedBalance).isLessThan(0.001)) {
      formattedBalance = "0";
      formattedBalanceWithFee = "0";
    }

    setInputValue(formattedBalance);
    setOppositeCurrency(formattedBalanceWithFee, inputCurrency, "input");
    if (formattedBalance) {
      approvalStatus(formattedBalance, inputCurrency, "input");
    }
  }, [
    fxdAvailable,
    usStableAvailable,
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

    isMobile,
    fxdAvailable,
    usStableAvailable,
    navigate,
  };
};

export default useStableSwap;
