import { Box, Typography } from "@mui/material";
import { StyledTxModalToggleButton } from "apps/lending/components/StyledToggleButton";
import { StyledTxModalToggleGroup } from "apps/lending/components/StyledToggleButtonGroup";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";
import { REPAY_MODAL } from "apps/lending/utils/mixPanelEvents";

export enum RepayType {
  BALANCE,
  COLLATERAL,
}
export function RepayTypeSelector({
  repayType,
  setRepayType,
}: {
  repayType: RepayType;
  setRepayType: (type: RepayType) => void;
}) {
  const { currentMarketData } = useProtocolDataContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  if (!currentMarketData.enabledFeatures?.collateralRepay) return null;
  return (
    <Box sx={{ mb: 6 }}>
      <Typography mb={1} color="text.secondary">
        <>Repay with</>
      </Typography>

      <StyledTxModalToggleGroup
        color="primary"
        value={repayType}
        exclusive
        onChange={(_, value) => setRepayType(value)}
      >
        <StyledTxModalToggleButton
          value={RepayType.BALANCE}
          disabled={repayType === RepayType.BALANCE}
          onClick={() =>
            trackEvent(REPAY_MODAL.SWITCH_REPAY_TYPE, {
              repayType: "Wallet Balance",
            })
          }
        >
          <Typography variant="buttonM">
            <>Wallet balance</>
          </Typography>
        </StyledTxModalToggleButton>

        <StyledTxModalToggleButton
          value={RepayType.COLLATERAL}
          disabled={repayType === RepayType.COLLATERAL}
          onClick={() =>
            trackEvent(REPAY_MODAL.SWITCH_REPAY_TYPE, {
              repayType: "Collateral",
            })
          }
        >
          <Typography variant="buttonM">
            <>Collateral</>
          </Typography>
        </StyledTxModalToggleButton>
      </StyledTxModalToggleGroup>
    </Box>
  );
}
