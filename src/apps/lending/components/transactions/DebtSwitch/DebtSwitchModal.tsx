import { InterestRate } from "@aave/contract-helpers";
import { Trans } from "@lingui/macro";
import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";

import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { DebtSwitchModalContent } from "./DebtSwitchModalContent";

const DebtSwitchModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
    currentRateMode: InterestRate;
  }>;
  return (
    <BasicModal open={type === ModalType.DebtSwitch} setOpen={close}>
      <ModalWrapper
        title={<Trans>Switch borrow position</Trans>}
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
