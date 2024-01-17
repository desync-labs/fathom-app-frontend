import { InterestRate } from "@into-the-fathom/lending-contract-helpers";
import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";

import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { DebtSwitchModalContent } from "apps/lending/components/transactions/DebtSwitch/DebtSwitchModalContent";

const DebtSwitchModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
    currentRateMode: InterestRate;
  }>;
  return (
    <BasicModal open={type === ModalType.DebtSwitch} setOpen={close}>
      <ModalWrapper
        title={<>Switch borrow position</>}
        underlyingAsset={args.underlyingAsset}
        hideTitleSymbol
      >
        {(params) => (
          <DebtSwitchModalContent
            {...params}
            currentRateMode={args.currentRateMode}
          />
        )}
      </ModalWrapper>
    </BasicModal>
  );
};

export default DebtSwitchModal;
