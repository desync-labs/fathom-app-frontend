import { useTransactionHandler } from "apps/lending/helpers/useTransactionHandler";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useRootStore } from "apps/lending/store/root";

import { TxActionsWrapper } from "apps/lending/components/transactions/TxActionsWrapper";
import { FC } from "react";

export type FaucetActionsProps = {
  poolReserve: ComputedReserveData;
  isWrongNetwork: boolean;
  blocked: boolean;
};

export const FaucetActions: FC<FaucetActionsProps> = ({
  poolReserve,
  isWrongNetwork,
  blocked,
}) => {
  const mint = useRootStore((state) => state.mint);

  const { action, loadingTxns, mainTxState, requiresApproval } =
    useTransactionHandler({
      tryPermit: false,
      handleGetTxns: async () => {
        return mint({
          tokenSymbol: poolReserve.symbol,
          reserve: poolReserve.underlyingAsset,
        });
      },
      skip: blocked,
    });

  return (
    <TxActionsWrapper
      requiresApproval={requiresApproval}
      blocked={blocked}
      preparingTransactions={loadingTxns}
      handleAction={action}
      actionText={<>Faucet {poolReserve.symbol}</>}
      actionInProgressText={<>Pending...</>}
      mainTxState={mainTxState}
      isWrongNetwork={isWrongNetwork}
    />
  );
};
