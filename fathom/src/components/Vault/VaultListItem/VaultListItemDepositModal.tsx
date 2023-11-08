import React, { FC } from "react";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  DialogContent,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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
  onClose: () => void;
  onFinish: () => void;
  isMobile: boolean;
};

const VaultListItemDepositModal: FC<VaultDepositProps> = ({
  onClose,
  onFinish,
  isMobile
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
        Deposit To Vault
      </AppDialogTitle>

      <DialogContent>
        <Grid container>
          <DepositVaultInfo />
          <DividerDefault orientation="vertical" flexItem></DividerDefault>
          <DepositVaultForm onClose={onClose} isMobile={isMobile} />
        </Grid>
      </DialogContent>
    </VaultManageGridDialogWrapper>
  );
};

export default VaultListItemDepositModal;
