import { FC } from "react";
import { DialogContent, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import { IVault, IVaultPosition } from "fathom-sdk";
import useVaultManageDeposit from "hooks/useVaultManageDeposit";

import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { DividerDefault } from "components/Positions/TopUpPositionDialog";
import ManageVaultForm from "components/Vault/VaultListItem/ManageVaultModal/ManageVaultForm";
import ManageVaultInfo from "components/Vault/VaultListItem/ManageVaultModal/ManageVaultInfo";

const VaultManageGridDialogWrapper = styled(AppDialog)`
  .MuiGrid-container {
    padding: 10px 0 30px 0;
  }
`;

export type VaultManageProps = {
  isMobile: boolean;
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  onClose: () => void;
};

const VaultListItemManageModal: FC<VaultManageProps> = ({
  isMobile,
  vaultItemData,
  vaultPosition,
  onClose,
}) => {
  const {
    walletBalance,
    isWalletFetching,
    control,
    formToken,
    formSharedToken,
    approveBtn,
    approvalPending,
    formType,
    balanceToken,
    openDepositLoading,
    errors,
    setFormType,
    approve,
    setMax,
    handleSubmit,
    onSubmit,
  } = useVaultManageDeposit(vaultItemData, vaultPosition, onClose);

  return (
    <VaultManageGridDialogWrapper
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="md"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Manage Vault
      </AppDialogTitle>

      <DialogContent>
        <Grid container>
          <ManageVaultInfo
            formType={formType}
            vaultItemData={vaultItemData}
            vaultPosition={vaultPosition}
            formToken={formToken}
            formSharedToken={formSharedToken}
          />
          <DividerDefault orientation="vertical" flexItem></DividerDefault>
          <ManageVaultForm
            balanceToken={balanceToken}
            vaultItemData={vaultItemData}
            vaultPosition={vaultPosition}
            onClose={onClose}
            isMobile={isMobile}
            walletBalance={walletBalance}
            isWalletFetching={isWalletFetching}
            control={control}
            formToken={formToken}
            formSharedToken={formSharedToken}
            approveBtn={approveBtn}
            approvalPending={approvalPending}
            formType={formType}
            openDepositLoading={openDepositLoading}
            errors={errors}
            setFormType={setFormType}
            approve={approve}
            setMax={setMax}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </Grid>
      </DialogContent>
    </VaultManageGridDialogWrapper>
  );
};

export default VaultListItemManageModal;
