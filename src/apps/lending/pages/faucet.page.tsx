import { Box } from "@mui/material";
import FaucetAssetsList from "apps/lending/modules/faucet/FaucetAssetsList";
import { FaucetTopPanel } from "apps/lending/modules/faucet/FaucetTopPanel";
import { ContentContainer } from "apps/lending/components/ContentContainer";
import FaucetModal from "apps/lending/components/transactions/Faucet/FaucetModal";

export default function Faucet() {
  return (
    <>
      <FaucetTopPanel />
      <Box
        sx={{
          mt: { xs: "-32px", lg: "-46px", xl: "-44px", xxl: "-48px" },
        }}
      >
        <ContentContainer>
          <FaucetAssetsList />
        </ContentContainer>
        <FaucetModal />
      </Box>
    </>
  );
}
