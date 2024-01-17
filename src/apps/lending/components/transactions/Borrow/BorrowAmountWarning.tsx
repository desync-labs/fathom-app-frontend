import { Box, Checkbox, Typography } from "@mui/material";
import { Warning } from "apps/lending/components/primitives/Warning";
import { useRootStore } from "apps/lending/store/root";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";
import { FC } from "react";

interface BorrowAmountWarningProps {
  riskCheckboxAccepted: boolean;
  onRiskCheckboxChange: () => void;
}

export const BorrowAmountWarning: FC<BorrowAmountWarningProps> = ({
  riskCheckboxAccepted,
  onRiskCheckboxChange,
}) => {
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <>
      <Warning severity="error" sx={{ my: 6 }}>
        Borrowing this amount will reduce your health factor and increase risk
        of liquidation.
      </Warning>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          mx: "24px",
          mb: "12px",
        }}
      >
        <Checkbox
          checked={riskCheckboxAccepted}
          onChange={(event) => {
            trackEvent(GENERAL.ACCEPT_RISK, {
              modal: "Borrow",
              riskCheckboxAccepted: event.target.checked,
            });

            onRiskCheckboxChange();
          }}
          size="small"
          data-cy={"risk-checkbox"}
        />
        <Typography variant="description">
          I acknowledge the risks involved.
        </Typography>
      </Box>
    </>
  );
};
