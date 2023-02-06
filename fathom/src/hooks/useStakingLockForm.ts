import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useStores } from "stores";

import debounce from "lodash.debounce";
import useSyncContext from "context/sync";
import { SmartContractFactory } from "config/SmartContractFactory";
import useConnector from "context/connector";
import BigNumber from "bignumber.js";

const useStakingLockForm = () => {
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [fthmBalance, setFthmBalance] = useState(0);

  const { poolService } = useStores();

  const { handleSubmit, watch, control, reset, setValue } = useForm({
    defaultValues: {
      lockDays: 30,
      stakePosition: "",
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const { account, chainId, library } = useConnector()!;
  const { stakingStore, positionService } = useStores();

  const { setLastTransactionBlock, syncDao, prevSyncDao } = useSyncContext();

  const lockDays = watch("lockDays");
  const stakePosition = watch("stakePosition");

  const [approvedBtn, setApprovedBtn] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);

  const [xdcBalance, setXdcBalance] = useState<number>(0);
  const [fxdBalance, setFxdBalance] = useState<number>(0);

  const fthmTokenAddress = useMemo(() => {
    return SmartContractFactory.FthmToken(chainId).address;
  }, [chainId]);

  const getFTHMTokenBalance = useCallback(async () => {
    if (account) {
      const balance = await poolService.getUserTokenBalance(
        account,
        fthmTokenAddress,
        library
      );

      setFthmBalance(balance / 10 ** 18);
    }
  }, [account, poolService, fthmTokenAddress, library, setFthmBalance]);

  const approvalStatus = useMemo(
    () =>
      debounce(
        async (account: string, chainId: number, stakePosition: number) => {
          const approved = await stakingStore.approvalStatusStakingFTHM(
            account,
            stakePosition,
            fthmTokenAddress,
            library
          );

          console.log("Approve", approved);
          approved ? setApprovedBtn(false) : setApprovedBtn(true);
        },
        1000
      ),
    [stakingStore, library, setApprovedBtn, fthmTokenAddress]
  );

  useEffect(() => {
    if (account) {
      getFTHMTokenBalance();
    }
  }, [account, getFTHMTokenBalance]);

  useEffect(() => {
    if (syncDao && !prevSyncDao) {
      getFTHMTokenBalance();
    }
  }, [syncDao, prevSyncDao, getFTHMTokenBalance]);

  useEffect(() => {
    if (chainId && stakePosition && fthmTokenAddress) {
      approvalStatus(account, chainId, Number(stakePosition)!);
    }
  }, [account, chainId, fthmTokenAddress, approvalStatus, stakePosition]);

  useEffect(() => {
    const getBalance = async () => {
      const [xdcBalance, fxdBalance] = await Promise.all([
        library.eth.getBalance(account),
        positionService.balanceStableCoin(account, library),
      ]);

      setXdcBalance(xdcBalance / 10 ** 18);
      setFxdBalance(BigNumber(fxdBalance).dividedBy( 10 ** 18).toNumber());
    };

    if (account && chainId) getBalance();
  }, [
    account,
    library,
    chainId,
    positionService,
    stakingStore,
    setXdcBalance,
    setFxdBalance,
  ]);

  useEffect(() => {
    if (Number(stakePosition) > fthmBalance) {
      setBalanceError(true);
    } else {
      setBalanceError(false);
    }
  }, [stakePosition, fthmBalance]);

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      const { stakePosition, lockDays } = values;
      setIsLoading(true);

      try {
        const receipt = await stakingStore.createLock(
          account,
          stakePosition,
          lockDays,
          library
        );
        setLastTransactionBlock(receipt.blockNumber);
        reset();
      } catch (e) {}
      setIsLoading(false);
    },
    [
      stakingStore,
      account,
      library,
      reset,
      setIsLoading,
      setLastTransactionBlock,
    ]
  );

  const approveFTHM = useCallback(async () => {
    setApprovalPending(true);
    try {
      await stakingStore.approveFTHM(account, fthmTokenAddress, library);
      setApprovedBtn(false);
    } catch (e) {
      setApprovedBtn(true);
    }

    setApprovalPending(false);
  }, [
    account,
    library,
    stakingStore,
    fthmTokenAddress,
    setApprovalPending,
    setApprovedBtn,
  ]);

  const setMax = useCallback(
    (balance: number) => {
      setValue("stakePosition", balance.toString());
    },
    [setValue]
  );

  const setPeriod = useCallback(
    (period: number) => {
      setValue("lockDays", period);
    },
    [setValue]
  );

  const unlockDate = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() + lockDays);
    return now.toLocaleDateString();
  }, [lockDays]);

  return {
    balanceError,
    unlockDate,
    lockDays,
    isLoading,
    approvedBtn,
    approvalPending,
    approveFTHM,
    control,
    handleSubmit,
    onSubmit,
    setMax,
    setPeriod,
    fthmBalance,
    fxdBalance,
    xdcBalance,
  };
};

export default useStakingLockForm;
