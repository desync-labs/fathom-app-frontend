import { useRootStore } from "apps/lending/store/root";
import { AUTH } from "apps/lending/utils/mixPanelEvents";

import { FC } from "react";
import useConnector from "context/connector";
import WalletConnectBtn from "components/Common/WalletConnectBtn";

export interface ConnectWalletProps {
  funnel?: string;
}

export const ConnectWalletButton: FC<ConnectWalletProps> = ({ funnel }) => {
  const trackEvent = useRootStore((store) => store.trackEvent);
  const { openConnectorMenu } = useConnector();

  return (
    <>
      <WalletConnectBtn
        fullwidth
        sx={{ maxWidth: "15rem", margin: "0 0 10px 0" }}
        onClick={(event) => {
          trackEvent(AUTH.CONNECT_WALLET, { funnel: funnel });
          openConnectorMenu(event);
        }}
      >
        Connect wallet
      </WalletConnectBtn>
    </>
  );
};
