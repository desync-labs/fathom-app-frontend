import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import debounce from "lodash.debounce";
import BigNumber from "bignumber.js";

import { useStores } from "stores";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { SmartContractFactory } from "config/SmartContractFactory";
import { DAY_SECONDS } from "services/StakingService";

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
  const { stakingService, positionService } = useStores();

  const { setLastTransactionBlock, syncDao, prevSyncDao } = useSyncContext();

  const lockDays = watch("lockDays");
  const stakePosition = watch("stakePosition");

  const [approvedBtn, setApprovedBtn] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);

  const [xdcBalance, setXdcBalance] = useState<number>(0);
  const [fxdBalance, setFxdBalance] = useState<number>(0);

  const [minLockPeriod, setMinLockPeriod] = useState<number>(1);

  const fthmTokenAddress = useMemo(() => {
    return SmartContractFactory.FthmToken(chainId).address;
  }, [chainId]);

  const getFTHMTokenBalance = useCallback(async () => {
    const balance = await poolService.getUserTokenBalance(
      account,
      fthmTokenAddress,
      library
    );

    setFthmBalance(balance / 10 ** 18);
  }, [account, poolService, fthmTokenAddress, library, setFthmBalance]);

  const getMinLockPeriod = useCallback(async () => {
    const lockPeriod = await stakingService.getMinLockPeriod(library);
    const minDays = BigNumber(lockPeriod!).dividedBy(DAY_SECONDS);
    setMinLockPeriod(minDays.toNumber());
  }, [stakingService, library, setMinLockPeriod]);

  const approvalStatus = useMemo(
    () =>
      debounce(
        async (account: string, chainId: number, stakePosition: number) => {
          const approved = await stakingService.approvalStatusStakingFTHM(
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
    [stakingService, library, setApprovedBtn, fthmTokenAddress]
  );

  useEffect(() => {
    if (account) {
      getFTHMTokenBalance();
      getMinLockPeriod();
    }
  }, [account, getFTHMTokenBalance, getMinLockPeriod]);

  useEffect(() => {
    if (account && syncDao && !prevSyncDao) {
      getFTHMTokenBalance();
    }
  }, [account, syncDao, prevSyncDao, getFTHMTokenBalance]);

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
      setFxdBalance(
        BigNumber(fxdBalance)
          .dividedBy(10 ** 18)
          .toNumber()
      );
    };

    if (account && chainId) getBalance();
  }, [
    account,
    library,
    chainId,
    positionService,
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
        const blockNumber = await stakingService.createLock(
          account,
          stakePosition,
          lockDays,
          library
        );
        setLastTransactionBlock(blockNumber);
        reset();
      } catch (e) {}
      setIsLoading(false);
    },
    [
      stakingService,
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
      await stakingService.approveStakingFTHM(account, fthmTokenAddress, library);
      setApprovedBtn(false);
    } catch (e) {
      setApprovedBtn(true);
    }

    setApprovalPending(false);
  }, [
    account,
    library,
    stakingService,
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
    minLockPeriod,
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
