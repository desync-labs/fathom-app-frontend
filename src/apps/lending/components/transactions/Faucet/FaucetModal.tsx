import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { FaucetModalContent } from "apps/lending/components/transactions/Faucet/FaucetModalContent";

const FaucetModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;

  return (
    <BasicModal open={type === ModalType.Faucet} setOpen={close}>
      <ModalWrapper title={<>Faucet</>} underlyingAsset={args.underlyingAsset}>
        {(params) => <FaucetModalContent {...params} />}
      </ModalWrapper>
    </BasicModal>
  );
};

export default FaucetModal;
