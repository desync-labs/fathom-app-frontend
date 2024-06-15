import { PERMISSION } from "@into-the-fathom/lending-contract-helpers";
import { useState } from "react";
import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending//hooks/useProtocolDataContext";
import { isFeatureEnabled } from "apps/lending//utils/marketsAndNetworksConfig";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { WithdrawAndSwitchModalContent } from "./WithdrawAndSwitchModalContent";
import { WithdrawModalContent } from "./WithdrawModalContent";
import { WithdrawType, WithdrawTypeSelector } from "./WithdrawTypeSelector";

const WithdrawModal = () => {
  const { type, close, args, mainTxState } =
    useModalContext() as ModalContextType<{
      underlyingAsset: string;
    }>;
  const [withdrawUnWrapped, setWithdrawUnWrapped] = useState(true);
  const [withdrawType, setWithdrawType] = useState(WithdrawType.WITHDRAW);
  const { currentMarketData } = useProtocolDataContext();

  const isWithdrawAndSwapPossible =
    isFeatureEnabled.withdrawAndSwitch(currentMarketData);

  const handleClose = () => {
    setWithdrawType(WithdrawType.WITHDRAW);
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
            {isWithdrawAndSwapPossible && !mainTxState.txHash && (
              <WithdrawTypeSelector
                withdrawType={withdrawType}
                setWithdrawType={setWithdrawType}
              />
            )}
            {withdrawType === WithdrawType.WITHDRAW && (
              <WithdrawModalContent
                {...params}
                unwrap={withdrawUnWrapped}
                setUnwrap={setWithdrawUnWrapped}
              />
            )}
            {withdrawType === WithdrawType.WITHDRAWSWITCH && (
              <>
                <WithdrawAndSwitchModalContent {...params} />
              </>
            )}
          </>
        )}
      </ModalWrapper>
    </BasicModal>
  );
};

export default WithdrawModal;
