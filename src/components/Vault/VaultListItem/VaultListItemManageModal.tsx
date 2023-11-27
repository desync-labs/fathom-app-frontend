import React, { FC } from "react";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { DialogContent, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { DividerDefault } from "components/Positions/TopUpPositionDialog";
import ManageVaultForm from "components/Vault/VaultListItem/ManageVaultModal/ManageVaultForm";
import ManageVaultInfo from "components/Vault/VaultListItem/ManageVaultModal/ManageVaultInfo";

const VaultManageGridDialogWrapper = styled(AppDialog)`
  .MuiPaper-root {
    maxwidth: 600px;
  }

  .MuiGrid-container {
    padding: 10px 0 30px 0;
  }
`;

export type VaultManageProps = {
  onClose: () => void;
  onFinish: () => void;
  isMobile: boolean;
};

const VaultListItemManageModal: FC<VaultManageProps> = ({
  onClose,
  onFinish,
  isMobile,
}) => {
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
          <ManageVaultInfo />
          <DividerDefault orientation="vertical" flexItem></DividerDefault>
          <ManageVaultForm onClose={onClose} isMobile={isMobile} />
        </Grid>
      </DialogContent>
    </VaultManageGridDialogWrapper>
  );
};

export default VaultListItemManageModal;
