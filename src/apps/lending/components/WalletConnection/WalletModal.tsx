import { useWalletModalContext } from "apps/lending/hooks/useWalletModal";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { WalletSelector } from "apps/lending/components/WalletConnection/WalletSelector";

export const WalletModal = () => {
  const { isWalletModalOpen, setWalletModalOpen } = useWalletModalContext();

  return (
    <BasicModal open={isWalletModalOpen} setOpen={setWalletModalOpen}>
      <WalletSelector />
    </BasicModal>
  );
};
