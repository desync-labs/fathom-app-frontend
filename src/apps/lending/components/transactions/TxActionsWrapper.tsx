import {
  Box,
  BoxProps,
  Button,
  CircularProgress,
  SvgIcon,
} from "@mui/material";
import { FC, ReactNode, memo } from "react";
import { TxStateType, useModalContext } from "apps/lending/hooks/useModal";
import { TrackEventProps } from "apps/lending/store/analyticsSlice";
import { TxAction } from "apps/lending/ui-config/errorMapping";

import { ApprovalTooltip } from "apps/lending/components/infoTooltips/ApprovalTooltip";
import { RightHelperText } from "apps/lending/components/transactions/FlowCommons/RightHelperText";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

interface TxActionsWrapperProps extends BoxProps {
  actionInProgressText: ReactNode;
  actionText: ReactNode;
  amount?: string;
  approvalTxState?: TxStateType;
  handleApproval?: () => Promise<void>;
  handleAction: () => Promise<void>;
  isWrongNetwork: boolean;
  mainTxState: TxStateType;
  preparingTransactions: boolean;
  requiresAmount?: boolean;
  requiresApproval: boolean;
  symbol?: string;
  blocked?: boolean;
  fetchingData?: boolean;
  errorParams?: {
    loading: boolean;
    disabled: boolean;
    content: ReactNode;
    handleClick: () => Promise<void>;
  };
  tryPermit?: boolean;
  event?: TrackEventProps;
}

export const TxActionsWrapper: FC<TxActionsWrapperProps> = memo(
  ({
    actionInProgressText,
    actionText,
    amount,
    approvalTxState,
    handleApproval,
    handleAction,
    isWrongNetwork,
    mainTxState,
    preparingTransactions,
    requiresAmount,
    requiresApproval,
    sx,
    blocked,
    fetchingData = false,
    errorParams,
    tryPermit,
    ...rest
  }) => {
    const { txError } = useModalContext();
    const hasApprovalError =
      requiresApproval &&
      txError?.txAction === TxAction.APPROVAL &&
      txError?.actionBlocked;
    const isAmountMissing =
      requiresAmount && requiresAmount && Number(amount) === 0;

    function getMainParams() {
      if (blocked) return { disabled: true, content: actionText };
      if (
        (txError?.txAction === TxAction.GAS_ESTIMATION ||
          txError?.txAction === TxAction.MAIN_ACTION) &&
        txError?.actionBlocked
      ) {
        if (errorParams) return errorParams;
        return { loading: false, disabled: true, content: actionText };
      }
      if (isWrongNetwork) return { disabled: true, content: "Wrong Network" };
      if (fetchingData) return { disabled: true, content: "Fetching data..." };
      if (isAmountMissing)
        return { disabled: true, content: "Enter an amount" };
      if (preparingTransactions) return { disabled: true, loading: true };
      // if (hasApprovalError && handleRetry)
      //   return { content:Retry with approval, handleClick: handleRetry };
      if (mainTxState?.loading)
        return { loading: true, disabled: true, content: actionInProgressText };
      if (requiresApproval && !approvalTxState?.success)
        return { disabled: true, content: actionText };
      return { content: actionText, handleClick: handleAction };
    }

    function getApprovalParams() {
      if (
        !requiresApproval ||
        isWrongNetwork ||
        isAmountMissing ||
        preparingTransactions ||
        hasApprovalError
      )
        return null;
      if (approvalTxState?.loading)
        return {
          loading: true,
          disabled: true,
          content: <>Approving...</>,
        };
      if (approvalTxState?.success)
        return {
          disabled: true,
          content: (
            <>
              Approve Confirmed
              <SvgIcon sx={{ fontSize: 20, ml: 2 }}>
                <CheckRoundedIcon />
              </SvgIcon>
            </>
          ),
        };

      return {
        content: (
          <ApprovalTooltip
            iconSize={20}
            iconMargin={2}
            color="white"
            text={`Approve to continue`}
          />
        ),
        handleClick: handleApproval,
      };
    }

    const { content, disabled, loading, handleClick } = getMainParams();
    const approvalParams = getApprovalParams();
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", mt: 5, ...sx }}
        className="TxActionsWrapper"
        {...rest}
      >
        {requiresApproval && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <RightHelperText
              approvalHash={approvalTxState?.txHash}
              tryPermit={tryPermit}
            />
          </Box>
        )}

        {approvalParams && (
          <Button
            variant="gradient"
            disabled={approvalParams.disabled || blocked}
            onClick={() =>
              approvalParams.handleClick && approvalParams.handleClick()
            }
            size="large"
            sx={{ minHeight: "44px" }}
            data-cy="approvalButton"
          >
            {approvalParams.loading && (
              <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
            )}
            {approvalParams.content}
          </Button>
        )}

        <Button
          variant="gradient"
          disabled={disabled || blocked}
          onClick={handleClick}
          size="large"
          sx={{ minHeight: "44px", ...(approvalParams ? { mt: 1 } : {}) }}
          data-cy="actionButton"
        >
          {loading && (
            <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
          )}
          {content}
        </Button>
      </Box>
    );
  }
);
