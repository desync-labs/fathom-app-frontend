import { useEffect, useState } from "react";
import { useRootStore } from "apps/lending/store/root";
import { selectSuccessfulTransactions } from "apps/lending/store/transactionsSelectors";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

export const TransactionEventHandler = () => {
  const [postedTransactions, setPostedTransactions] = useState<{
    [chainId: string]: string[];
  }>({});

  const trackEvent = useRootStore((store) => store.trackEvent);
  const successfulTransactions = useRootStore(selectSuccessfulTransactions);

  useEffect(() => {
    Object.keys(successfulTransactions).forEach((chainId) => {
      const chainIdNumber = +chainId;
      Object.keys(successfulTransactions[chainIdNumber]).forEach((txHash) => {
        if (!postedTransactions[chainIdNumber]?.includes(txHash)) {
          const tx = successfulTransactions[chainIdNumber][txHash];

          trackEvent(GENERAL.TRANSACTION, {
            transactionType: tx.action,
            tokenAmount: tx.amount,
            assetName: tx.assetName,
            asset: tx.asset,
            market: tx.market,
            txHash: txHash,
            proposalId: tx.proposalId,
            support: tx.support,
            previousState: tx.previousState,
            newState: tx.newState,
            outAsset: tx.outAsset,
            outAmount: tx.outAmount,
            outAssetName: tx.outAssetName,
          });

          // update local state
          if (postedTransactions[chainIdNumber]) {
            setPostedTransactions((prev) => ({
              ...prev,
              [chainIdNumber]: [...prev[chainIdNumber], txHash],
            }));
          } else {
            setPostedTransactions((prev) => ({
              ...prev,
              [+chainId]: [txHash],
            }));
          }
        }
      });
    });
  }, [trackEvent, postedTransactions, successfulTransactions]);

  return null;
};
