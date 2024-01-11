import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import {
  EmodeModalContent,
  EmodeModalType,
} from "apps/lending/components/transactions/Emode/EmodeModalContent";

const EmodeModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    emode: EmodeModalType;
  }>;
  return (
    <BasicModal open={type === ModalType.Emode} setOpen={close}>
      <EmodeModalContent mode={args.emode} />
    </BasicModal>
  );
};

export default EmodeModal;
