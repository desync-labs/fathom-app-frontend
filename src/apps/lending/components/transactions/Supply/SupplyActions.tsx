import {
  ApproveType,
  gasLimitRecommendations,
  MAX_UINT_AMOUNT,
  ProtocolAction,
} from "@into-the-fathom/lending-contract-helpers";
import { SignatureLike } from "@into-the-fathom/bytes";
import { TransactionResponse } from "@into-the-fathom/providers";
import { BoxProps } from "@mui/material";
import { parseUnits } from "fathom-ethers/lib/utils";
import { queryClient } from "apps/lending";
import React, { FC, useCallback, useEffect, useState } from "react";
import { MOCK_SIGNED_HASH } from "apps/lending/helpers/useTransactionHandler";
import { useBackgroundDataProvider } from "apps/lending/hooks/app-data-provider/BackgroundDataProvider";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { useRootStore } from "apps/lending/store/root";
import { ApprovalMethod } from "apps/lending/store/walletSlice";
import {
  getErrorTextFromError,
  TxAction,
} from "apps/lending/ui-config/errorMapping";
import { QueryKeys } from "apps/lending/ui-config/queries";

import { TxActionsWrapper } from "apps/lending/components/transactions/TxActionsWrapper";
import {
  APPROVAL_GAS_LIMIT,
  checkRequiresApproval,
} from "apps/lending/components/transactions/utils";

export interface SupplyActionProps extends BoxProps {
  amountToSupply: string;
  isWrongNetwork: boolean;
  customGasPrice?: string;
  poolAddress: string;
  symbol: string;
  blocked: boolean;
  decimals: number;
  isWrappedBaseAsset: boolean;
}

interface SignedParams {
  signature: SignatureLike;
  deadline: string;
  amount: string;
}

export const SupplyActions: FC<SupplyActionProps> = React.memo(
  ({
    amountToSupply,
    poolAddress,
    isWrongNetwork,
    sx,
    symbol,
    blocked,
    decimals,
    isWrappedBaseAsset,
    ...props
  }) => {
    const [
      tryPermit,
      supply,
      supplyWithPermit,
      getApprovedAmount,
      generateSignatureRequest,
      generateApproval,
      walletApprovalMethodPreference,
      estimateGasLimit,
      addTransaction,
    ] = useRootStore((state) => [
      state.tryPermit,
      state.supply,
      state.supplyWithPermit,
      state.getApprovedAmount,
      state.generateSignatureRequest,
      state.generateApproval,
      state.walletApprovalMethodPreference,
      state.estimateGasLimit,
      state.addTransaction,
    ]);
    const {
      approvalTxState,
      mainTxState,
      loadingTxns,
      setLoadingTxns,
      setApprovalTxState,
      setMainTxState,
      setGasLimit,
      setTxError,
    } = useModalContext();
    const { refetchPoolData, refetchIncentiveData } =
      useBackgroundDataProvider();
    const { signTxData, sendTx } = useWeb3Context();

    const [usePermit, setUsePermit] = useState(false);
    const [approvedAmount, setApprovedAmount] = useState<
      ApproveType | undefined
    >();
    const [requiresApproval, setRequiresApproval] = useState<boolean>(false);
    const [signatureParams, setSignatureParams] = useState<
      SignedParams | undefined
    >();
    const permitAvailable = tryPermit({
      reserveAddress: poolAddress,
      isWrappedBaseAsset,
    });

    // callback to fetch approved amount and determine execution path on dependency updates
    const fetchApprovedAmount = useCallback(
      async (forceApprovalCheck?: boolean) => {
        // Check approved amount on-chain on first load or if an action triggers a re-check such as an approval being confirmed
        if (!approvedAmount || forceApprovalCheck) {
          setLoadingTxns(true);
          const approvedAmount = await getApprovedAmount({
            token: poolAddress,
          });
          setApprovedAmount(approvedAmount);
        }

        if (approvedAmount) {
          const fetchedRequiresApproval = checkRequiresApproval({
            approvedAmount: approvedAmount.amount,
            amount: amountToSupply,
            signedAmount: signatureParams ? signatureParams.amount : "0",
          });
          setRequiresApproval(fetchedRequiresApproval);
          if (fetchedRequiresApproval) setApprovalTxState({});
        }

        setLoadingTxns(false);
      },
      [
        approvedAmount,
        setLoadingTxns,
        getApprovedAmount,
        poolAddress,
        amountToSupply,
        signatureParams,
        setApprovalTxState,
      ]
    );

    // Run on first load to decide execution path
    useEffect(() => {
      fetchApprovedAmount();
    }, [fetchApprovedAmount]);

    // Update gas estimation
    useEffect(() => {
      let supplyGasLimit = 0;
      if (usePermit) {
        supplyGasLimit = Number(
          gasLimitRecommendations[ProtocolAction.supplyWithPermit].recommended
        );
      } else {
        supplyGasLimit = Number(
          gasLimitRecommendations[ProtocolAction.supply].recommended
        );
        if (requiresApproval && !approvalTxState.success) {
          supplyGasLimit += Number(APPROVAL_GAS_LIMIT);
        }
      }
      setGasLimit(supplyGasLimit.toString());
    }, [requiresApproval, approvalTxState, usePermit, setGasLimit]);

    useEffect(() => {
      const preferPermit =
        permitAvailable &&
        walletApprovalMethodPreference === ApprovalMethod.PERMIT;
      setUsePermit(preferPermit);
    }, [permitAvailable, walletApprovalMethodPreference]);

    const approval = async () => {
      try {
        if (requiresApproval && approvedAmount) {
          if (usePermit) {
            const deadline = Math.floor(Date.now() / 1000 + 3600).toString();
            const signatureRequest = await generateSignatureRequest({
              ...approvedAmount,
              deadline,
              amount: parseUnits(amountToSupply, decimals).toString(),
            });

            const response = await signTxData(signatureRequest);
            setSignatureParams({
              signature: response,
              deadline,
              amount: amountToSupply,
            });
            setApprovalTxState({
              txHash: MOCK_SIGNED_HASH,
              loading: false,
              success: true,
            });
          } else {
            let approveTxData = generateApproval(approvedAmount);
            setApprovalTxState({ ...approvalTxState, loading: true });
            approveTxData = await estimateGasLimit(approveTxData);
            const response = await sendTx(approveTxData);
            await response.wait(1);
            setApprovalTxState({
              txHash: response.hash,
              loading: false,
              success: true,
            });
            addTransaction(response.hash, {
              action: ProtocolAction.approval,
              txState: "success",
              asset: poolAddress,
              amount: MAX_UINT_AMOUNT,
              assetName: symbol,
            });
            fetchApprovedAmount(true);
          }
        }
      } catch (error: any) {
        const parsedError = getErrorTextFromError(
          error,
          TxAction.GAS_ESTIMATION,
          false
        );
        setTxError(parsedError);
        setApprovalTxState({
          txHash: "",
          loading: false,
        });
      }
    };

    const action = async () => {
      try {
        setMainTxState({ ...mainTxState, loading: true });

        let response: TransactionResponse;
        let action = ProtocolAction.default;

        // determine if approval is signature or transaction
        // checking user preference is not sufficient because permit may be available but the user has an existing approval
        if (usePermit && signatureParams) {
          action = ProtocolAction.supplyWithPermit;
          let signedSupplyWithPermitTxData = supplyWithPermit({
            signature: signatureParams.signature,
            amount: parseUnits(amountToSupply, decimals).toString(),
            reserve: poolAddress,
            deadline: signatureParams.deadline,
          });

          signedSupplyWithPermitTxData = await estimateGasLimit(
            signedSupplyWithPermitTxData
          );
          response = await sendTx(signedSupplyWithPermitTxData);

          await response.wait(1);
        } else {
          action = ProtocolAction.supply;
          let supplyTxData = supply({
            amount: parseUnits(amountToSupply, decimals).toString(),
            reserve: poolAddress,
          });
          supplyTxData = await estimateGasLimit(supplyTxData);
          response = await sendTx(supplyTxData);

          await response.wait(1);
        }

        setMainTxState({
          txHash: response.hash,
          loading: false,
          success: true,
        });

        addTransaction(response.hash, {
          action,
          txState: "success",
          asset: poolAddress,
          amount: amountToSupply,
          assetName: symbol,
        });

        queryClient.invalidateQueries({ queryKey: [QueryKeys.POOL_TOKENS] });
        refetchPoolData && refetchPoolData();
        refetchIncentiveData && refetchIncentiveData();
      } catch (error: any) {
        const parsedError = getErrorTextFromError(
          error,
          TxAction.GAS_ESTIMATION,
          false
        );
        setTxError(parsedError);
        setMainTxState({
          txHash: undefined,
          loading: false,
        });
      }
    };

    return (
      <TxActionsWrapper
        blocked={blocked}
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isWrongNetwork={isWrongNetwork}
        requiresAmount
        amount={amountToSupply}
        symbol={symbol}
        preparingTransactions={loadingTxns}
        actionText={<>Supply {symbol}</>}
        actionInProgressText={<>Supplying {symbol}</>}
        handleApproval={() => approval()}
        handleAction={action}
        requiresApproval={requiresApproval}
        tryPermit={permitAvailable}
        sx={sx}
        {...props}
      />
    );
  }
);
