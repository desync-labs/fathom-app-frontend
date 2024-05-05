import { useCallback, useEffect, useMemo, useState } from "react";
import { IVault, IVaultPosition } from "fathom-sdk";
import { useForm } from "react-hook-form";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import useConnector from "context/connector";
import { useServices } from "context/services";
import useSyncContext from "context/sync";
import { formatNumber } from "utils/format";
import { MAX_PERSONAL_DEPOSIT } from "./useVaultOpenDeposit";

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
  const { account } = useConnector();
  const { poolService, vaultService } = useServices();
  const { setLastTransactionBlock } = useSyncContext();
  const { balancePosition, balanceShares } = vaultPosition;

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

  const { token, depositLimit, balanceTokens } = vault;
  const [formType, setFormType] = useState<FormType>(
    vault.shutdown ? FormType.WITHDRAW : FormType.DEPOSIT
  );
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [isWalletFetching, setIsWalletFetching] = useState<boolean>(false);
  const [openDepositLoading, setOpenDepositLoading] = useState<boolean>(false);
  const [balanceToken, setBalanceToken] = useState<string>("0");

  const [approveBtn, setApproveBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);
  const [isFullWithdraw, setIsFullWithdraw] = useState<boolean>(false);

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

        if (isFullWithdraw) {
          setIsFullWithdraw(false);
          return;
        }

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
    [vaultService, vault, formType, isFullWithdraw, setIsFullWithdraw]
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

  const getBalancePosition = useCallback(() => {
    vaultService
      .previewRedeem(
        BigNumber(vaultPosition.balanceShares)
          .dividedBy(10 ** 18)
          .toString(),
        vault.id
      )
      .then((balanceToken: string) => {
        setBalanceToken(balanceToken);
      });
  }, [vaultService, vault, vaultPosition, setBalanceToken]);

  useEffect(() => {
    setValue("formToken", "", { shouldValidate: true });
    setValue("formSharedToken", "", { shouldValidate: true });
  }, [formType]);

  useEffect(() => {
    formToken.trim() && approvalStatus(formToken);
  }, [vault, formToken]);

  useEffect(() => {
    getBalancePosition();
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
  }, [formToken, updateSharedAmount]);

  const getVaultTokenBalance = useCallback(async () => {
    const balance = await poolService.getUserTokenBalance(account, token.id);
    setWalletBalance(balance.toString());
    setIsWalletFetching(true);
  }, [account]);

  const validateDeposit = (
    value: string,
    maxWalletBalance: BigNumber,
    maxDepositLimit: BigNumber
  ) => {
    if (BigNumber(value).isGreaterThan(maxWalletBalance)) {
      return "You do not have enough money in your wallet";
    }

    if (BigNumber(value).isGreaterThan(maxDepositLimit)) {
      return `Deposit value exceeds the maximum allowed limit ${formatNumber(
        maxDepositLimit.toNumber()
      )} ${token.symbol}`;
    }

    if (
      BigNumber(value).isGreaterThan(MAX_PERSONAL_DEPOSIT) ||
      BigNumber(balancePosition)
        .dividedBy(10 ** 18)
        .plus(value)
        .isGreaterThan(MAX_PERSONAL_DEPOSIT)
    ) {
      return `The ${MAX_PERSONAL_DEPOSIT / 1000}k ${
        token.symbol
      } limit has been exceeded. Please reduce the amount to continue.`;
    }

    return true;
  };

  const validateRepay = (value: string, maxBalanceToken: BigNumber) => {
    if (BigNumber(value).isGreaterThan(maxBalanceToken)) {
      return "You don't have enough to repay that amount";
    }

    return true;
  };

  const validateMaxValue = useCallback(
    (value: string) => {
      if (formType === FormType.DEPOSIT) {
        const maxWalletBalance = BigNumber(walletBalance).dividedBy(10 ** 18);
        const maxDepositLimit = BigNumber(depositLimit)
          .minus(balanceTokens)
          .dividedBy(10 ** 18);

        return validateDeposit(value, maxWalletBalance, maxDepositLimit);
      } else {
        const maxBalanceToken = BigNumber(balanceToken).dividedBy(10 ** 18);
        return validateRepay(value, maxBalanceToken);
      }
    },
    [depositLimit, balanceTokens, walletBalance, balanceToken, formType]
  );

  const setMax = useCallback(() => {
    if (formType === FormType.DEPOSIT) {
      const max = BigNumber.min(
        BigNumber(walletBalance).dividedBy(10 ** 18),
        BigNumber(depositLimit)
          .minus(balanceTokens)
          .dividedBy(10 ** 18),
        BigNumber(MAX_PERSONAL_DEPOSIT).minus(
          BigNumber(balancePosition).dividedBy(10 ** 18)
        )
      ).decimalPlaces(18, BigNumber.ROUND_DOWN);

      const maxCapped = max.isNegative() ? BigNumber(0) : max;

      setValue("formToken", maxCapped.toString(), { shouldValidate: true });
    } else {
      setIsFullWithdraw(true);
      setValue(
        "formToken",
        BigNumber(balanceToken)
          .dividedBy(10 ** 18)
          .toString(),
        { shouldValidate: true }
      );
      setValue(
        "formSharedToken",
        BigNumber(balanceShares)
          .dividedBy(10 ** 18)
          .toString(),
        { shouldValidate: true }
      );
    }
  }, [
    setValue,
    setIsFullWithdraw,
    isFullWithdraw,
    walletBalance,
    balancePosition,
    depositLimit,
    balanceTokens,
    balanceToken,
    formType,
    balanceShares,
  ]);

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
    validateMaxValue,
    handleSubmit,
    onSubmit,
  };
};

export default useVaultManageDeposit;
