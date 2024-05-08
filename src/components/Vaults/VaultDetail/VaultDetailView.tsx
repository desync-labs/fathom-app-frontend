import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { VaultProvider } from "context/vault";
import VaultBreadcrumbs from "components/Vaults/VaultDetail/Breadcrumbs";
import VaultPositionStats from "components/Vaults/VaultDetail/VaultPositionStats";
import VaultDetailInfoTabs from "./VaultDetailInfoTabs";

const VaultDetailView = () => {
  const { vaultAddress } = useParams();

  if (vaultAddress === undefined) {
    return (
      <Box>
        <Typography variant="h1">Vault Address undefined</Typography>
      </Box>
    );
  }

  return (
    <VaultProvider vaultId={vaultAddress}>
      <>
        <VaultBreadcrumbs />
        <VaultPositionStats />
        <VaultDetailInfoTabs />
      </>
    </VaultProvider>
  );
};

export default VaultDetailView;
