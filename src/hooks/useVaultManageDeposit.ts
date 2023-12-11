import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import useConnector from "context/connector";
import { useServices } from "context/services";
import useSyncContext from "context/sync";
import { IVault, IVaultPosition } from "fathom-sdk";

export const defaultValues = {
  formToken: "",
  formSharedToken: "",
};

export enum FormType {
  DEPOSIT,
  WITHDRAW,
}
const useVaultManageDeposit = (
  vault: IVault,
  vaultPosition: IVaultPosition,
  onClose: () => void
) => {
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
  const [balanceToken, setBalanceToken] = useState<string>("0");

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
    [vaultService, vault, account]
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
          .toString();

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

  const getBalancePosition = useCallback(
    (vaultPosition: IVaultPosition, vault: IVault) => {
      vaultService
        .previewRedeem(
          BigNumber(vaultPosition.balanceShares)
            .dividedBy(10 ** 18)
            .toString(),
          vault.id
        )
        .then((balanceToken) => {
          setBalanceToken(balanceToken);
        });
    },
    [vaultService, setBalanceToken]
  );

  useEffect(() => {
    setValue("formToken", "");
    setValue("formSharedToken", "");
  }, [formType]);

  useEffect(() => {
    formToken.trim() && approvalStatus(formToken);
  }, [vault, formToken]);

  useEffect(() => {
    getBalancePosition(vaultPosition, vault);
  }, [vaultPosition, vault]);

  useEffect(() => {
    getVaultTokenBalance();
  }, [account, token]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (formToken.trim() && BigNumber(formToken).isGreaterThan(0)) {
      updateSharedAmount(formToken);
    } else {
      timeout = setTimeout(() => {
        setValue("formSharedToken", "");
      }, 600);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
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

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      const { formToken, formSharedToken } = values;

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
          const blockNumber = await vaultService.redeem(
            formSharedToken,
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
    },
    [account, formType, vault]
  );

  return {
    walletBalance,
    isWalletFetching,
    token,
    control,
    formToken,
    formSharedToken,
    balanceToken,
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
