import { ExternalLinkIcon } from "@heroicons/react/solid";
import { Box, Button, Divider, SvgIcon } from "@mui/material";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Link } from "apps/lending/components/primitives/Link";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { BROKEN_ASSETS } from "apps/lending/hooks/useReservesHistory";
import { useRootStore } from "apps/lending/store/root";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { BorrowInfo } from "apps/lending/modules/reserve-overview/BorrowInfo";
import { InterestRateModelGraphContainer } from "apps/lending/modules/reserve-overview/graphs/InterestRateModelGraphContainer";
import { ReserveEModePanel } from "apps/lending/modules/reserve-overview/ReserveEModePanel";
import {
  PanelItem,
  PanelRow,
  PanelTitle,
} from "apps/lending/modules/reserve-overview/ReservePanels";
import { SupplyInfo } from "apps/lending/modules/reserve-overview/SupplyInfo";
import { FC, memo } from "react";

type ReserveConfigurationProps = {
  reserve: ComputedReserveData;
};

const ReserveConfiguration: FC<ReserveConfigurationProps> = memo(
  ({ reserve }) => {
    const { currentNetworkConfig, currentMarketData } =
      useProtocolDataContext();
    const reserveId =
      reserve.underlyingAsset +
      currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER;
    const renderCharts =
      !!currentNetworkConfig.ratesHistoryApiUrl &&
      !currentMarketData.disableCharts &&
      !BROKEN_ASSETS.includes(reserveId);
    const { supplyCap, borrowCap, debtCeiling } = useAssetCaps();
    const showSupplyCapStatus: boolean = reserve.supplyCap !== "0";
    const showBorrowCapStatus: boolean = reserve.borrowCap !== "0";
    const trackEvent = useRootStore((store) => store.trackEvent);

    return (
      <>
        <PanelRow>
          <PanelTitle>Supply Info</PanelTitle>
          <SupplyInfo
            reserve={reserve}
            currentMarketData={currentMarketData}
            renderCharts={renderCharts}
            showSupplyCapStatus={showSupplyCapStatus}
            supplyCap={supplyCap}
            debtCeiling={debtCeiling}
          />
        </PanelRow>

        {(reserve.borrowingEnabled || Number(reserve.totalDebt) > 0) && (
          <>
            <Divider sx={{ my: { xs: 6, sm: 10 } }} />
            <PanelRow>
              <PanelTitle>Borrow info</PanelTitle>
              <Box
                sx={{
                  flexGrow: 1,
                  minWidth: 0,
                  maxWidth: "100%",
                  width: "100%",
                }}
              >
                <BorrowInfo
                  reserve={reserve}
                  currentMarketData={currentMarketData}
                  currentNetworkConfig={currentNetworkConfig}
                  renderCharts={renderCharts}
                  showBorrowCapStatus={showBorrowCapStatus}
                  borrowCap={borrowCap}
                />
              </Box>
            </PanelRow>
          </>
        )}

        {reserve.eModeCategoryId !== 0 && (
          <>
            <Divider sx={{ my: { xs: 6, sm: 10 } }} />
            <ReserveEModePanel reserve={reserve} />
          </>
        )}

        {(reserve.borrowingEnabled || Number(reserve.totalDebt) > 0) && (
          <>
            <Divider sx={{ my: { xs: 6, sm: 10 } }} />

            <PanelRow>
              <PanelTitle>Interest rate model</PanelTitle>
              <Box
                sx={{
                  flexGrow: 1,
                  minWidth: 0,
                  maxWidth: "100%",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <PanelItem title={"Utilization Rate"} className="borderless">
                    <FormattedNumber
                      value={reserve.borrowUsageRatio}
                      percent
                      variant="main16"
                      compact
                    />
                  </PanelItem>
                  <Button
                    onClick={() => {
                      trackEvent(GENERAL.EXTERNAL_LINK, {
                        asset: reserve.underlyingAsset,
                        Link: "Interest Rate Strategy",
                        assetName: reserve.name,
                      });
                    }}
                    href={currentNetworkConfig.explorerLinkBuilder({
                      address: reserve.interestRateStrategyAddress,
                    })}
                    endIcon={
                      <SvgIcon sx={{ width: 14, height: 14 }}>
                        <ExternalLinkIcon />
                      </SvgIcon>
                    }
                    component={Link}
                    size="small"
                    variant="outlined"
                    sx={{ verticalAlign: "top" }}
                  >
                    Interest rate strategy
                  </Button>
                </Box>
                <InterestRateModelGraphContainer reserve={reserve} />
              </Box>
            </PanelRow>
          </>
        )}
      </>
    );
  }
);

export default ReserveConfiguration;
