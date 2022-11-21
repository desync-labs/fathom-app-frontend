import { useForm } from "react-hook-form";
import useMetaMask from "hooks/metamask";
import { useStores } from "stores";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { StakingLockFormPropsType } from "components/Staking/StakingLockForm";

const useStakingLockForm = (
  fetchOverallValues: StakingLockFormPropsType["fetchOverallValues"]
) => {
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { handleSubmit, watch, control, reset, getValues, setValue } = useForm({
    defaultValues: {
      lockDays: 30,
      stakePosition: "",
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  });
  const { account, chainId } = useMetaMask()!;
  const { stakingStore } = useStores();

  const lockDays = watch("lockDays");
  const stakePosition = watch("stakePosition");

  const [approvedBtn, setApprovedBtn] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);

  const approvalStatus = useCallback(
    debounce(
      async (account: string, chainId: number, stakePosition: number) => {
        const approved = await stakingStore.approvalStatusStakingFTHM(
          account,
          stakePosition
        );

        console.log("Approve", approved);
        approved ? setApprovedBtn(false) : setApprovedBtn(true);
      },
      1000
    ),
    [stakingStore, setApprovedBtn, getValues]
  );

  useEffect(() => {
    if (chainId && stakePosition) {
      approvalStatus(account, chainId, Number(stakePosition)!);
    }
  }, [account, chainId, approvalStatus, stakePosition]);

  useEffect(() => {
    const getBalance = async () => {
      stakingStore.fetchWalletBalance(account);
    };

    if (account) getBalance();
  }, [account, stakingStore]);

  useEffect(() => {
    if (Number(stakePosition) > stakingStore.walletBalance) {
      setBalanceError(true);
    } else {
      setBalanceError(false);
    }
  }, [stakePosition, stakingStore.walletBalance]);

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      const { stakePosition, lockDays } = values;
      setIsLoading(true);

      try {
        await stakingStore.createLock(account, stakePosition, lockDays);
        await stakingStore.fetchLatestLock(account);
        reset();
        fetchOverallValues(account);
      } catch (e) {}
      setIsLoading(false);
    },
    [stakingStore, account, fetchOverallValues, reset, setIsLoading]
  );

  const approveFTHM = useCallback(async () => {
    setApprovalPending(true);
    try {
      await stakingStore.approveFTHM(account);
      setApprovedBtn(false);
    } catch (e) {
      setApprovedBtn(true);
    }

    setApprovalPending(false);
  }, [setApprovalPending, setApprovedBtn, account, stakingStore]);

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
    walletBalance: stakingStore.walletBalance,
  };
};

export default useStakingLockForm;
