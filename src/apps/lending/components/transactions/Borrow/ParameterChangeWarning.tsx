import { Warning } from "apps/lending/components/primitives/Warning";
import { FC } from "react";

export const ParameterChangeWarning: FC<{
  underlyingAsset: string;
}> = () => {
  return (
    <Warning severity="info" sx={{ my: 3 }}>
      <strong>Attention:</strong> Parameter changes via governance can alter
      your account health factor and risk of liquidation.
    </Warning>
  );
};
