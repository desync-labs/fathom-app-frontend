import { Box, Typography } from "@mui/material";
import { StyledTxModalToggleButton } from "apps/lending/components/StyledToggleButton";
import { StyledTxModalToggleGroup } from "apps/lending/components/StyledToggleButtonGroup";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";
import { WITHDRAW_MODAL } from "apps/lending/utils/mixPanelEvents";
import { FC } from "react";

export enum WithdrawType {
  WITHDRAW,
  WITHDRAWSWITCH,
}
export const WithdrawTypeSelector: FC<{
  withdrawType: WithdrawType;
  setWithdrawType: (type: WithdrawType) => void;
}> = ({ withdrawType, setWithdrawType }) => {
  const { currentMarketData } = useProtocolDataContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  if (!currentMarketData.enabledFeatures?.collateralRepay) return null;
  return (
    <Box sx={{ mb: 6 }}>
      <StyledTxModalToggleGroup
        color="primary"
        value={withdrawType}
        exclusive
        onChange={(_, value) => setWithdrawType(value)}
      >
        <StyledTxModalToggleButton
          value={WithdrawType.WITHDRAW}
          disabled={withdrawType === WithdrawType.WITHDRAW}
          onClick={() =>
            trackEvent(WITHDRAW_MODAL.SWITCH_WITHDRAW_TYPE, {
              withdrawType: "Withdraw",
            })
          }
        >
          <Typography variant="buttonM">Withdraw</Typography>
        </StyledTxModalToggleButton>

        <StyledTxModalToggleButton
          value={WithdrawType.WITHDRAWSWITCH}
          disabled={withdrawType === WithdrawType.WITHDRAWSWITCH}
          onClick={() =>
            trackEvent(WITHDRAW_MODAL.SWITCH_WITHDRAW_TYPE, {
              withdrawType: "Withdraw and Switch",
            })
          }
        >
          <Typography variant="buttonM">Withdraw & Switch</Typography>
        </StyledTxModalToggleButton>
      </StyledTxModalToggleGroup>
    </Box>
  );
};
