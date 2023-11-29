import useConnector from "context/connector";
import { useServices } from "context/services";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IVault } from "fathom-sdk";
import { useForm } from "react-hook-form";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import useSyncContext from "context/sync";

export const defaultValues = {
  deposit: "",
  sharedToken: "",
};

const useOpenVaultDeposit = (vault: IVault, onClose: () => void) => {
  const { account, library } = useConnector();
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

  const { sharesSupply, shareToken, token, depositLimit } = vault;
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [openDepositLoading, setOpenDepositLoading] = useState<boolean>(false);

  const [approveBtn, setApproveBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  console.log(
    BigNumber(depositLimit)
      .dividedBy(10 ** vault.shareToken.decimals)
      .toNumber()
  );

  const deposit = watch("deposit");
  const sharedToken = watch("sharedToken");

  const approvalStatus = useMemo(
    () =>
      debounce(async (deposit: string) => {
        const approved = await vaultService.approvalStatus(
          account,
          vault.token.id,
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
      await vaultService.approve(account, vault.token.id, vault.id);
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
    const balance = await poolService.getUserTokenBalance(account, token.id);
    setWalletBalance(balance.toString());
  }, [account, library]);

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
        vault.id
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
