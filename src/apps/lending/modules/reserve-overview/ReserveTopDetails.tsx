import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Skeleton, SvgIcon, useMediaQuery, useTheme } from "@mui/material";
import { CircleIcon } from "apps/lending/components/CircleIcon";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Link } from "apps/lending/components/primitives/Link";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { TopInfoPanelItem } from "apps/lending/components/TopInfoPanel/TopInfoPanelItem";
import {
  ComputedReserveData,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { FC, memo } from "react";

interface ReserveTopDetailsProps {
  underlyingAsset: string;
}

export const ReserveTopDetails: FC<ReserveTopDetailsProps> = memo(
  ({ underlyingAsset }) => {
    const { reserves, loading } = useAppDataContext();
    const { currentNetworkConfig } = useProtocolDataContext();
    const trackEvent = useRootStore((store) => store.trackEvent);

    const theme = useTheme();
    const downToSM = useMediaQuery(theme.breakpoints.down("sm"));

    const poolReserve = reserves.find(
      (reserve) => reserve.underlyingAsset === underlyingAsset
    ) as ComputedReserveData;

    const valueTypographyVariant = downToSM ? "main16" : "main21";
    const symbolsTypographyVariant = downToSM ? "secondary16" : "secondary21";

    const iconStyling = {
      display: "inline-flex",
      alignItems: "center",
      color: { color: theme.palette.other.fathomAccentMute },
      "&:hover": { color: theme.palette.other.fathomAccent },
      cursor: "pointer",
    };

    return (
      <>
        <TopInfoPanelItem title={"Reserve Size"} loading={loading} hideIcon>
          <FormattedNumber
            value={Math.max(Number(poolReserve?.totalLiquidityUSD), 0)}
            symbol="USD"
            variant={valueTypographyVariant}
            symbolsVariant={symbolsTypographyVariant}
          />
        </TopInfoPanelItem>

        <TopInfoPanelItem
          title={"Available liquidity"}
          loading={loading}
          hideIcon
        >
          <FormattedNumber
            value={Math.max(Number(poolReserve?.availableLiquidityUSD), 0)}
            symbol="USD"
            variant={valueTypographyVariant}
            symbolsVariant={symbolsTypographyVariant}
          />
        </TopInfoPanelItem>

        <TopInfoPanelItem title={"Utilization Rate"} loading={loading} hideIcon>
          <FormattedNumber
            value={poolReserve?.borrowUsageRatio}
            percent
            variant={valueTypographyVariant}
            symbolsVariant={symbolsTypographyVariant}
          />
        </TopInfoPanelItem>

        <TopInfoPanelItem title={"Oracle price"} loading={loading} hideIcon>
          <Box sx={{ display: "inline-flex", alignItems: "center" }}>
            <FormattedNumber
              value={poolReserve?.priceInUSD}
              symbol="USD"
              variant={valueTypographyVariant}
              symbolsVariant={symbolsTypographyVariant}
              visibleDecimals={4}
            />
            {loading ? (
              <Skeleton
                width={16}
                height={16}
                sx={{ ml: 0.5, background: "#383D51" }}
              />
            ) : (
              <CircleIcon
                tooltipText="View oracle contract"
                downToSM={downToSM}
              >
                <Link
                  onClick={() =>
                    trackEvent(GENERAL.EXTERNAL_LINK, {
                      Link: "Oracle Price",
                      oracle: poolReserve?.priceOracle,
                      assetName: poolReserve.name,
                      asset: poolReserve.underlyingAsset,
                    })
                  }
                  href={currentNetworkConfig.explorerLinkBuilder({
                    address: poolReserve?.priceOracle,
                  })}
                  sx={iconStyling}
                >
                  <SvgIcon sx={{ fontSize: downToSM ? "12px" : "14px" }}>
                    <OpenInNewIcon />
                  </SvgIcon>
                </Link>
              </CircleIcon>
            )}
          </Box>
        </TopInfoPanelItem>
      </>
    );
  }
);
