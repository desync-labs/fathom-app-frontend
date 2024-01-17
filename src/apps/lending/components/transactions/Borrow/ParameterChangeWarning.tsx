import { Warning } from "apps/lending/components/primitives/Warning";
import { useRootStore } from "apps/lending/store/root";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";
import { FC } from "react";

export const ParameterChangeWarning: FC<{
  underlyingAsset: string;
}> = ({ underlyingAsset }) => {
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <Warning severity="info" sx={{ my: 6 }}>
      <b>Attention:</b> Parameter changes via governance can alter your account
      health factor and risk of liquidation. Follow the{" "}
      <a
        onClick={() => {
          trackEvent(GENERAL.EXTERNAL_LINK, {
            asset: underlyingAsset,
            Link: "Governance Link",
          });
        }}
        href="https://governance.aave.com/"
      >
        Aave governance forum
      </a>{" "}
      for updates.
    </Warning>
  );
};
