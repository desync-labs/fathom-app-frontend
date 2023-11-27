import React, { FC, useCallback, useEffect, useState } from "react";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { DialogContent, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import useConnector from "context/connector";
import { useStores } from "context/services";

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
  vaultItemData: any;
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
  const { poolService } = useStores();
  const { account, chainId, library } = useConnector()!;
  const { sharesSupply, shareToken, token } = vaultItemData;
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    getVaultTokenAndBalance();
  }, [account, token]);

  const getVaultTokenAndBalance = useCallback(async () => {
    if (token.name.toUpperCase() === "XDC") {
      const balance = await library.eth.getBalance(account);
      console.log("balance XDC: ", balance);
    } else {
      const balance = await poolService.getUserTokenBalance(
        account,
        token.id,
        library
      );

      setWalletBalance(Number(balance));
    }
  }, [account, library]);

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
          <DepositVaultInfo vaultItemData={vaultItemData} />
          <DividerDefault orientation="vertical" flexItem></DividerDefault>
          <DepositVaultForm
            onClose={onClose}
            isMobile={isMobile}
            token={token}
            walletBalance={walletBalance}
          />
        </Grid>
      </DialogContent>
    </VaultManageGridDialogWrapper>
  );
};

export default VaultListItemDepositModal;
