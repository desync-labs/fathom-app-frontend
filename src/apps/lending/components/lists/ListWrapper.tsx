import { Box, BoxProps, Paper, Typography } from "@mui/material";
import { FC, ReactNode, useState } from "react";
import { useRootStore } from "apps/lending/store/root";
import { DASHBOARD } from "apps/lending/utils/mixPanelEvents";

import { toggleLocalStorageClick } from "apps/lending/helpers/toggle-local-storage-click";

interface ListWrapperProps {
  titleComponent: ReactNode;
  localStorageName?: string;
  subTitleComponent?: ReactNode;
  subChildrenComponent?: ReactNode;
  topInfo?: ReactNode;
  children: ReactNode;
  withTopMargin?: boolean;
  noData?: boolean;
  wrapperSx?: BoxProps["sx"];
  tooltipOpen?: boolean;
}

export const ListWrapper: FC<ListWrapperProps> = ({
  children,
  localStorageName,
  titleComponent,
  subTitleComponent,
  subChildrenComponent,
  topInfo,
  withTopMargin,
  noData,
  wrapperSx,
  tooltipOpen,
}) => {
  const [isCollapse, setIsCollapse] = useState(
    localStorageName ? localStorage.getItem(localStorageName) === "true" : false
  );
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleTrackingEvents = (): void | null => {
    if (!isCollapse) {
      switch (localStorageName as string | boolean) {
        case "borrowAssetsDashboardTableCollapse":
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: "Hidden",
            type: "Available Borrow Assets",
          });
          break;
        case "borrowedAssetsDashboardTableCollapse":
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: "Hidden",
            type: "Borrowed Assets",
          });
          break;
        case "supplyAssetsDashboardTableCollapse":
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: "Hidden",
            type: "Available Supply Assets",
          });
          break;
        case "suppliedAssetsDashboardTableCollapse":
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: "Hidden",
            type: "Supplied Assets",
          });
          break;
        default:
          return null;
      }
    } else {
      switch (localStorageName as string | boolean) {
        case "borrowAssetsDashboardTableCollapse":
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: "Show",
            type: "Available Borrow Assets",
          });
          break;
        case "borrowedAssetsDashboardTableCollapse":
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: "Show",
            type: "Borrowed Assets",
          });
          break;
        case "supplyAssetsDashboardTableCollapse":
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: "Show",
            type: "Available Supply Assets",
          });
          break;
        case "suppliedAssetsDashboardTableCollapse":
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: "Show",
            type: "Supplied Assets",
          });
          break;
        default:
          return null;
      }
    }
  };

  const collapsed = isCollapse && !noData;

  return (
    <Paper
      variant="outlined"
      sx={{
        mt: withTopMargin ? 2 : 0,
      }}
    >
      <Box
        sx={{
          px: { xs: 2, xsm: 3 },
          py: { xs: 1.5, xsm: 2 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          ...wrapperSx,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: { xs: "flex-start", xsm: "center" },
            py: "3.6px",
            flexDirection: { xs: "column", xsm: "row" },
          }}
        >
          {titleComponent}
          {subTitleComponent}
        </Box>

        {!!localStorageName && !noData && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              minHeight: "28px",
              pl: 1.5,
              span: {
                width: "14px",
                height: "2px",
                bgcolor: "text.secondary",
                position: "relative",
                ml: 0.5,
                "&:after": {
                  content: "''",
                  position: "absolute",
                  width: "14px",
                  height: "2px",
                  bgcolor: "text.secondary",
                  transition: "all 0.2s ease",
                  transform: collapsed ? "rotate(90deg)" : "rotate(0)",
                  opacity: collapsed ? 1 : 0,
                },
              },
            }}
            onClick={() => {
              handleTrackingEvents();

              !!localStorageName && !noData
                ? toggleLocalStorageClick(
                    isCollapse,
                    setIsCollapse,
                    localStorageName
                  )
                : undefined;
            }}
          >
            <Typography variant="buttonM" color="text.secondary">
              {collapsed ? "Show" : "Hide"}
            </Typography>
            <span />
          </Box>
        )}
      </Box>

      {topInfo && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: { xs: 2, xsm: 3 },
            pb: {
              xs: collapsed && !noData ? 3 : 1,
              xsm: collapsed && !noData ? 3 : 0,
            },
            overflowX: tooltipOpen ? "hidden" : "auto",
          }}
        >
          {topInfo}
        </Box>
      )}
      {subChildrenComponent && !collapsed && (
        <Box sx={{ marginBottom: { xs: 1, xsm: 0 } }}>
          {subChildrenComponent}
        </Box>
      )}
      <Box sx={{ display: collapsed ? "none" : "block" }}>{children}</Box>
    </Paper>
  );
};
