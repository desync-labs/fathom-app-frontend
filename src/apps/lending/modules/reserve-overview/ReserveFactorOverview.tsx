import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, SvgIcon, Typography } from "@mui/material";
import { ReserveFactorTooltip } from "apps/lending/components/infoTooltips/ReserveFactorTooltip";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Link } from "apps/lending/components/primitives/Link";
import { ReserveOverviewBox } from "apps/lending/components/ReserveOverviewBox";
import { useRootStore } from "apps/lending/store/root";
import { ExplorerLinkBuilderProps } from "apps/lending/ui-config/networksConfig";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";
import { FC, memo } from "react";

interface ReserveFactorOverviewProps {
  collectorContract: string;
  explorerLinkBuilder: (props: ExplorerLinkBuilderProps) => string;
  reserveFactor: string;
  reserveName: string;
  reserveAsset: string;
}

export const ReserveFactorOverview: FC<ReserveFactorOverviewProps> = memo(
  ({
    collectorContract,
    explorerLinkBuilder,
    reserveFactor,
    reserveName,
    reserveAsset,
  }) => {
    const trackEvent = useRootStore((store) => store.trackEvent);

    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <ReserveOverviewBox
          title={
            <ReserveFactorTooltip
              event={{
                eventName: GENERAL.TOOL_TIP,
                eventParams: {
                  tooltip: "Reserve factor",
                  asset: reserveAsset,
                  assetName: reserveName,
                },
              }}
              text={"Reserve factor"}
              key="res_factor"
              variant="description"
              collectorLink={
                collectorContract
                  ? explorerLinkBuilder({
                      address: collectorContract,
                    })
                  : undefined
              }
            />
          }
        >
          <FormattedNumber
            value={reserveFactor}
            percent
            variant="secondary14"
            visibleDecimals={2}
            color="text.light"
          />
        </ReserveOverviewBox>

        <ReserveOverviewBox
          title={
            <Typography variant="description">Collector Contract</Typography>
          }
        >
          <Link
            onClick={() => {
              trackEvent(GENERAL.EXTERNAL_LINK, {
                Link: "Collector Contract " + reserveName,
                asset: reserveAsset,
                assetName: reserveName,
              });
            }}
            href={explorerLinkBuilder({
              address: collectorContract,
            })}
            sx={{ textDecoration: "none" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="description" color="text.secondary">
                View contract
              </Typography>
              <SvgIcon sx={{ ml: 0.5, fontSize: 14, color: "text.primary" }}>
                <OpenInNewIcon />
              </SvgIcon>
            </Box>
          </Link>
        </ReserveOverviewBox>
        {/* TO-DO: Refactor grid layout, currently uses flex: space-around which breaks with 2 elements */}
        <Box
          sx={{
            flex: "0 32%",
            marginBottom: "2%",
            height: { md: "70px", lg: "60px" },
            maxWidth: "32%",
          }}
        />
      </Box>
    );
  }
);
