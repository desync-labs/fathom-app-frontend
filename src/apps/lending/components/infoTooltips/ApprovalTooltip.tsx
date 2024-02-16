import { Link } from "apps/lending/components/primitives/Link";
import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

export const ApprovalTooltip: FC<TextWithTooltipProps> = ({ ...rest }) => {
  return (
    <TextWithTooltip {...rest}>
      <>
        To continue, you need to grant Fathom lending smart contracts permission
        to move your funds from your wallet. Depending on the asset and wallet
        you use, it is done by signing the permission message (gas free), or by
        submitting an approval transaction (requires gas).{" "}
        <Link href="https://eips.ethereum.org/EIPS/eip-2612" underline="always">
          Learn more
        </Link>
      </>
    </TextWithTooltip>
  );
};
