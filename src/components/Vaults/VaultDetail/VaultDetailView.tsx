import { useParams } from "react-router-dom";
import { VaultProvider } from "context/vault";
import VaultDetailContent from "components/Vaults/VaultDetail/VaultDetailContent";

const VaultDetailView = () => {
  const { vaultAddress, ...rest } = useParams();

  return (
    <VaultProvider vaultId={vaultAddress} urlParams={rest["*"]}>
      <VaultDetailContent />
    </VaultProvider>
  );
};

export default VaultDetailView;
