import { InterestRate } from "@into-the-fathom/lending-contract-helpers";
import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { RateSwitchModalContent } from "apps/lending/components/transactions/RateSwitch/RateSwitchModalContent";

const RateSwitchModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
    currentRateMode: InterestRate;
  }>;

  return (
    <BasicModal open={type === ModalType.RateSwitch} setOpen={close}>
      <ModalWrapper
        hideTitleSymbol
        title={<>Switch APY type</>}
        underlyingAsset={args.underlyingAsset}
      >
        {(params) => (
          <RateSwitchModalContent
            {...params}
            currentRateMode={args.currentRateMode}
          />
        )}
      </ModalWrapper>
    </BasicModal>
  );
};

export default RateSwitchModal;
