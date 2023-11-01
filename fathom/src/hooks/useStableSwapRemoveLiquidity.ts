import {
  useMediaQuery,
  useTheme
} from "@mui/material";
import useConnector from "context/connector";
import { useStores } from "context/services";
import useSyncContext from "context/sync";
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { SmartContractFactory } from "config/SmartContractFactory";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";


const useStableSwapRemoveLiquidity = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { account, chainId, library } = useConnector()!;

  const { stableSwapService, poolService } = useStores();
  const { setLastTransactionBlock } = useSyncContext();

  const [fxdBalance, setFxdBalance] = useState<number>(0);
  const [stableBalance, setStableBalance] = useState<number>(0);

  const [totalLiquidity, setTotalLiquidity] = useState<number>(0);

  const [removeAmountFxd, setRemoveAmountFxd] = useState<number>(0);
  const [removeAmountStable, setRemoveAmountStable] = useState<number>(0);

  const [depositTracker, setDepositTracker] = useState<number>(0);

  const [fxdDecimals, setFxdDecimals] = useState<number>(0);
  const [stableDecimals, setStableDecimals] = useState<number>(0);

  const [inputValue, setInputValue] = useState<string>("");

  const [liquidityPerUserFxd, setLiquidityPerUserFxd] = useState<number>(0);
  const [liquidityPerUserStable, setLiquidityPerUserStable] = useState<number>(0);

  const [removeLiquidityPending, setRemoveLiquidityPending] = useState<boolean>(false);

  const getBalances = useCallback(async () => {
    const FXDContractAddress =
      SmartContractFactory.getAddressByContractName(chainId, "FXD");

    const UsStableContractAddress =
      SmartContractFactory.getAddressByContractName(chainId, "xUSDT");

    try {
      const promises = [];
      promises.push(
        poolService.getTokenDecimals(
          FXDContractAddress,
          library
        )
      );
      promises.push(
        poolService.getTokenDecimals(
          UsStableContractAddress,
          library
        )
      );
      promises.push(
        poolService.getUserTokenBalance(
          account,
          FXDContractAddress,
          library
        )
      );
      promises.push(
        poolService.getUserTokenBalance(
          account,
          UsStableContractAddress,
          library
        )
      );

      promises.push(
        stableSwapService.getTotalValueLocked(library)
      );

      promises.push(
        stableSwapService.getActualLiquidityAvailablePerUser(account, library)
      );

      promises.push(
        stableSwapService.getDepositTracker(account, library)
      );

      const [
        fxdDecimals,
        stableDecimals,
        fxdBalance,
        usStableBalance,
        totalValueLocked,
        liquidityPerUser,
        depositTracker
      ] = await Promise.all(promises);

      // @ts-ignore
      const { "0": fxdLiquidity, "1": stableLiquidity } = liquidityPerUser;

      setFxdDecimals(fxdDecimals);
      setStableDecimals(stableDecimals);
      setFxdBalance(fxdBalance);
      setStableBalance(usStableBalance);
      setTotalLiquidity(totalValueLocked);
      setLiquidityPerUserFxd(fxdLiquidity);
      setLiquidityPerUserStable(stableLiquidity);
      setDepositTracker(depositTracker);
    } catch (e: any) {

    }
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
    setDepositTracker
  ]);

  const getRemoveAmounts = useMemo(
    () =>
      debounce(async (amount: string) => {
        stableSwapService.getAmounts(amount, account, library).then((response) => {
          const fxdAmount = response[0];
          const stableAmount = response[1];

          setRemoveAmountFxd(fxdAmount);
          setRemoveAmountStable(stableAmount);
        });
      }, 1000),
    [stableSwapService, account, library, setRemoveAmountFxd, setRemoveAmountStable]
  );

  const handleInputValueTextFieldChange = useCallback((e: any) => {
    const { value } = e.target;
    setInputValue(value);
    getRemoveAmounts(value);
  }, [setInputValue, getRemoveAmounts]);

  const setMax = useCallback(() => {
    const amount = BigNumber(depositTracker).dividedBy(10 ** 18).toString();
    setInputValue(amount);
    getRemoveAmounts(amount);
  }, [depositTracker, setInputValue, getRemoveAmounts]);

  const handleRemoveLiquidity = useCallback(async () => {
    try {
      setRemoveLiquidityPending(true);
      const blockNumber = await stableSwapService.removeLiquidity(Number(inputValue), account, library);
      setLastTransactionBlock(blockNumber);
      getBalances();
      setRemoveAmountStable(0);
      setRemoveAmountFxd(0);
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
    getBalances
  ]);

  const inputError = useMemo(() => {
    const maxForWithdraw = BigNumber(depositTracker).dividedBy(10 ** 18);

    if (BigNumber(inputValue).isGreaterThan(maxForWithdraw)) {
      return `You can't withdraw more then provided. Your provided amount is ${maxForWithdraw}.`;
    }
    return false;
  }, [
    depositTracker,
    inputValue
  ]);

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
    isMobile,
    inputValue,
    inputError,
    handleInputValueTextFieldChange,
    handleRemoveLiquidity,
    liquidityPerUserFxd,
    liquidityPerUserStable,
    totalLiquidity,
    removeAmountFxd,
    removeAmountStable,
    depositTracker
  };
};

export default useStableSwapRemoveLiquidity;