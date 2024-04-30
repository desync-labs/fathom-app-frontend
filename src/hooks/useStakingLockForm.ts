import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import debounce from "lodash.debounce";
import BigNumber from "bignumber.js";

import { useServices } from "context/services";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { SmartContractFactory } from "fathom-sdk";
import { DAY_IN_SECONDS } from "utils/Constants";

const useStakingLockForm = () => {
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [lowInputAmountError, setLowInputAmountError] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [fthmBalance, setFthmBalance] = useState<string>("0");

  const { poolService } = useServices();

  const { handleSubmit, watch, control, reset, setValue } = useForm({
    defaultValues: {
      lockDays: 30,
      stakePosition: "",
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const { account, chainId, library } = useConnector();
  const { stakingService, positionService } = useServices();

  const { setLastTransactionBlock, syncDao, prevSyncDao } = useSyncContext();

  const lockDays = watch("lockDays");
  const stakePosition = watch("stakePosition");

  const [approvedBtn, setApprovedBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const [xdcBalance, setXdcBalance] = useState<string>("0");
  const [fxdBalance, setFxdBalance] = useState<string>("0");

  const [minLockPeriod, setMinLockPeriod] = useState<number>(1);

  const fthmTokenAddress = useMemo(() => {
    return SmartContractFactory.FthmToken(chainId).address;
  }, [chainId]);

  const getFTHMTokenBalance = useCallback(async () => {
    const balance = await poolService.getUserTokenBalance(
      account,
      fthmTokenAddress
    );

    setFthmBalance(
      BigNumber(balance.toString())
        .dividedBy(10 ** 18)
        .toString()
    );
  }, [account, poolService, fthmTokenAddress, setFthmBalance]);

  const getMinLockPeriod = useCallback(async () => {
    const lockPeriod = await stakingService.getMinLockPeriod();
    const minDays = BigNumber(lockPeriod.toString()).dividedBy(DAY_IN_SECONDS);
    setMinLockPeriod(minDays.isLessThan(1) ? 1 : minDays.toNumber());
  }, [stakingService, setMinLockPeriod]);

  const approvalStatus = useMemo(
    () =>
      debounce(async (account: string, stakePosition: string) => {
        const approved = await stakingService.approvalStatusStakingFTHM(
          account,
          stakePosition,
          fthmTokenAddress
        );

        console.log("Approve", approved);
        approved ? setApprovedBtn(false) : setApprovedBtn(true);
      }, 1000),
    [stakingService, setApprovedBtn, fthmTokenAddress]
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
      approvalStatus(account, stakePosition);
    }
  }, [account, chainId, fthmTokenAddress, approvalStatus, stakePosition]);

  useEffect(() => {
    const getBalance = async () => {
      const [xdcBalance, fxdBalance] = await Promise.all([
        library.getBalance(account),
        positionService.balanceStableCoin(account),
      ]);

      setXdcBalance(
        BigNumber(xdcBalance.toString())
          .dividedBy(10 ** 18)
          .toString()
      );
      setFxdBalance(
        BigNumber(fxdBalance.toString())
          .dividedBy(10 ** 18)
          .toString()
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
    if (BigNumber(stakePosition).isGreaterThan(fthmBalance)) {
      setBalanceError(true);
    } else {
      setBalanceError(false);
    }
  }, [stakePosition, fthmBalance]);

  useEffect(() => {
    if (BigNumber(stakePosition).isLessThan(1)) {
      setLowInputAmountError(true);
    } else {
      setLowInputAmountError(false);
    }
  }, [stakePosition, fthmBalance]);

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      const { stakePosition, lockDays } = values;
      try {
        setIsLoading(true);
        const blockNumber = await stakingService.createLock(
          account,
          stakePosition,
          lockDays
        );
        setLastTransactionBlock(blockNumber as number);
        reset();
      } finally {
        setIsLoading(false);
      }
    },
    [stakingService, account, reset, setIsLoading, setLastTransactionBlock]
  );

  const approveFTHM = useCallback(async () => {
    setApprovalPending(true);
    try {
      await stakingService.approveStakingFTHM(account, fthmTokenAddress);
      setApprovedBtn(false);
    } catch (e) {
      setApprovedBtn(true);
    }

    setApprovalPending(false);
  }, [
    account,
    stakingService,
    fthmTokenAddress,
    setApprovalPending,
    setApprovedBtn,
  ]);

  const setMax = useCallback(
    (balance: string) => {
      setValue("stakePosition", balance);
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
    now.setDate(now.getDate() + Number(lockDays));
    return now.toLocaleDateString();
  }, [lockDays]);

  return {
    account,
    balanceError,
    lowInputAmountError,
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
