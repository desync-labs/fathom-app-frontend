import { Trans } from "@lingui/macro";
import { Button } from "@mui/material";
import { useWalletModalContext } from "apps/lending/hooks/useWalletModal";
import { useRootStore } from "apps/lending/store/root";
import { AUTH } from "apps/lending/utils/mixPanelEvents";

import { WalletModal } from "apps/lending/components/WalletConnection/WalletModal";
import { FC } from "react";

export interface ConnectWalletProps {
  funnel?: string;
}

export const ConnectWalletButton: FC<ConnectWalletProps> = ({ funnel }) => {
  const { setWalletModalOpen } = useWalletModalContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <>
      <Button
        variant="gradient"
        onClick={() => {
          trackEvent(AUTH.CONNECT_WALLET, { funnel: funnel });
          setWalletModalOpen(true);
        }}
      >
        <Trans>Connect wallet</Trans>
      </Button>
      <WalletModal />
    </>
  );
};
