import { PERMISSION } from "@into-the-fathom/lending-contract-helpers";
import { useState } from "react";
import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { WithdrawModalContent } from "apps/lending/components/transactions/Withdraw//WithdrawModalContent";

const WithdrawModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;
  const [withdrawUnWrapped, setWithdrawUnWrapped] = useState(true);

  const handleClose = () => {
    close();
  };

  return (
    <BasicModal open={type === ModalType.Withdraw} setOpen={handleClose}>
      <ModalWrapper
        title={<>Withdraw</>}
        underlyingAsset={args.underlyingAsset}
        keepWrappedSymbol={!withdrawUnWrapped}
        requiredPermission={PERMISSION.DEPOSITOR}
      >
        {(params) => (
          <>
            <WithdrawModalContent
              {...params}
              unwrap={withdrawUnWrapped}
              setUnwrap={setWithdrawUnWrapped}
            />
          </>
        )}
      </ModalWrapper>
    </BasicModal>
  );
};

export default WithdrawModal;
