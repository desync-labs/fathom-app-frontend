import { FC, ReactNode } from "react";
import { useAddressAllowed } from "apps/lending/hooks/useAddressAllowed";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";

import { AddressBlockedModal } from "apps/lending/components/AddressBlockedModal";

export const AddressBlocked: FC<{ children: ReactNode }> = ({ children }) => {
  const { currentAccount, disconnectWallet, loading } = useWeb3Context();
  const screenAddress = loading ? "" : currentAccount;
  const { isAllowed } = useAddressAllowed(screenAddress);

  if (!isAllowed) {
    return (
      <AddressBlockedModal
        address={currentAccount}
        onDisconnectWallet={disconnectWallet}
      />
    );
  }

  return <>{children}</>;
};
