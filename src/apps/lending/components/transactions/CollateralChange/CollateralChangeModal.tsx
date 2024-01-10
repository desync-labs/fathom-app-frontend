import { Trans } from "@lingui/macro";
import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { CollateralChangeModalContent } from "./CollateralChangeModalContent";

const CollateralChangeModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;
  return (
    <BasicModal open={type === ModalType.CollateralChange} setOpen={close}>
      <ModalWrapper
        title={<Trans>Review tx</Trans>}
        underlyingAsset={args.underlyingAsset}
      >
        {(params) => <CollateralChangeModalContent {...params} />}
      </ModalWrapper>
    </BasicModal>
  );
};

export default CollateralChangeModal;
