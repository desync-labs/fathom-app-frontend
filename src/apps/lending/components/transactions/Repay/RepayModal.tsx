import {
  InterestRate,
  PERMISSION,
} from "@into-the-fathom/lending-contract-helpers";
import { useState } from "react";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { isFeatureEnabled } from "apps/lending/utils/marketsAndNetworksConfig";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { CollateralRepayModalContent } from "./CollateralRepayModalContent";
import { RepayModalContent } from "apps/lending/components/transactions/Repay/RepayModalContent";
import {
  RepayType,
  RepayTypeSelector,
} from "apps/lending/components/transactions/Repay/RepayTypeSelector";

const RepayModal = () => {
  const { type, close, args, mainTxState } =
    useModalContext() as ModalContextType<{
      underlyingAsset: string;
      currentRateMode: InterestRate;
      isFrozen: boolean;
    }>;
  const { userReserves, reserves } = useAppDataContext();
  const { currentMarketData } = useProtocolDataContext();
  const [repayType, setRepayType] = useState(RepayType.BALANCE);

  const stETHAddress = reserves.find(
    (reserve) => reserve.symbol === "stETH"
  )?.underlyingAsset;

  const collateralRepayPossible =
    isFeatureEnabled.collateralRepay(currentMarketData) &&
    userReserves.some(
      (userReserve) =>
        userReserve.scaledFmTokenBalance !== "0" &&
        userReserve.underlyingAsset !== args.underlyingAsset &&
        userReserve.underlyingAsset !== stETHAddress
    );

  const handleClose = () => {
    setRepayType(RepayType.BALANCE);
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
              {collateralRepayPossible && !mainTxState.txHash && (
                <RepayTypeSelector
                  repayType={repayType}
                  setRepayType={setRepayType}
                />
              )}
              {repayType === RepayType.BALANCE && (
                <RepayModalContent
                  {...params}
                  debtType={args.currentRateMode}
                />
              )}
              {repayType === RepayType.COLLATERAL && (
                <CollateralRepayModalContent
                  {...params}
                  debtType={args.currentRateMode}
                />
              )}
            </>
          );
        }}
      </ModalWrapper>
    </BasicModal>
  );
};

export default RepayModal;
