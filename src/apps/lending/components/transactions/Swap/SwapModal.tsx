import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";

import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { SwapModalContent } from "apps/lending/components/transactions/Swap/SwapModalContent";

const SwapModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;
  return (
    <BasicModal open={type === ModalType.Swap} setOpen={close}>
      <ModalWrapper title={<>Switch</>} underlyingAsset={args.underlyingAsset}>
        {(params) => <SwapModalContent {...params} />}
      </ModalWrapper>
    </BasicModal>
  );
};

export default SwapModal;
