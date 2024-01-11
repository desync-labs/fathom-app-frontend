import { ReactNode } from "react";
import { useAddressAllowed } from "apps/lending/hooks/useAddressAllowed";
import { MainLayout } from "apps/lending/layouts/MainLayout";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { ENABLE_TESTNET } from "apps/lending/utils/marketsAndNetworksConfig";

import { AddressBlockedModal } from "apps/lending/components/AddressBlockedModal";

export const AddressBlocked = ({ children }: { children: ReactNode }) => {
  const { currentAccount, disconnectWallet, loading } = useWeb3Context();
  const screenAddress = loading || ENABLE_TESTNET ? "" : currentAccount;
  const { isAllowed } = useAddressAllowed(screenAddress);

  if (!isAllowed) {
    return (
      <MainLayout>
        <AddressBlockedModal
          address={currentAccount}
          onDisconnectWallet={disconnectWallet}
        />
        ;
      </MainLayout>
    );
  }

  return <>{children}</>;
};
