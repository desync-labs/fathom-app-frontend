import { InterestRate } from "@into-the-fathom/lending-contract-helpers";
import { valueToBigNumber } from "@into-the-fathom/lending-math-utils";
import { Warning } from "apps/lending/components/primitives/Warning";
import { useModalContext } from "apps/lending/hooks/useModal";

import { GasEstimationError } from "apps/lending/components/transactions/FlowCommons/GasEstimationError";
import { ModalWrapperProps } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { TxSuccessView } from "apps/lending/components/transactions/FlowCommons/Success";
import {
  DetailsIncentivesLine,
  DetailsNumberLine,
  TxModalDetails,
} from "apps/lending/components/transactions/FlowCommons/TxModalDetails";
import { RateSwitchActions } from "apps/lending/components/transactions/RateSwitch/RateSwitchActions";
import { FC, memo } from "react";

export enum ErrorType {
  NO_BORROWS_YET_USING_THIS_CURRENCY,
  YOU_CANT_BORROW_STABLE_NOW,
  STABLE_INTEREST_TYPE_IS_DISABLED,
}

export const RateSwitchModalContent: FC<
  ModalWrapperProps & { currentRateMode: InterestRate }
> = memo(({ currentRateMode, isWrongNetwork, poolReserve, userReserve }) => {
  const {
    mainTxState: rateSwitchTxState,
    gasLimit,
    txError,
  } = useModalContext();

  const rateModeAfterSwitch =
    InterestRate.Variable === currentRateMode
      ? InterestRate.Stable
      : InterestRate.Variable;

  const apyAfterSwitch =
    currentRateMode === InterestRate.Stable
      ? poolReserve.variableBorrowAPY
      : poolReserve.stableBorrowAPY;

  const currentBorrows = valueToBigNumber(
    currentRateMode === InterestRate.Stable
      ? userReserve.stableBorrows
      : userReserve.variableBorrows
  );

  // error handling
  let blockingError: ErrorType | undefined = undefined;
  if (currentBorrows.eq(0)) {
    blockingError = ErrorType.NO_BORROWS_YET_USING_THIS_CURRENCY;
  } else if (
    currentRateMode === InterestRate.Variable &&
    userReserve.usageAsCollateralEnabledOnUser &&
    poolReserve.reserveLiquidationThreshold !== "0" &&
    valueToBigNumber(userReserve.totalBorrows).lt(userReserve.underlyingBalance)
  ) {
    blockingError = ErrorType.YOU_CANT_BORROW_STABLE_NOW;
  } else if (
    InterestRate.Variable === currentRateMode &&
    !poolReserve.stableBorrowRateEnabled
  ) {
    blockingError = ErrorType.STABLE_INTEREST_TYPE_IS_DISABLED;
  }

  // error render handling
  const handleBlocked = () => {
    switch (blockingError) {
      case ErrorType.NO_BORROWS_YET_USING_THIS_CURRENCY:
        return <>You have not borrow yet using this currency</>;
      case ErrorType.STABLE_INTEREST_TYPE_IS_DISABLED:
        return <>Stable Interest Type is disabled for this currency</>;
      case ErrorType.YOU_CANT_BORROW_STABLE_NOW:
        return (
          <>
            You can not change Interest Type to stable as your borrowings are
            higher than your collateral
          </>
        );
      default:
        return null;
    }
  };

  if (rateSwitchTxState.success)
    return <TxSuccessView rate={rateModeAfterSwitch} />;

  return (
    <>
      {blockingError !== undefined && (
        <Warning severity="error" sx={{ mb: 0 }}>
          {handleBlocked()}
        </Warning>
      )}
      <TxModalDetails gasLimit={gasLimit}>
        <DetailsNumberLine
          description={"New APY"}
          value={apyAfterSwitch}
          numberPrefix={
            rateModeAfterSwitch === InterestRate.Stable ? "Stable" : "Variable"
          }
          percent
        />
        <DetailsIncentivesLine
          incentives={
            rateModeAfterSwitch === InterestRate.Variable
              ? poolReserve.vIncentivesData
              : poolReserve.sIncentivesData
          }
          symbol={poolReserve.symbol}
        />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <RateSwitchActions
        poolReserve={poolReserve}
        isWrongNetwork={isWrongNetwork}
        currentRateMode={currentRateMode}
        blocked={blockingError !== undefined}
      />
    </>
  );
});
