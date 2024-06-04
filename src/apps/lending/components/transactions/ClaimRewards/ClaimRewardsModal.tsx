import { UserAuthenticated } from "apps/lending/components/UserAuthenticated";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { ModalType, useModalContext } from "apps/lending/hooks/useModal";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ClaimRewardsModalContent } from "apps/lending/components/transactions/ClaimRewards/ClaimRewardsModalContent";

const ClaimRewardsModal = () => {
  const { type, close } = useModalContext();
  const { reserves } = useAppDataContext();
  return (
    <BasicModal open={type === ModalType.ClaimRewards} setOpen={close}>
      <UserAuthenticated>
        {(user) => <ClaimRewardsModalContent user={user} reserves={reserves} />}
      </UserAuthenticated>
    </BasicModal>
  );
};

export default ClaimRewardsModal;
