import {
  InterestRate,
  ProtocolAction,
} from "@into-the-fathom/lending-contract-helpers";
import { useTransactionHandler } from "apps/lending/helpers/useTransactionHandler";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useRootStore } from "apps/lending/store/root";

import { TxActionsWrapper } from "apps/lending/components/transactions/TxActionsWrapper";
import { FC } from "react";

export type RateSwitchActionsProps = {
  poolReserve: ComputedReserveData;
  isWrongNetwork: boolean;
  currentRateMode: InterestRate;
  blocked: boolean;
};

export const RateSwitchActions: FC<RateSwitchActionsProps> = ({
  poolReserve,
  isWrongNetwork,
  currentRateMode,
  blocked,
}) => {
  const swapBorrowRateMode = useRootStore((state) => state.swapBorrowRateMode);

  const { action, loadingTxns, mainTxState, requiresApproval } =
    useTransactionHandler({
      tryPermit: false,
      handleGetTxns: async () => {
        return await swapBorrowRateMode({
          reserve: poolReserve.underlyingAsset,
          interestRateMode: currentRateMode,
        });
      },
      protocolAction: ProtocolAction.switchBorrowRateMode,
      eventTxInfo: {
        asset: poolReserve.underlyingAsset,
        assetName: poolReserve.name,
        previousState: currentRateMode,
        newState:
          currentRateMode === InterestRate.Variable
            ? InterestRate.Stable
            : InterestRate.Variable,
      },
      skip: blocked,
    });

  return (
    <TxActionsWrapper
      requiresApproval={requiresApproval}
      blocked={blocked}
      preparingTransactions={loadingTxns}
      mainTxState={mainTxState}
      isWrongNetwork={isWrongNetwork}
      actionText={"Switch rate"}
      actionInProgressText={"Switching rate"}
      handleAction={action}
    />
  );
};
