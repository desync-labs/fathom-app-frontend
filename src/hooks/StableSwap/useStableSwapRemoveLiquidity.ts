import { useCallback, useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import useConnector from "context/connector";
import { useServices } from "context/services";
import useSyncContext from "context/sync";
import { SmartContractFactory } from "fathom-sdk";

const useStableSwapRemoveLiquidity = () => {
  const { account, chainId, library } = useConnector();

  const { stableSwapService, poolService } = useServices();
  const { setLastTransactionBlock } = useSyncContext();

  const [fxdBalance, setFxdBalance] = useState<string>("0");
  const [stableBalance, setStableBalance] = useState<string>("0");

  const [totalLiquidity, setTotalLiquidity] = useState<string>("0");

  const [removeAmountFxd, setRemoveAmountFxd] = useState<string>("0");
  const [removeAmountStable, setRemoveAmountStable] = useState<string>("0");

  const [depositTracker, setDepositTracker] = useState<string>("0");

  const [fxdDecimals, setFxdDecimals] = useState<string>("0");
  const [stableDecimals, setStableDecimals] = useState<string>("0");

  const [inputValue, setInputValue] = useState<string>("");

  const [liquidityPerUserFxd, setLiquidityPerUserFxd] = useState<number>(0);
  const [liquidityPerUserStable, setLiquidityPerUserStable] =
    useState<number>(0);

  const [removeLiquidityPending, setRemoveLiquidityPending] =
    useState<boolean>(false);

  const getBalances = useCallback(async () => {
    const FXDContractAddress = SmartContractFactory.getAddressByContractName(
      chainId,
      "FXD"
    );

    const UsStableContractAddress =
      SmartContractFactory.getAddressByContractName(chainId, "xUSDT");

    const promises = [];
    promises.push(poolService.getTokenDecimals(FXDContractAddress));
    promises.push(poolService.getTokenDecimals(UsStableContractAddress));
    promises.push(poolService.getUserTokenBalance(account, FXDContractAddress));
    promises.push(
      poolService.getUserTokenBalance(account, UsStableContractAddress)
    );

    promises.push(stableSwapService.getTotalValueLocked());

    promises.push(
      stableSwapService.getActualLiquidityAvailablePerUser(account)
    );

    promises.push(stableSwapService.getDepositTracker(account));

    const [
      fxdDecimals,
      stableDecimals,
      fxdBalance,
      usStableBalance,
      totalValueLocked,
      liquidityPerUser,
      depositTracker,
    ] = await Promise.all(promises);

    const { "0": fxdLiquidity, "1": stableLiquidity } = liquidityPerUser as any;

    console.log(depositTracker.toString());

    setFxdDecimals(fxdDecimals.toString());
    setStableDecimals(stableDecimals.toString());
    setFxdBalance(fxdBalance.toString());
    setStableBalance(usStableBalance.toString());
    setTotalLiquidity(totalValueLocked.toString());
    setLiquidityPerUserFxd(fxdLiquidity.toString());
    setLiquidityPerUserStable(stableLiquidity.toString());
    setDepositTracker(depositTracker.toString());
  }, [
    poolService,
    stableSwapService,
    account,
    chainId,
    library,
    setFxdDecimals,
    setStableDecimals,
    setFxdBalance,
    setStableBalance,
    setTotalLiquidity,
    setLiquidityPerUserFxd,
    setLiquidityPerUserStable,
    setDepositTracker,
  ]);

  const getRemoveAmounts = useMemo(
    () =>
      debounce(async (amount: string) => {
        stableSwapService.getAmounts(amount, account).then((response) => {
          const fxdAmount = response[0];
          const stableAmount = response[1];

          setRemoveAmountFxd(fxdAmount.toString());
          setRemoveAmountStable(stableAmount.toString());
        });
      }, 1000),
    [
      stableSwapService,
      account,
      library,
      setRemoveAmountFxd,
      setRemoveAmountStable,
    ]
  );

  const handleInputValueTextFieldChange = useCallback(
    (e: any) => {
      const { value } = e.target;
      setInputValue(value);
      getRemoveAmounts(value);
    },
    [setInputValue, getRemoveAmounts]
  );

  const setMax = useCallback(() => {
    const amount = BigNumber(depositTracker)
      .dividedBy(10 ** 18)
      .toString();
    setInputValue(amount);
    getRemoveAmounts(amount);
  }, [depositTracker, setInputValue, getRemoveAmounts]);

  const handleRemoveLiquidity = useCallback(async () => {
    try {
      setRemoveLiquidityPending(true);
      const blockNumber = await stableSwapService.removeLiquidity(
        inputValue,
        account
      );
      setLastTransactionBlock(blockNumber as number);
      getBalances();
      setRemoveAmountStable("0");
      setRemoveAmountFxd("0");
      setInputValue("");
    } finally {
      setRemoveLiquidityPending(false);
    }
  }, [
    stableSwapService,
    account,
    inputValue,
    library,
    setRemoveLiquidityPending,
    setInputValue,
    setLastTransactionBlock,
    getBalances,
  ]);

  const inputError = useMemo(() => {
    const maxForWithdraw = BigNumber(depositTracker).dividedBy(10 ** 18);

    if (BigNumber(inputValue).isGreaterThan(maxForWithdraw)) {
      return `You can't withdraw more then provided. Your provided amount is ${maxForWithdraw}.`;
    }
    return false;
  }, [depositTracker, inputValue]);

  useEffect(() => {
    if (account) {
      getBalances();
    }
  }, [account, getBalances]);

  return {
    fxdDecimals,
    stableDecimals,
    fxdBalance,
    stableBalance,
    setMax,
    removeLiquidityPending,
    inputValue,
    inputError,
    handleInputValueTextFieldChange,
    handleRemoveLiquidity,
    liquidityPerUserFxd,
    liquidityPerUserStable,
    totalLiquidity,
    removeAmountFxd,
    removeAmountStable,
    depositTracker,
  };
};

export default useStableSwapRemoveLiquidity;
