import { useCallback, useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import { SmartContractFactory } from "fathom-sdk";
import useConnector from "context/connector";
import useSyncContext from "context/sync";
import { useServices } from "context/services";

const useStableSwapAddLiquidity = () => {
  const { account, chainId } = useConnector();

  const { stableSwapService, poolService } = useServices();
  const { setLastTransactionBlock } = useSyncContext();

  const [fxdBalance, setFxdBalance] = useState<string>("0");
  const [stableBalance, setStableBalance] = useState<string>("0");

  const [fxdDecimals, setFxdDecimals] = useState<string>("0");
  const [stableDecimals, setStableDecimals] = useState<string>("0");

  const [inputValue, setInputValue] = useState<string>("");

  const [approveInputBtn, setApproveInputBtn] = useState<boolean>(false);

  const [approvedFxd, setApprovedFxd] = useState<boolean>(true);
  const [approvedStableCoin, setApprovedStableCoin] = useState<boolean>(true);

  const [approvalPending, setApprovalPending] = useState<boolean>(false);
  const [addLiquidityPending, setAddLiquidityPending] =
    useState<boolean>(false);
  const [totalLiquidity, setTotalLiquidity] = useState<string>("0");

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

    const [
      fxdDecimals,
      stableDecimals,
      fxdBalance,
      usStableBalance,
      totalLiquidity,
    ] = await Promise.all(promises);

    console.log({
      fxdBalance: fxdBalance.toString(),
      usStableBalance: usStableBalance.toString(),
    });

    setFxdDecimals(fxdDecimals.toString());
    setStableDecimals(stableDecimals.toString());
    setFxdBalance(fxdBalance.toString());
    setStableBalance(usStableBalance.toString());
    setTotalLiquidity(totalLiquidity.toString());
  }, [
    poolService,
    stableSwapService,
    account,
    chainId,
    setFxdDecimals,
    setStableDecimals,
    setFxdBalance,
    setStableBalance,
  ]);

  const approvalStatus = useMemo(
    () =>
      debounce(async (value: string) => {
        if (value.length === 0) {
          setApproveInputBtn(false);
          return;
        }

        const approvedUsdt = await stableSwapService.approvalStatusUsdt(
          account,
          value,
          stableDecimals,
          true
        );

        const approvedFxd = await stableSwapService.approvalStatusStableCoin(
          account,
          value,
          fxdDecimals,
          true
        );

        if (!approvedUsdt || !approvedFxd) {
          setApproveInputBtn(true);
        } else {
          setApproveInputBtn(false);
        }
        setApprovedFxd(approvedFxd);
        setApprovedStableCoin(approvedUsdt);
      }, 1000),
    [
      stableSwapService,
      account,
      fxdDecimals,
      stableDecimals,
      setApproveInputBtn,
      setApprovedFxd,
      setApprovedStableCoin,
    ]
  );

  const handleInputValueTextFieldChange = useCallback(
    (e: any) => {
      const { value } = e.target;
      setInputValue(value);
      approvalStatus(value);
    },
    [setInputValue, approvalStatus]
  );

  const approve = useCallback(() => {
    const promises = [];

    if (!approvedFxd) {
      promises.push(stableSwapService.approveStableCoin(account, true));
    }

    if (!approvedStableCoin) {
      promises.push(stableSwapService.approveUsdt(account, true));
    }

    setApprovalPending(true);

    Promise.all(promises)
      .then(() => {
        setApproveInputBtn(false);
      })
      .finally(() => {
        setApprovalPending(false);
      });
  }, [
    stableSwapService,
    approvedFxd,
    approvedStableCoin,
    account,
    setApproveInputBtn,
  ]);

  const setMax = useCallback(() => {
    const formattedFxdBalance = BigNumber(fxdBalance).dividedBy(
      BigNumber(10).exponentiatedBy(fxdDecimals)
    );
    const formattedUsStableBalance = BigNumber(stableBalance).dividedBy(
      BigNumber(10).exponentiatedBy(stableDecimals)
    );

    let maxBalance;

    if (formattedFxdBalance.isGreaterThan(formattedUsStableBalance)) {
      maxBalance = formattedUsStableBalance;
    } else {
      maxBalance = formattedFxdBalance;
    }

    setInputValue(maxBalance.toString());
    approvalStatus(maxBalance.toString());
  }, [
    stableBalance,
    stableDecimals,
    fxdBalance,
    fxdDecimals,
    setInputValue,
    approvalStatus,
  ]);

  const handleAddLiquidity = useCallback(async () => {
    try {
      setAddLiquidityPending(true);
      const blockNumber = await stableSwapService.addLiquidity(
        inputValue,
        account
      );
      setLastTransactionBlock(blockNumber as number);
      setInputValue("");
      getBalances();
    } finally {
      setAddLiquidityPending(false);
    }
  }, [
    stableSwapService,
    account,
    inputValue,
    setAddLiquidityPending,
    setInputValue,
    setLastTransactionBlock,
    getBalances,
  ]);

  const inputError = useMemo(() => {
    const formattedFxdBalance = BigNumber(fxdBalance).dividedBy(
      BigNumber(10).exponentiatedBy(fxdDecimals)
    );
    const formattedUsStableBalance = BigNumber(stableBalance).dividedBy(
      BigNumber(10).exponentiatedBy(stableDecimals)
    );

    if (BigNumber(inputValue).isGreaterThan(formattedFxdBalance)) {
      return "You do not have enough FXD for add liquidity";
    }

    if (BigNumber(inputValue).isGreaterThan(formattedUsStableBalance)) {
      return "You do not have enough xUSDT for add liquidity";
    }

    return false;
  }, [stableBalance, fxdBalance, fxdDecimals, stableDecimals, inputValue]);

  useEffect(() => {
    if (account) {
      getBalances();
    }
  }, [account, getBalances]);

  return {
    totalLiquidity,
    fxdDecimals,
    stableDecimals,
    fxdBalance,
    stableBalance,
    setMax,
    approve,
    approveInputBtn,
    approvalPending,
    addLiquidityPending,
    inputValue,
    inputError,
    handleInputValueTextFieldChange,
    handleAddLiquidity,
  };
};

export default useStableSwapAddLiquidity;
