import { FormProvider } from "react-hook-form";
import { Box, styled } from "@mui/material";
import useVaultManageDeposit, {
  FormType,
} from "hooks/Vaults/useVaultManageDeposit";
import useVaultContext from "context/vault";
import useSharedContext from "context/shared";
import { VaultPaper } from "components/AppComponents/AppPaper/AppPaper";
import {
  AppNavItem,
  AppNavWrapper,
} from "components/AppComponents/AppTabs/AppTabs";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import ManageVaultInfo from "components/Vaults/VaultDetail/VaultDetailForm/ManageVaultInfo";
import ManageVaultForm from "components/Vaults/VaultList/ManageVaultModal/ManageVaultForm";
import { memo } from "react";

const VaultFormWrapper = styled(AppFlexBox)`
  align-items: flex-start;
  gap: 20px;
  padding-top: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    padding-top: 20px;
  }
`;

const VaultDetailFormColumn = styled(Box)`
  width: 50%;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

const VaultDetailManageForm = () => {
  const { vault, vaultPosition, balanceToken, minimumDeposit } =
    useVaultContext();

  const onClose = () => {
    methods.reset();
  };

  const {
    formType,
    setFormType,
    isWalletFetching,
    walletBalance,
    control,
    formToken,
    formSharedToken,
    approveBtn,
    approvalPending,
    openDepositLoading,
    errors,
    approve,
    setMax,
    validateMaxValue,
    handleSubmit,
    onSubmit,
    methods,
    withdrawLimitExceeded,
    depositLimitExceeded,
  } = useVaultManageDeposit(vault, vaultPosition, minimumDeposit, onClose);
  const { isMobile } = useSharedContext();

  const { shutdown } = vault;

  return (
    <VaultPaper sx={{ marginBottom: isMobile ? "20px" : "24px" }}>
      <AppNavWrapper>
        {!shutdown && (
          <AppNavItem
            className={formType === FormType.DEPOSIT ? "active" : ""}
            onClick={() => setFormType(FormType.DEPOSIT)}
            data-testid="vault-detailManageModal-depositNavItem"
          >
            Deposit
          </AppNavItem>
        )}
        <AppNavItem
          className={formType === FormType.WITHDRAW ? "active" : ""}
          onClick={() => setFormType(FormType.WITHDRAW)}
          data-testid="vault-detailManageModal-withdrawNavItem"
        >
          Withdraw
        </AppNavItem>
      </AppNavWrapper>
      <VaultFormWrapper>
        <FormProvider {...methods}>
          <VaultDetailFormColumn>
            <ManageVaultForm
              vaultItemData={vault}
              balanceToken={balanceToken}
              walletBalance={walletBalance}
              control={control}
              formType={formType}
              setMax={setMax}
              validateMaxValue={validateMaxValue}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              vaultPosition={vaultPosition}
              depositLimitExceeded={depositLimitExceeded}
              dataTestIdPrefix="vault-detailManageModal"
            />
          </VaultDetailFormColumn>
          <ManageVaultInfo
            formType={formType}
            vaultItemData={vault}
            vaultPosition={vaultPosition}
            formToken={formToken}
            formSharedToken={formSharedToken}
            isWalletFetching={isWalletFetching}
            walletBalance={walletBalance}
            onClose={onClose}
            openDepositLoading={openDepositLoading}
            errors={errors}
            approveBtn={approveBtn}
            approve={approve}
            approvalPending={approvalPending}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            withdrawLimitExceeded={withdrawLimitExceeded}
          />
        </FormProvider>
      </VaultFormWrapper>
    </VaultPaper>
  );
};

export default memo(VaultDetailManageForm);
