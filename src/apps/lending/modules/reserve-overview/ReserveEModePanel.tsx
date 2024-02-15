import { Box, Typography } from "@mui/material";
import { LiquidationPenaltyTooltip } from "apps/lending/components/infoTooltips/LiquidationPenaltyTooltip";
import { LiquidationThresholdTooltip } from "apps/lending/components/infoTooltips/LiquidationThresholdTooltip";
import { MaxLTVTooltip } from "apps/lending/components/infoTooltips/MaxLTVTooltip";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { ReserveOverviewBox } from "apps/lending/components/ReserveOverviewBox";
import { getEmodeMessage } from "apps/lending/components/transactions/Emode/EmodeNaming";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useRootStore } from "apps/lending/store/root";
import { RESERVE_DETAILS } from "apps/lending/utils/mixPanelEvents";

import {
  PanelRow,
  PanelTitle,
} from "apps/lending/modules/reserve-overview/ReservePanels";
import { FC, memo } from "react";

type ReserverEModePanelProps = {
  reserve: ComputedReserveData;
};

export const ReserveEModePanel: FC<ReserverEModePanelProps> = memo(
  ({ reserve }) => {
    const trackEvent = useRootStore((store) => store.trackEvent);

    return (
      <PanelRow>
        <PanelTitle>E-Mode info</PanelTitle>
        <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: "100%", width: "100%" }}>
          <Box
            sx={{ display: "inline-flex", alignItems: "center", gap: "7px" }}
          >
            <Typography variant="secondary14" color="text.secondary">
              E-Mode Category
            </Typography>
            <Typography variant="subheader1">
              {getEmodeMessage(reserve.eModeLabel)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              pt: "12px",
            }}
          >
            <ReserveOverviewBox
              title={<MaxLTVTooltip variant="description" text={"Max LTV"} />}
            >
              <FormattedNumber
                value={reserve.formattedEModeLtv}
                percent
                variant="secondary14"
                visibleDecimals={2}
              />
            </ReserveOverviewBox>
            <ReserveOverviewBox
              title={
                <LiquidationThresholdTooltip
                  variant="description"
                  text={"Liquidation threshold"}
                />
              }
            >
              <FormattedNumber
                value={reserve.formattedEModeLiquidationThreshold}
                percent
                variant="secondary14"
                visibleDecimals={2}
              />
            </ReserveOverviewBox>
            <ReserveOverviewBox
              title={
                <LiquidationPenaltyTooltip
                  variant="description"
                  text={"Liquidation penalty"}
                />
              }
            >
              <FormattedNumber
                value={reserve.formattedEModeLiquidationBonus}
                percent
                variant="secondary14"
                visibleDecimals={2}
              />
            </ReserveOverviewBox>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            paddingTop="24px"
          >
            E-Mode increases your LTV for a selected category of assets, meaning
            that when E-mode is enabled, you will have higher borrowing power
            over assets of the same E-mode category. You can enter E-Mode from
            your{" "}
            <Link
              href={ROUTES.dashboard}
              sx={{ textDecoration: "underline" }}
              variant="caption"
              color="text.secondary"
              onClick={() => {
                trackEvent(RESERVE_DETAILS.GO_DASHBOARD_EMODE);
              }}
            >
              Dashboard
            </Link>
            .
          </Typography>
        </Box>
      </PanelRow>
    );
  }
);
