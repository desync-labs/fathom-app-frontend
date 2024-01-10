import loadable from "@loadable/component";
import FaucetAssetsList from "apps/lending/modules/faucet/FaucetAssetsList";
import { FaucetTopPanel } from "apps/lending/modules/faucet/FaucetTopPanel";

import { ContentContainer } from "apps/lending/components/ContentContainer";

const FaucetModal = loadable(
  () => import("../components/transactions/Faucet/FaucetModal")
);
export default function Faucet() {
  return (
    <>
      <FaucetTopPanel />
      <ContentContainer>
        <FaucetAssetsList />
      </ContentContainer>
      <FaucetModal />
    </>
  );
}
