import { FormProvider } from "react-hook-form";
import { Box, styled, Typography } from "@mui/material";
import useVaultContext from "context/vault";
import useVaultOpenDeposit from "hooks/useVaultOpenDeposit";
import { VaultPaper } from "components/AppComponents/AppPaper/AppPaper";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import DepositVaultForm from "components/Vaults/VaultList/DepositVaultModal/DepositVaultForm";
import DepositVaultInfo from "./DepositVaultInfo";

const VaultDetailFormColumn = styled(Box)`
  width: 50%;
`;

const VaultDetailDepositForm = () => {
  const { vault } = useVaultContext();

  const onClose = () => {
    methods.reset();
  };

  const {
    methods,
    walletBalance,
    isWalletFetching,
    control,
    deposit,
    sharedToken,
    approveBtn,
    approvalPending,
    openDepositLoading,
    errors,
    approve,
    setMax,
    validateMaxDepositValue,
    handleSubmit,
    onSubmit,
  } = useVaultOpenDeposit(vault, onClose);

  return (
    <VaultPaper sx={{ marginBottom: "24px" }}>
      <Typography variant="h3">Deposit</Typography>
      <AppFlexBox pt="20px" sx={{ alignItems: "flex-start", gap: "20px" }}>
        <FormProvider {...methods}>
          <VaultDetailFormColumn>
            <DepositVaultForm
              vaultItemData={vault}
              walletBalance={walletBalance}
              control={control}
              setMax={setMax}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              validateMaxDepositValue={validateMaxDepositValue}
            />
          </VaultDetailFormColumn>
          <DepositVaultInfo
            vaultItemData={vault}
            deposit={deposit}
            sharedToken={sharedToken}
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

export default VaultDetailDepositForm;
