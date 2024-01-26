import {
  InterestRate,
  PERMISSION,
} from "@into-the-fathom/lending-contract-helpers";
import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { RepayModalContent } from "apps/lending/components/transactions/Repay/RepayModalContent";

const RepayModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
    currentRateMode: InterestRate;
    isFrozen: boolean;
  }>;

  const handleClose = () => {
    close();
  };

  return (
    <BasicModal open={type === ModalType.Repay} setOpen={handleClose}>
      <ModalWrapper
        title={<>Repay</>}
        underlyingAsset={args.underlyingAsset}
        requiredPermission={PERMISSION.BORROWER}
      >
        {(params) => {
          return (
            <>
              <RepayModalContent {...params} debtType={args.currentRateMode} />
            </>
          );
        }}
      </ModalWrapper>
    </BasicModal>
  );
};

export default RepayModal;
