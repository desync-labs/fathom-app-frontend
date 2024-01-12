import { PERMISSION } from "@into-the-fathom/lending-contract-helpers";
import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { SupplyModalContent } from "apps/lending/components/transactions/Supply/SupplyModalContent";

const SupplyModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;

  return (
    <BasicModal open={type === ModalType.Supply} setOpen={close}>
      <ModalWrapper
        action="supply"
        title={<>Supply</>}
        underlyingAsset={args.underlyingAsset}
        requiredPermission={PERMISSION.DEPOSITOR}
      >
        {(params) => <SupplyModalContent {...params} />}
      </ModalWrapper>
    </BasicModal>
  );
};

export default SupplyModal;
