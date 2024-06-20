import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import { IVault, VaultType } from "fathom-sdk";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { useServices } from "context/services";
import { formatNumber } from "utils/format";

// ToDo: Remove or rebase this constant
export const MAX_PERSONAL_DEPOSIT = 50000;
export const defaultValues = {
  deposit: "",
  sharedToken: "",
};

const useVaultOpenDeposit = (vault: IVault, onClose: () => void) => {
  const { account } = useConnector();
  const { poolService, vaultService } = useServices();
  const { setLastTransactionBlock } = useSyncContext();

  const methods = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const { token, depositLimit, balanceTokens, type } = vault;
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [isWalletFetching, setIsWalletFetching] = useState<boolean>(false);
  const [openDepositLoading, setOpenDepositLoading] = useState<boolean>(false);

  const [approveBtn, setApproveBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const deposit = methods.watch("deposit");
  const sharedToken = methods.watch("sharedToken");

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

        methods.setValue("sharedToken", sharedConverted);
      }, 500),
    [vaultService, vault, deposit]
  );

  const getVaultTokenBalance = useCallback(async () => {
    const balance = await poolService.getUserTokenBalance(account, token.id);
    setWalletBalance(balance.toString());
    setIsWalletFetching(true);
  }, [account, token, setWalletBalance, setIsWalletFetching]);

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
    if (deposit.trim()) {
      approvalStatus(deposit);
    } else {
      setApproveBtn(false);
    }
  }, [deposit, approvalStatus, setApproveBtn]);

  useEffect(() => {
    if (account && vault.token) {
      getVaultTokenBalance();
    }
  }, [account, vault, getVaultTokenBalance]);

  useEffect(() => {
    if (deposit && BigNumber(deposit).isGreaterThan(0)) {
      updateSharedAmount(deposit);
    } else {
      setTimeout(() => {
        methods.setValue("sharedToken", "0");
      }, 600);
    }
  }, [deposit]);

  const setMax = useCallback(() => {
    const maxWalletBalance = BigNumber.min(
      BigNumber(walletBalance).dividedBy(10 ** 18),
      BigNumber.max(
        BigNumber(depositLimit)
          .minus(balanceTokens)
          .dividedBy(10 ** 18),
        BigNumber(0)
      )
    ).decimalPlaces(6, BigNumber.ROUND_DOWN);

    methods.setValue("deposit", maxWalletBalance.toString(), {
      shouldValidate: true,
    });
  }, [methods, walletBalance, depositLimit, balanceTokens]);

  const depositLimitExceeded = (value: string) => {
    if (
      BigNumber(value).isGreaterThanOrEqualTo(
        BigNumber(depositLimit).dividedBy(10 ** 18)
      )
    ) {
      return `The ${
        BigNumber(depositLimit)
          .dividedBy(10 ** 18)
          .toNumber() / 1000
      }k ${token.symbol} limit has been exceeded.`;
    } else {
      return false;
    }
  };

  const validateMaxDepositValue = useCallback(
    (value: string) => {
      const formattedMaxWalletBalance = BigNumber(walletBalance).dividedBy(
        10 ** 18
      );
      const formattedMaxDepositLimit = BigNumber.max(
        type === VaultType.TRADEFLOW
          ? BigNumber(depositLimit).dividedBy(10 ** 18)
          : BigNumber(depositLimit).minus(
              BigNumber(balanceTokens).dividedBy(10 ** 18)
            ),
        0
      );
      if (BigNumber(value).isGreaterThan(formattedMaxWalletBalance)) {
        return "You do not have enough money in your wallet";
      }

      if (BigNumber(value).isGreaterThan(formattedMaxDepositLimit)) {
        return `Deposit value exceeds the maximum allowed limit ${formatNumber(
          formattedMaxDepositLimit.toNumber()
        )} ${token.symbol}`;
      }
      if (
        BigNumber(value).isGreaterThan(
          BigNumber(depositLimit).dividedBy(10 ** 18)
        )
      ) {
        return `The ${
          BigNumber(depositLimit)
            .dividedBy(10 ** 18)
            .toNumber() / 1000
        }k ${
          token.symbol
        } limit has been exceeded. Please reduce the amount to continue.`;
      }

      return true;
    },
    [type, depositLimit, balanceTokens, walletBalance]
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
    methods,
    walletBalance,
    isWalletFetching,
    control: methods.control,
    deposit,
    sharedToken,
    approveBtn,
    approvalPending,
    openDepositLoading,
    errors: methods.formState.errors,
    approve,
    setMax,
    validateMaxDepositValue,
    handleSubmit: methods.handleSubmit,
    onSubmit,
    depositLimitExceeded,
  };
};

export default useVaultOpenDeposit;
