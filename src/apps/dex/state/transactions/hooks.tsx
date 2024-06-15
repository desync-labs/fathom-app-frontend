import {
  TransactionReceipt,
  TransactionResponse,
} from "@into-the-fathom/providers";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useActiveWeb3React } from "apps/dex/hooks";
import { AppDispatch, AppState } from "apps/dex/state";
import { addTransaction } from "apps/dex/state/transactions/actions";
import { TransactionDetails } from "apps/dex/state/transactions/reducer";
import useSyncContext from "context/sync";

// helper that can take a fathom-ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse,
  customData?: {
    summary?: string;
    approval?: { tokenAddress: string; spender: string };
    claim?: { recipient: string };
  }
) => void {
  const { chainId, account } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const { setLastTransactionBlock } = useSyncContext();

  return useCallback(
    async (
      response: TransactionResponse,
      {
        summary,
        approval,
        claim,
      }: {
        summary?: string;
        claim?: { recipient: string };
        approval?: { tokenAddress: string; spender: string };
      } = {}
    ) => {
      if (!account) return;
      if (!chainId) return;

      const { hash } = response;
      if (!hash) {
        throw Error("No transaction hash found.");
      }

      dispatch(
        addTransaction({
          hash,
          from: account,
          chainId,
          approval,
          summary,
          claim,
        })
      );

      if (response.wait) {
        response.wait().then((receipt: TransactionReceipt) => {
          setLastTransactionBlock(receipt.blockNumber);
        });
      }
    },
    [dispatch, chainId, account]
  );
}

// returns all the transactions for the current chain
export function useAllTransactions(): {
  [txHash: string]: TransactionDetails;
} {
  const { chainId } = useActiveWeb3React();

  const state = useSelector<AppState, AppState["transactions"]>(
    (state) => state.transactions
  );

  return chainId ? state[chainId] ?? {} : {};
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency.
 * @param days - days for retrieve transactions.
 */
export function isTransactionRecent(tx: TransactionDetails, days = 1): boolean {
  return new Date().getTime() - tx.addedTime < days * 86_400_000;
}
