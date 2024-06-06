import { FormProvider } from "react-hook-form";
import { Box, styled } from "@mui/material";
import useVaultManageDeposit, { FormType } from "hooks/useVaultManageDeposit";
import useVaultContext from "context/vault";
import { VaultPaper } from "components/AppComponents/AppPaper/AppPaper";
import {
  VaultNavItem,
  VaultNavWrapper,
} from "components/Vaults/VaultDetail/VaultDetailInfoNav";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import ManageVaultInfo from "components/Vaults/VaultDetail/VaultDetailForm/ManageVaultInfo";
import ManageVaultForm from "components/Vaults/VaultList/ManageVaultModal/ManageVaultForm";

const VaultDetailFormColumn = styled(Box)`
  width: 50%;
`;

const VaultDetailManageForm = () => {
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
          />
        </FormProvider>
      </AppFlexBox>
    </VaultPaper>
  );
};

export default VaultDetailManageForm;
