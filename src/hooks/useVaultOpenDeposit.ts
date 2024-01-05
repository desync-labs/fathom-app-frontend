import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { useServices } from "context/services";
import { IVault } from "fathom-sdk";

export const defaultValues = {
  deposit: "",
  sharedToken: "",
};

const useVaultOpenDeposit = (vault: IVault, onClose: () => void) => {
  const { account } = useConnector();
  const { poolService, vaultService } = useServices();
  const { setLastTransactionBlock } = useSyncContext();

  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const { token } = vault;
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [isWalletFetching, setIsWalletFetching] = useState<boolean>(false);
  const [openDepositLoading, setOpenDepositLoading] = useState<boolean>(false);

  const [approveBtn, setApproveBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const deposit = watch("deposit");
  const sharedToken = watch("sharedToken");

  const approvalStatus = useMemo(
    () =>
      debounce(async (deposit: string) => {
        const approved = await vaultService.approvalStatus(
          account,
          vault.token.id,
          vault.shareToken.id,
          deposit
        );
        approved ? setApproveBtn(false) : setApproveBtn(true);
      }, 1000),
    [vaultService, vault, account, deposit]
  );

  const updateSharedAmount = useMemo(
    () =>
      debounce(async (deposit: string) => {
        const sharedAmount = await vaultService.previewDeposit(
          deposit,
          vault.id
        );

        const sharedConverted = BigNumber(sharedAmount)
          .dividedBy(10 ** 18)
          .toFixed();

        setValue("sharedToken", sharedConverted);
      }, 500),
    [vaultService, vault, deposit]
  );

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await vaultService.approve(account, vault.token.id, vault.shareToken.id);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [account, vault, vaultService, setApprovalPending, setApproveBtn]);

  useEffect(() => {
    deposit.trim() && approvalStatus(deposit);
  }, [vault, deposit]);

  useEffect(() => {
    getVaultTokenBalance();
  }, [account, token]);

  useEffect(() => {
    if (deposit && Number(deposit) > 0) {
      updateSharedAmount(deposit);
    } else {
      setTimeout(() => {
        setValue("sharedToken", "0");
      }, 600);
    }
  }, [deposit]);

  const getVaultTokenBalance = useCallback(async () => {
    const balance = await poolService.getUserTokenBalance(account, token.id);
    setWalletBalance(balance.toString());
    setIsWalletFetching(true);
  }, [account]);

  const setMax = useCallback(
    (walletBalance: string) => {
      const max = BigNumber(walletBalance).dividedBy(10 ** 18);
      setValue("deposit", max.toString(), { shouldValidate: true });
    },
    [setValue, walletBalance]
  );

  const onSubmit = useCallback(async () => {
    setOpenDepositLoading(true);

    try {
      const blockNumber = await vaultService.deposit(
        deposit,
        account,
        vault.shareToken.id
      );

      setLastTransactionBlock(blockNumber as number);
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setOpenDepositLoading(false);
    }
  }, [account, deposit, vault]);

  return {
    walletBalance,
    isWalletFetching,
    token,
    control,
    deposit,
    sharedToken,
    approveBtn,
    approvalPending,
    openDepositLoading,
    errors,
    approve,
    setMax,
    handleSubmit,
    onSubmit,
  };
};

export default useVaultOpenDeposit;
