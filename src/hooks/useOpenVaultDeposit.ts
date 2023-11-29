import useConnector from "context/connector";
import { useServices } from "context/services";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IVault } from "fathom-sdk";
import { useForm } from "react-hook-form";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import useSyncContext from "context/sync";

export const defaultValues = {
  deposit: "0",
  sharedToken: "0",
  safeMax: "0",
  dangerSafeMax: "0",
};

const useOpenVaultDeposit = (vault: IVault, onClose: () => void) => {
  const { account, chainId, library } = useConnector()!;
  const { poolService, positionService, vaultService } = useServices();
  const { setLastTransactionBlock } = useSyncContext();

  const {
    handleSubmit,
    watch,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const { sharesSupply, shareToken, token } = vault;
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [openDepositLoading, setOpenDepositLoading] = useState<boolean>(false);

  const [approveBtn, setApproveBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const deposit = watch("deposit");
  const sharedToken = watch("sharedToken");
  const dangerSafeMax = watch("dangerSafeMax");

  const approvalStatus = useMemo(
    () =>
      debounce(async (deposit: string) => {
        const approved = await vaultService.approvalStatus(
          account,
          vault.id,
          deposit
        );
        approved ? setApproveBtn(false) : setApproveBtn(true);
      }, 1000),
    [vaultService, vault, account, deposit]
  );

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await vaultService.approve(account, vault.id);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [account, vault, vaultService, setApprovalPending, setApproveBtn]);

  useEffect(() => {
    approvalStatus(deposit);
    console.log("ApprovalStatusForToken: ", vault);
  }, [vault, deposit]);

  useEffect(() => {
    getVaultTokenBalance();
  }, [account, token]);

  useEffect(() => {
    setValue("sharedToken", deposit);
  }, [deposit]);

  const getVaultTokenBalance = useCallback(async () => {
    if (token.name.toUpperCase() === "XDC") {
      const balance = await library.getBalance(account);
      console.log("Balance XDC: ", balance);
    } else {
      const balance = await poolService.getUserTokenBalance(account, token.id);
      console.log(
        "Balance ",
        token.name,
        ": ",
        BigNumber(balance.toString())
          .dividedBy(10 ** 18)
          .toNumber()
      );

      setWalletBalance(balance.toString());
    }
  }, [account, library]);

  const setSafeMax = useCallback(() => {
    setValue("sharedToken", dangerSafeMax.toString(), { shouldValidate: true });
  }, [dangerSafeMax, setValue]);

  const setMax = useCallback(
    (walletBalance: string) => {
      const max = BigNumber(walletBalance).dividedBy(10 ** 18);
      setValue("deposit", max.toString(), { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = useCallback(async () => {
    setOpenDepositLoading(true);

    console.log("Submit: ", deposit, account);

    try {
      const blockNumber = await vaultService.deposit(deposit, account);

      setLastTransactionBlock(blockNumber as number);
      onClose();
    } catch (e) {
      console.log(e);
    }
    setOpenDepositLoading(false);
  }, [account, deposit]);

  return {
    walletBalance,
    token,
    control,
    deposit,
    sharedToken,
    approveBtn,
    approvalPending,
    approve,
    setMax,
    handleSubmit,
    onSubmit,
  };
};

export default useOpenVaultDeposit;
