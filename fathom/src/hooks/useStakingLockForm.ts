import { useForm } from "react-hook-form";
import useMetaMask from "hooks/metamask";
import { useStores } from "stores";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { StakingLockFormPropsType } from "components/Staking/StakingLockForm";
import { Web3Utils } from "../helpers/Web3Utils";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "../apollo/queries";
import ICollateralPool from "../stores/interfaces/ICollateralPool";

const useStakingLockForm = (
  fetchOverallValues: StakingLockFormPropsType["fetchOverallValues"]
) => {
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [fthmBalance, setFthmBalance] = useState(0);
  const [fthmTokenAddress, setFthmTokenAddress] = useState<string>();

  const { poolStore } = useStores();

  const { data } = useQuery(FXD_POOLS, {
    fetchPolicy: 'cache-first',
    variables: {
      page: 10,
    }
  })

  const { handleSubmit, watch, control, reset, getValues, setValue } = useForm({
    defaultValues: {
      lockDays: 30,
      stakePosition: "",
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const { account, chainId } = useMetaMask()!;
  const { stakingStore, positionStore } = useStores();

  const lockDays = watch("lockDays");
  const stakePosition = watch("stakePosition");

  const [approvedBtn, setApprovedBtn] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);

  const [xdcBalance, setXdcBalance] = useState<number>(0);

  const getFTHMTokenBalance = useCallback(async () => {
    if (data?.pools) {
      const pool = data?.pools.find((pool: ICollateralPool) => pool.poolName.toLowerCase() === 'fthm');

      const fthmTokenAddress = await poolStore.getCollateralTokenAddress(
        pool.tokenAdapterAddress
      );

      const balance = await poolStore.getUserTokenBalance(
        account,
        fthmTokenAddress!
      );

      setFthmBalance(balance / (10 ** 18));
      setFthmTokenAddress(fthmTokenAddress);
    }
  }, [poolStore, data, setFthmBalance]);

  const approvalStatus = useCallback(
    debounce(
      async (account: string, chainId: number, stakePosition: number) => {
        const approved = await stakingStore.approvalStatusStakingFTHM(
          account,
          stakePosition,
          fthmTokenAddress!
        );

        console.log("Approve", approved);
        approved ? setApprovedBtn(false) : setApprovedBtn(true);
      },
      1000
    ),
    [stakingStore, setApprovedBtn, fthmTokenAddress]
  );

  useEffect(() => {
    getFTHMTokenBalance();
  }, [getFTHMTokenBalance])

  useEffect(() => {
    if (chainId && stakePosition) {
      approvalStatus(account, chainId, Number(stakePosition)!);
    }
  }, [account, chainId, approvalStatus, stakePosition]);

  useEffect(() => {
    const getBalance = async () => {
      const instance = Web3Utils.getWeb3Instance(chainId)
      const [xdcBalance] = await Promise.all([
        instance.eth.getBalance(account),
        positionStore.balanceStableCoin(account),
      ]);

      setXdcBalance(xdcBalance / (10 ** 18))
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
      await stakingStore.approveFTHM(account, fthmTokenAddress!);
      setApprovedBtn(false);
    } catch (e) {
      setApprovedBtn(true);
    }

    setApprovalPending(false);
  }, [account, stakingStore, fthmTokenAddress, setApprovalPending, setApprovedBtn]);

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
