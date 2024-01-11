import { Button } from "@mui/material";
import { useRootStore } from "apps/lending/store/root";
import { AUTH } from "apps/lending/utils/mixPanelEvents";

import { FC } from "react";
import useAppsShared from "context/appsShared";

export interface ConnectWalletProps {
  funnel?: string;
}

export const ConnectWalletButton: FC<ConnectWalletProps> = ({ funnel }) => {
  const trackEvent = useRootStore((store) => store.trackEvent);
  const { openConnectorMenu } = useAppsShared();

  return (
    <>
      <Button
        variant="gradient"
        onClick={(event) => {
          trackEvent(AUTH.CONNECT_WALLET, { funnel: funnel });
          openConnectorMenu(event);
        }}
      >
        Connect wallet
      </Button>
    </>
  );
};
