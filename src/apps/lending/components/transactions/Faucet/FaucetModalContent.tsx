import {
  mintAmountsPerToken,
  valueToWei,
} from "@into-the-fathom/lending-contract-helpers";
import { normalize } from "@into-the-fathom/lending-math-utils";
import { useModalContext } from "apps/lending/hooks/useModal";

import { GasEstimationError } from "apps/lending/components/transactions/FlowCommons/GasEstimationError";
import { ModalWrapperProps } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { TxSuccessView } from "apps/lending/components/transactions/FlowCommons/Success";
import {
  DetailsNumberLine,
  TxModalDetails,
} from "apps/lending/components/transactions/FlowCommons/TxModalDetails";
import { FaucetActions } from "apps/lending/components/transactions/Faucet/FaucetActions";
import { FC, memo } from "react";

export const FaucetModalContent: FC<ModalWrapperProps> = memo(
  ({ poolReserve, isWrongNetwork }) => {
    const { gasLimit, mainTxState: faucetTxState, txError } = useModalContext();
    const defaultValue = valueToWei("1000", 18);
    const mintAmount = mintAmountsPerToken[poolReserve.symbol.toUpperCase()]
      ? mintAmountsPerToken[poolReserve.symbol.toUpperCase()]
      : defaultValue;
    const normalizedAmount = normalize(mintAmount, poolReserve.decimals);

    if (faucetTxState.success)
      return (
        <TxSuccessView
          action={"Received"}
          symbol={poolReserve.symbol}
          amount={normalizedAmount}
        />
      );

    return (
      <>
        <TxModalDetails gasLimit={gasLimit}>
          <DetailsNumberLine
            description={"Amount"}
            iconSymbol={poolReserve.symbol}
            symbol={poolReserve.symbol}
            value={normalizedAmount}
          />
        </TxModalDetails>

        {txError && <GasEstimationError txError={txError} />}

        <FaucetActions
          poolReserve={poolReserve}
          isWrongNetwork={isWrongNetwork}
          blocked={false}
        />
      </>
    );
  }
);
