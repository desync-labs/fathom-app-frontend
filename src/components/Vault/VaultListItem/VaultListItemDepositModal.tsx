import { FC } from "react";
import { DialogContent, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import { IVault } from "fathom-sdk";
import useVaultOpenDeposit from "hooks/useVaultOpenDeposit";
import useSharedContext from "context/shared";

import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { DividerDefault } from "components/Positions/TopUpPositionDialog";
import DepositVaultInfo from "components/Vault/VaultListItem/DepositVaultModal/DepositVaultInfo";
import DepositVaultForm from "components/Vault/VaultListItem/DepositVaultModal/DepositVaultForm";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";

const VaultManageGridDialogWrapper = styled(AppDialog)`
  .MuiGrid-container {
    padding: 10px 0 30px 0;
  }
`;

export type VaultDepositProps = {
  vaultItemData: IVault;
  performanceFee: number;
  onClose: () => void;
};

const VaultListItemDepositModal: FC<VaultDepositProps> = ({
  vaultItemData,
  performanceFee,
  onClose,
}) => {
  const {
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
    handleSubmit,
    onSubmit,
  } = useVaultOpenDeposit(vaultItemData, onClose);
  const { isMobile } = useSharedContext();

  return (
    <VaultManageGridDialogWrapper
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="md"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Deposit To Vault
      </AppDialogTitle>

      <DialogContent>
        <Grid container>
          <DepositVaultInfo
            vaultItemData={vaultItemData}
            deposit={deposit}
            sharedToken={sharedToken}
            performanceFee={performanceFee}
          />
          <DividerDefault orientation="vertical" flexItem></DividerDefault>
          <DepositVaultForm
            isMobile={isMobile}
            vaultItemData={vaultItemData}
            walletBalance={walletBalance}
            isWalletFetching={isWalletFetching}
            control={control}
            deposit={deposit}
            sharedToken={sharedToken}
            approveBtn={approveBtn}
            approvalPending={approvalPending}
            openDepositLoading={openDepositLoading}
            errors={errors}
            approve={approve}
            onClose={onClose}
            setMax={setMax}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </Grid>
      </DialogContent>
    </VaultManageGridDialogWrapper>
  );
};

export default VaultListItemDepositModal;
