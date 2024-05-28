import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { VaultProvider } from "context/vault";
import VaultDetailContent from "components/Vaults/VaultDetail/VaultDetailContent";

const VaultDetailView = () => {
  const { vaultAddress } = useParams();

  if (vaultAddress === undefined) {
    return (
      <Box>
        <Typography variant="h1">Vault Address not exist</Typography>
      </Box>
    );
  }

  return (
    <VaultProvider vaultId={vaultAddress}>
      <VaultDetailContent />
    </VaultProvider>
  );
};

export default VaultDetailView;
