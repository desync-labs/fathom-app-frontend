import { Button } from "@mui/material";
import { useRootStore } from "apps/lending/store/root";
import { AUTH } from "apps/lending/utils/mixPanelEvents";

import { FC } from "react";
import useConnector from "context/connector";

export interface ConnectWalletProps {
  funnel?: string;
}

export const ConnectWalletButton: FC<ConnectWalletProps> = ({ funnel }) => {
  const trackEvent = useRootStore((store) => store.trackEvent);
  const { openConnectorMenu } = useConnector();

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
