import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useStores } from "stores";
import debounce from "lodash.debounce";
import { SmartContractFactory } from "config/SmartContractFactory";
import useSyncContext from "context/sync";
import BigNumber from "bignumber.js";
import Xdc3 from "xdc3";
import {
  useMediaQuery,
  useTheme
} from "@mui/material";
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

  const [inputValue, setInputValue] = useState<number|string>("");
  const [outputValue, setOutputValue] = useState<number|string>("");

  const [approveInputBtn, setApproveInputBtn] = useState<boolean>(false);
  const [approveOutputBtn, setApproveOutputBtn] = useState<boolean>(false);

  const [approvalPending, setApprovalPending] = useState<string|null>(null);
  const [swapPending, setSwapPending] = useState<boolean>(false);

  const [lastUpdate, setLastUpdate] = useState<number>();
  const [dailyLimit, setDailyLimit] = useState<number>(0);
  const [displayDailyLimit, setDisplayDailyLimit] = useState<number>(0);

  const [feeIn, setFeeIn] = useState<number>(0);
  const [feeOut, setFeeOut] = useState<number>(0);

  const { fxdPrice: fxdPriceInWei } = useContext(PricesContext);

  const { stableSwapService, poolService } = useStores();

  const { account, chainId, library, isDecentralizedState, isUserWhiteListed } =
    useConnector()!;
  const { setLastTransactionBlock } = useSyncContext();

  const { data, loading, refetch } = useQuery(STABLE_SWAP_STATS, {
    context: { clientName: "stable", chainId }
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
    (amount: number, currency: string, type: string) => {
      let oppositeValue;
      if (currency === options[0]) {
        console.log("xUSDT -> FXD", 1 - feeIn / 10 ** 18);
        oppositeValue = BigNumber(amount).multipliedBy(
          BigNumber(1).minus(
            BigNumber(feeIn).dividedBy(10 ** 18)
          )
        ).toNumber();
      } else {
        console.log("FXD -> xUSDT", feeOut / 10 ** 18 + 1);
        oppositeValue = BigNumber(amount).dividedBy(
          BigNumber(feeOut).dividedBy(10 ** 18).plus(1)
        ).toNumber();
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
              ? await stableSwapService.approvalStatusUsdt(
                account,
                input,
                inputDecimals,
                library
              )
              : await stableSwapService.approvalStatusStableCoin(
                account,
                input,
                inputDecimals,
                library
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
      setApproveOutputBtn
    ]
  );

  const inputError = useMemo(() => {
    const formattedBalance = BigNumber(inputBalance).dividedBy(10 ** inputDecimals).toNumber();

    if ((inputValue as number) > formattedBalance) {
      return `You do not have enough ${inputCurrency}`;
    }

    if (isDecentralizedState && displayDailyLimit < inputValue) {
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
    isDecentralizedState
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

          const UsStableContractAddress =
            SmartContractFactory.getAddressByContractName(chainId, "xUSDT");

          try {
            const promises = [];
            promises.push(
              poolService.getUserTokenBalance(
                account,
                inputContractAddress,
                library
              )
            );
            promises.push(
              poolService.getUserTokenBalance(
                account,
                outputCurrencyAddress,
                library
              )
            );
            promises.push(
              poolService.getTokenDecimals(
                inputContractAddress,
                library
              )
            );
            promises.push(
              poolService.getTokenDecimals(
                outputCurrencyAddress,
                library
              )
            );
            promises.push(
              stableSwapService.getPoolBalance(FXDContractAddress, library)
            );
            promises.push(
              stableSwapService.getPoolBalance(UsStableContractAddress, library)
            );

            const [
              inputBalance,
              outputBalance,
              inputDecimals,
              outputDecimals,
              fxdAvailable,
              usStableAvailable
            ] = await Promise.all(promises);

            setFxdAvailable(fxdAvailable! / 10 ** (inputCurrency === options[1] ? inputDecimals : outputDecimals));
            setUsStableAvailable(usStableAvailable! / 10 ** (inputCurrency === options[0] ? inputDecimals : outputDecimals));

            setInputDecimals(inputDecimals);
            setOutputDecimals(outputDecimals);

            setInputBalance(inputBalance!);
            setOutputBalance(outputBalance!);
          } catch (e) {

          }
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
      setOutputBalance
    ]
  );

  const changeCurrenciesPosition = useCallback(
    (inputValue: number, outputValue: number) => {
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
      setOutputValue
    ]
  );

  useEffect(() => {
    chainId && handleCurrencyChange(inputCurrency, outputCurrency);
  }, [inputCurrency, outputCurrency, chainId, handleCurrencyChange]);

  useEffect(() => {
    if (chainId) {
      stableSwapService.getLastUpdate(library).then((lastUpdate) => {
        setLastUpdate(Number(lastUpdate));
      });
    }
  }, [chainId, stableSwapService, library, setLastUpdate]);

  useEffect(() => {
    if (isDecentralizedState) {
      stableSwapService.getDailySwapLimit(library).then((dailyLimit) => {
        setDailyLimit(dailyLimit!);
      });
    }
  }, [stableSwapService, isDecentralizedState, library]);

  useEffect(() => {
    if (chainId) {
      Promise.all([
        stableSwapService.getFeeIn(library),
        stableSwapService.getFeeOut(library)
      ]).then(([feeIn, feeOut]) => {
        setFeeIn(feeIn!);
        setFeeOut(feeOut!);
      });
    }
  }, [stableSwapService, chainId, library, setFeeIn, setFeeOut]);

  useEffect(() => {
    if (data?.stableSwapStats.length && lastUpdate && dailyLimit && !loading) {
      if (lastUpdate! + DAY_IN_SECONDS > Date.now() / 1000) {
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
        return BigNumber(inputValue).multipliedBy(feeIn).dividedBy(10 ** 18).toNumber();
      } else {
        return BigNumber(inputValue).multipliedBy(feeOut).dividedBy(10 ** 18).toNumber();
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
          inputValue as number,
          inputDecimals,
          tokenName,
          library
        );
      } else {
        blockNumber = await stableSwapService.swapStableCoinToToken(
          account,
          outputValue as number,
          outputDecimals,
          tokenName,
          library
        );
      }

      setInputValue("");
      setOutputValue("");

      /**
       * Refetch data from Graph.
       */
      refetch();

      setLastUpdate(Date.now() / 1000);

      setLastTransactionBlock(blockNumber);
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
    setLastUpdate
  ]);

  const approveInput = useCallback(async () => {
    setApprovalPending("input");
    try {
      inputCurrency === options[0]
        ? await stableSwapService.approveUsdt(account, options[0], library)
        : await stableSwapService.approveStableCoin(account, library);
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
    setApproveInputBtn
  ]);

  const approveOutput = useCallback(async () => {
    setApprovalPending("output");
    try {
      outputCurrency === options[0]
        ? await stableSwapService.approveUsdt(account, options[0], library)
        : await stableSwapService.approveStableCoin(account, library);

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
    setApproveOutputBtn
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
     * FXD to xUSDT
     */
    let formattedBalance;
    if (inputCurrency === options[1]) {
      formattedBalance =
        BigNumber(inputBalance)
          .dividedBy(10 ** inputDecimals)
          .multipliedBy(
            BigNumber(1).minus(Xdc3.utils.fromWei(feeOut.toString()))
          )
          .toNumber();
    } else {
      formattedBalance =
        BigNumber(inputBalance).dividedBy(10 ** inputDecimals).toFixed() ||
        0;
    }

    setInputValue(formattedBalance);
    setOppositeCurrency(formattedBalance as number, inputCurrency, "input");
    if (formattedBalance) {
      approvalStatus(formattedBalance as number, inputCurrency, "input");
    }
  }, [
    options,
    inputBalance,
    inputCurrency,
    feeOut,
    setOppositeCurrency,
    inputDecimals,
    setInputValue,
    approvalStatus
  ]);

  return {
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
