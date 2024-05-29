import { VaultPaper } from "components/AppComponents/AppPaper/AppPaper";
import {
  VaultNavItem,
  VaultNavWrapper,
} from "components/Vaults/VaultDetail/VaultDetailInfoNav";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import ManageVaultForm from "components/Vaults/VaultDetail/VaultDetailForm/ManageVaultForm";
import ManageVaultInfo from "components/Vaults/VaultDetail/VaultDetailForm/ManageVaultInfo";
import useVaultManageDeposit, { FormType } from "hooks/useVaultManageDeposit";
import useVaultContext from "context/vault";
import useSharedContext from "context/shared";
import { FormProvider } from "react-hook-form";

const VaultDetailForm = () => {
  const { vault, vaultPosition, balanceToken } = useVaultContext();
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
  } = useVaultManageDeposit(vault, vaultPosition);
  const { isMobile } = useSharedContext();

  const { shutdown } = vault;

  const onClose = () => {
    console.log("onClose");
  };

  return (
    <VaultPaper sx={{ marginBottom: "24px" }}>
      <VaultNavWrapper>
        {!shutdown && (
          <VaultNavItem
            className={formType === FormType.DEPOSIT ? "active" : ""}
            onClick={() => setFormType(FormType.DEPOSIT)}
          >
            Deposit
          </VaultNavItem>
        )}
        <VaultNavItem
          className={formType === FormType.WITHDRAW ? "active" : ""}
          onClick={() => setFormType(FormType.WITHDRAW)}
        >
          Withdraw
        </VaultNavItem>
      </VaultNavWrapper>
      <AppFlexBox pt="20px" sx={{ alignItems: "flex-start", gap: "20px" }}>
        <FormProvider {...methods}>
          <ManageVaultForm
            vaultItemData={vault}
            balanceToken={balanceToken}
            walletBalance={walletBalance}
            isWalletFetching={isWalletFetching}
            control={control}
            formToken={formToken}
            approveBtn={approveBtn}
            approvalPending={approvalPending}
            formType={formType}
            approve={approve}
            setMax={setMax}
            validateMaxValue={validateMaxValue}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            vaultPosition={vaultPosition}
          />
          <ManageVaultInfo
            formType={formType}
            vaultItemData={vault}
            vaultPosition={vaultPosition}
            formToken={formToken}
            formSharedToken={formSharedToken}
            isMobile={isMobile}
            onClose={onClose}
            openDepositLoading={openDepositLoading}
            errors={errors}
            approveBtn={approveBtn}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </FormProvider>
      </AppFlexBox>
    </VaultPaper>
  );
};

export default VaultDetailForm;
