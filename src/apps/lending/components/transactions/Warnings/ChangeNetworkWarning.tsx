import { ChainId } from "@into-the-fathom/lending-contract-helpers";
import { Button, Typography } from "@mui/material";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { TrackEventProps } from "apps/lending/store/analyticsSlice";
import { useRootStore } from "apps/lending/store/root";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { Warning } from "apps/lending/components/primitives/Warning";
import { FC } from "react";

export type ChangeNetworkWarningProps = {
  funnel?: string;
  networkName: string;
  chainId: ChainId;
  event?: TrackEventProps;
};

export const ChangeNetworkWarning: FC<ChangeNetworkWarningProps> = ({
  networkName,
  chainId,
  event,
  funnel,
}) => {
  const { switchNetwork, switchNetworkError } = useWeb3Context();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleSwitchNetwork = () => {
    trackEvent(GENERAL.SWITCH_NETWORK, {
      funnel,
      ...event?.eventParams,
      network: networkName,
    });
    switchNetwork(chainId);
  };
  return (
    <Warning severity="error" icon={false}>
      {switchNetworkError ? (
        <Typography>
          Seems like we can&apos;t switch the network automatically. Please
          check if you can change it from the wallet.
        </Typography>
      ) : (
        <Typography
          variant="description"
          display={"flex"}
          alignItems={"center"}
          gap={"7px"}
        >
          Please switch to {networkName}.{" "}
          <Button
            variant="text"
            sx={{ ml: "2px", verticalAlign: "top" }}
            onClick={handleSwitchNetwork}
            disableRipple
          >
            <Typography variant="description">Switch Network</Typography>
          </Button>
        </Typography>
      )}
    </Warning>
  );
};
