import { valueToBigNumber } from "@into-the-fathom/lending-math-utils";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { NetAPYTooltip } from "apps/lending/components/infoTooltips/NetAPYTooltip";
import { PageTitle } from "apps/lending/components/TopInfoPanel/PageTitle";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { useRootStore } from "apps/lending/store/root";
import { DASHBOARD, GENERAL } from "apps/lending/utils/mixPanelEvents";
import { lendingContainerProps } from "apps/lending/components/ContentContainer";

import HALLink from "apps/lending/components/HALLink";
import { HealthFactorNumber } from "apps/lending/components/HealthFactorNumber";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { NoData } from "apps/lending/components/primitives/NoData";
import { TopInfoPanel } from "apps/lending/components/TopInfoPanel/TopInfoPanel";
import { TopInfoPanelItem } from "apps/lending/components/TopInfoPanel/TopInfoPanelItem";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { LiquidationRiskParametersInfoModal } from "apps/lending/modules/dashboard/LiquidationRiskParametresModal/LiquidationRiskParametresModal";

export const DashboardTopPanel = () => {
  const { currentNetworkConfig, currentMarketData } = useProtocolDataContext();
  const { user, loading } = useAppDataContext();
  const { currentAccount } = useWeb3Context();
  const [open, setOpen] = useState(false);
  const trackEvent = useRootStore((store) => store.trackEvent);
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down("sm"));

  const loanToValue =
    user?.totalCollateralMarketReferenceCurrency === "0"
      ? "0"
      : valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || "0")
          .dividedBy(user?.totalCollateralMarketReferenceCurrency || "1")
          .toFixed();

  const valueTypographyVariant = downToSM ? "main16" : "main21";
  const noDataTypographyVariant = downToSM ? "secondary16" : "secondary21";

  return (
    <>
      <TopInfoPanel
        titleComponent={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PageTitle
              pageTitle={"Dashboard"}
              withMarketSwitcher={true}
              bridge={currentNetworkConfig.bridge}
            />
          </Box>
        }
        containerProps={lendingContainerProps}
      >
        <TopInfoPanelItem title={"Net worth"} loading={loading} hideIcon>
          {currentAccount ? (
            <FormattedNumber
              value={Number(user?.netWorthUSD || 0)}
              symbol="USD"
              variant={valueTypographyVariant}
              visibleDecimals={2}
              compact
              symbolsVariant={noDataTypographyVariant}
            />
          ) : (
            <NoData variant={noDataTypographyVariant} sx={{ opacity: "0.7" }} />
          )}
        </TopInfoPanelItem>

        <TopInfoPanelItem
          title={
            <div style={{ display: "flex" }}>
              Net APY
              <NetAPYTooltip
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: { tooltip: "NET APY: Dashboard Banner" },
                }}
              />
            </div>
          }
          loading={loading}
          hideIcon
        >
          {currentAccount && Number(user?.netWorthUSD) > 0 ? (
            <FormattedNumber
              value={user.netAPY}
              variant={valueTypographyVariant}
              visibleDecimals={2}
              percent
              symbolsVariant={noDataTypographyVariant}
            />
          ) : (
            <NoData variant={noDataTypographyVariant} sx={{ opacity: "0.7" }} />
          )}
        </TopInfoPanelItem>

        {currentAccount && user?.healthFactor !== "-1" && (
          <TopInfoPanelItem
            title={
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Health factor
              </Box>
            }
            loading={loading}
            hideIcon
          >
            <HealthFactorNumber
              value={user?.healthFactor || "-1"}
              variant={valueTypographyVariant}
              onInfoClick={() => {
                trackEvent(DASHBOARD.VIEW_RISK_DETAILS);
                setOpen(true);
              }}
              HALIntegrationComponent={
                currentMarketData.halIntegration && (
                  <HALLink
                    healthFactor={user?.healthFactor || "-1"}
                    marketName={currentMarketData.halIntegration.marketName}
                    integrationURL={currentMarketData.halIntegration.URL}
                  />
                )
              }
            />
          </TopInfoPanelItem>
        )}
      </TopInfoPanel>
      <LiquidationRiskParametersInfoModal
        open={open}
        setOpen={setOpen}
        healthFactor={user?.healthFactor || "-1"}
        loanToValue={loanToValue}
        currentLoanToValue={user?.currentLoanToValue || "0"}
        currentLiquidationThreshold={user?.currentLiquidationThreshold || "0"}
      />
    </>
  );
};
