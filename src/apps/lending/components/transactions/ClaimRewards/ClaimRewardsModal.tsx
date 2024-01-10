import { ModalType, useModalContext } from "apps/lending/hooks/useModal";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ClaimRewardsModalContent } from "apps/lending/components/transactions/ClaimRewards/ClaimRewardsModalContent";

const ClaimRewardsModal = () => {
  const { type, close } = useModalContext();
  return (
    <BasicModal open={type === ModalType.ClaimRewards} setOpen={close}>
      <ClaimRewardsModalContent />
    </BasicModal>
  );
};

export default ClaimRewardsModal;
