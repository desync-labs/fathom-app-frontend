import { MaxUint256 } from "@into-the-fathom/constants";
import { TransactionResponse } from "@into-the-fathom/providers";
import {
  Trade,
  TokenAmount,
  CurrencyAmount,
  XDC,
  ChainId,
} from "into-the-fathom-swap-sdk";
import { useCallback, useMemo, useState } from "react";
import { ROUTER_ADDRESSES } from "apps/dex/constants";
import { useTokenAllowance } from "apps/dex/data/Allowances";
import { Field } from "apps/dex/state/swap/actions";
import { useTransactionAdder } from "apps/dex/state/transactions/hooks";
import { computeSlippageAdjustedAmounts } from "apps/dex/utils/prices";
import { calculateGasMargin } from "apps/dex/utils";
import { useTokenContract } from "apps/dex/hooks/useContract";
import { useActiveWeb3React } from "apps/dex/hooks";

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React();
  const token =
    amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined;
  const currentAllowance = useTokenAllowance(
    token,
    account ?? undefined,
    spender
  );
  const [pendingApproval, setPendingApproval] = useState<boolean>(false);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
    // In case if we have native token (amount)
    if (amountToApprove.currency === XDC) return ApprovalState.APPROVED;
    // we might not have enough data to know whether we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, pendingApproval, spender]);

  const tokenContract = useTokenContract(token?.address);
  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error("approve was called unnecessarily");
      return;
    }
    if (!token) {
      console.error("no token");
      return;
    }

    if (!tokenContract) {
      console.error("tokenContract is null");
      return;
    }

    if (!amountToApprove) {
      console.error("missing amount to approve");
      return;
    }

    if (!spender) {
      console.error("no spender");
      return;
    }
    setPendingApproval(true);

    let useExact = false;
    const estimatedGas = await tokenContract.estimateGas
      .approve(spender, MaxUint256)
      .catch(() => {
        // general fallback for tokens who restrict approval amounts
        useExact = true;
        return tokenContract.estimateGas.approve(
          spender,
          amountToApprove.raw.toString()
        );
      });

    return tokenContract
      .approve(
        spender,
        useExact ? amountToApprove.raw.toString() : MaxUint256,
        {
          gasLimit: calculateGasMargin(estimatedGas),
        }
      )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: "Approve " + amountToApprove.currency.symbol,
          approval: { tokenAddress: token.address, spender: spender },
        });
        response.wait().then(() => {
          setPendingApproval(false);
        });
      })
      .catch((error: Error) => {
        setPendingApproval(false);
        console.debug("Failed to approve token", error);
        throw error;
      });
  }, [
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    addTransaction,
  ]);

  return [approvalState, approve];
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(
  trade?: Trade,
  allowedSlippage = 0
) {
  const { chainId } = useActiveWeb3React();
  const amountToApprove = useMemo(
    () =>
      trade
        ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT]
        : undefined,
    [trade, allowedSlippage]
  );
  return useApproveCallback(
    amountToApprove,
    ROUTER_ADDRESSES[chainId as ChainId]
  );
}
