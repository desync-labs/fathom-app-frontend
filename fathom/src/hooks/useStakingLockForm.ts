import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useMetaMask from "context/metamask";
import { useStores } from "stores";

import debounce from "lodash.debounce";
import { Web3Utils } from "helpers/Web3Utils";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import useSyncContext from "context/sync";

const useStakingLockForm = () => {
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [fthmBalance, setFthmBalance] = useState(0);
  const [fthmTokenAddress, setFthmTokenAddress] = useState<string>();

  const { poolStore } = useStores();

  const { data } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
    fetchPolicy: "cache-first",
  });

  const { handleSubmit, watch, control, reset, setValue } = useForm({
    defaultValues: {
      lockDays: 30,
      stakePosition: "",
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const { account, chainId } = useMetaMask()!;
  const { stakingStore, positionStore } = useStores();

  const { setLastTransactionBlock } = useSyncContext();

  const lockDays = watch("lockDays");
  const stakePosition = watch("stakePosition");

  const [approvedBtn, setApprovedBtn] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);

  const [xdcBalance, setXdcBalance] = useState<number>(0);

  const getFTHMTokenBalance = useCallback(async () => {
    if (data?.pools) {
      const pool = data?.pools.find(
        (pool: ICollateralPool) => pool.poolName.toLowerCase() === "fthm"
      );

      const fthmTokenAddress = await poolStore.getCollateralTokenAddress(
        pool.tokenAdapterAddress
      );

      // @TODO: hardcoded FTHM address
      const balance = await poolStore.getUserTokenBalance(
        account,
        "0xCABd991B08ec1A844b29dDA1Aac697D6ab030e8d"
      );

      setFthmBalance(balance / 10 ** 18);
      setFthmTokenAddress(fthmTokenAddress);
    }
  }, [account, poolStore, data, setFthmBalance]);

  const approvalStatus = useMemo(
    () =>
      debounce(
        async (account: string, chainId: number, stakePosition: number) => {
          const approved = await stakingStore.approvalStatusStakingFTHM(
            account,
            stakePosition,
            // @TODO: hardcoded FTHM address
            "0xCABd991B08ec1A844b29dDA1Aac697D6ab030e8d"
          );

          console.log("Approve", approved);
          approved ? setApprovedBtn(false) : setApprovedBtn(true);
        },
        1000
      ),
    [stakingStore, setApprovedBtn, fthmTokenAddress]
  );

  useEffect(() => {
    if (account) {
      getFTHMTokenBalance();
    }
  }, [account, getFTHMTokenBalance]);

  useEffect(() => {
    if (chainId && stakePosition && fthmTokenAddress) {
      approvalStatus(account, chainId, Number(stakePosition)!);
    }
  }, [account, chainId, fthmTokenAddress, approvalStatus, stakePosition]);

  useEffect(() => {
    const getBalance = async () => {
      const instance = Web3Utils.getWeb3Instance(chainId);
      const [xdcBalance] = await Promise.all([
        instance.eth.getBalance(account),
        positionStore.balanceStableCoin(account),
      ]);

      setXdcBalance(xdcBalance / 10 ** 18);
    };

    if (account && chainId) getBalance();
  }, [account, chainId, positionStore, stakingStore, setXdcBalance]);

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
          lockDays
        );
        setLastTransactionBlock(receipt.blockNumber);
        reset();
      } catch (e) {}
      setIsLoading(false);
    },
    [stakingStore, account, reset, setIsLoading, setLastTransactionBlock]
  );

  const approveFTHM = useCallback(async () => {
    setApprovalPending(true);
    try {
      // @TODO: hardcoded FTHM address
      await stakingStore.approveFTHM(
        account,
        "0xCABd991B08ec1A844b29dDA1Aac697D6ab030e8d"
      );
      setApprovedBtn(false);
    } catch (e) {
      setApprovedBtn(true);
    }

    setApprovalPending(false);
  }, [
    account,
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
    fxdBalance: positionStore.stableCoinBalance,
    xdcBalance,
  };
};

export default useStakingLockForm;
