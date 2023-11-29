import React, { FC } from "react";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { DialogContent, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IVault } from "fathom-sdk";

import useOpenVaultDeposit from "hooks/useOpenVaultDeposit";

import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { DividerDefault } from "components/Positions/TopUpPositionDialog";
import DepositVaultInfo from "components/Vault/VaultListItem/DepositVaultModal/DepositVaultInfo";
import DepositVaultForm from "components/Vault/VaultListItem/DepositVaultModal/DepositVaultForm";

const VaultManageGridDialogWrapper = styled(AppDialog)`
  .MuiPaper-root {
    maxwidth: 600px;
  }

  .MuiGrid-container {
    padding: 10px 0 30px 0;
  }
`;

export type VaultDepositProps = {
  vaultItemData: IVault;
  onClose: () => void;
  onFinish: () => void;
  isMobile: boolean;
};

const VaultListItemDepositModal: FC<VaultDepositProps> = ({
  vaultItemData,
  onClose,
  onFinish,
  isMobile,
}) => {
  const {
    walletBalance,
    control,
    deposit,
    sharedToken,
    approveBtn,
    approvalPending,
    approve,
    setMax,
    handleSubmit,
    onSubmit,
  } = useOpenVaultDeposit(vaultItemData, onClose);

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
          />
          <DividerDefault orientation="vertical" flexItem></DividerDefault>
          <DepositVaultForm
            isMobile={isMobile}
            vaultItemData={vaultItemData}
            walletBalance={walletBalance}
            control={control}
            deposit={deposit}
            sharedToken={sharedToken}
            approveBtn={approveBtn}
            approvalPending={approvalPending}
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
