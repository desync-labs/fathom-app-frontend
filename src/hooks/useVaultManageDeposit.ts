import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import useConnector from "context/connector";
import { useServices } from "context/services";
import useSyncContext from "context/sync";
import { IVault } from "hooks/useVaultList";

export const defaultValues = {
  formToken: "",
  formSharedToken: "",
};

export enum FormType {
  DEPOSIT,
  WITHDRAW,
}
const useVaultManageDeposit = (vault: IVault, onClose: () => void) => {
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

  const { token } = vault;
  const [formType, setFormType] = useState<FormType>(FormType.DEPOSIT);
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [isWalletFetching, setIsWalletFetching] = useState<boolean>(false);
  const [openDepositLoading, setOpenDepositLoading] = useState<boolean>(false);

  const [approveBtn, setApproveBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const formToken = watch("formToken");
  const formSharedToken = watch("formSharedToken");

  const approvalStatus = useMemo(
    () =>
      debounce(async (formToken: string) => {
        const approved = await vaultService.approvalStatus(
          account,
          vault.token.id,
          vault.shareToken.id,
          formToken
        );
        approved ? setApproveBtn(false) : setApproveBtn(true);
      }, 1000),
    [vaultService, vault, account, formToken]
  );

  const updateSharedAmount = useMemo(
    () =>
      debounce(async (deposit: string) => {
        let sharedAmount = "0";
        if (formType === FormType.DEPOSIT) {
          sharedAmount = await vaultService.previewDeposit(deposit, vault.id);
        } else {
          sharedAmount = await vaultService.previewWithdraw(deposit, vault.id);
        }

        const sharedConverted = BigNumber(sharedAmount)
          .dividedBy(10 ** 18)
          .toFixed();

        setValue("formSharedToken", sharedConverted);
      }, 500),
    [vaultService, vault, formToken, formType]
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
    setValue("formToken", "0");
    setValue("formSharedToken", "0");
  }, [formType]);

  useEffect(() => {
    approvalStatus(formToken);
  }, [vault, formToken]);

  useEffect(() => {
    getVaultTokenBalance();
  }, [account, token]);

  useEffect(() => {
    if (formToken && Number(formToken) > 0) {
      updateSharedAmount(formToken);
    } else {
      setTimeout(() => {
        setValue("formSharedToken", "0");
      }, 600);
    }
  }, [formToken]);

  const getVaultTokenBalance = useCallback(async () => {
    const balance = await poolService.getUserTokenBalance(account, token.id);
    setWalletBalance(balance.toString());
    setIsWalletFetching(true);
  }, [account, library]);

  const setMax = useCallback(
    (walletBalance: string, balancePosition: string) => {
      if (formType === FormType.DEPOSIT) {
        const max = BigNumber(walletBalance)
          .dividedBy(10 ** 18)
          .toFixed();
        setValue("formToken", max, { shouldValidate: true });
      } else {
        const max = BigNumber(balancePosition)
          .dividedBy(10 ** 18)
          .toFixed();
        setValue("formToken", max, { shouldValidate: true });
      }
    },
    [setValue, walletBalance, formType]
  );

  const onSubmit = useCallback(async () => {
    setOpenDepositLoading(true);

    if (formType === FormType.DEPOSIT) {
      try {
        const blockNumber = await vaultService.deposit(
          formToken,
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
    } else {
      try {
        const blockNumber = await vaultService.withdraw(
          formToken,
          account,
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
    }
  }, [account, formToken, formType, vault]);

  return {
    walletBalance,
    isWalletFetching,
    token,
    control,
    formToken,
    formSharedToken,
    approveBtn,
    approvalPending,
    formType,
    openDepositLoading,
    errors,
    setFormType,
    approve,
    setMax,
    handleSubmit,
    onSubmit,
  };
};

export default useVaultManageDeposit;
