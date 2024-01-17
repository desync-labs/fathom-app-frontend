import { PERMISSION } from "@into-the-fathom/lending-contract-helpers";
import { useState } from "react";
import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";
import { useRootStore } from "apps/lending/store/root";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { BorrowModalContent } from "apps/lending/components/transactions/Borrow/BorrowModalContent";

const BorrowModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;

  const [borrowUnWrapped, setBorrowUnWrapped] = useState(true);
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleBorrowUnwrapped = (borrowUnWrapped: boolean) => {
    trackEvent(GENERAL.OPEN_MODAL, {
      modal: "Unwrap Asset",
      asset: args.underlyingAsset,
      assetWrapped: borrowUnWrapped,
    });
    setBorrowUnWrapped(borrowUnWrapped);
  };

  return (
    <BasicModal open={type === ModalType.Borrow} setOpen={close}>
      <ModalWrapper
        action="borrow"
        title={<>Borrow</>}
        underlyingAsset={args.underlyingAsset}
        keepWrappedSymbol={!borrowUnWrapped}
        requiredPermission={PERMISSION.BORROWER}
      >
        {(params) => (
          <BorrowModalContent
            {...params}
            unwrap={borrowUnWrapped}
            setUnwrap={handleBorrowUnwrapped}
          />
        )}
      </ModalWrapper>
    </BasicModal>
  );
};

export default BorrowModal;
