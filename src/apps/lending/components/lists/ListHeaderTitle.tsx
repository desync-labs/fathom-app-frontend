import { Box, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { useRootStore } from "apps/lending/store/root";

import { MARKETS } from "apps/lending/utils/mixPanelEvents";

interface ListHeaderTitleProps {
  sortName?: string;
  sortDesc?: boolean;
  sortKey?: string;
  source?: string;
  setSortName?: (value: string) => void;
  setSortDesc?: (value: boolean) => void;
  onClick?: () => void;
  children: ReactNode;
}

export const ListHeaderTitle: FC<ListHeaderTitleProps> = ({
  sortName,
  sortDesc,
  sortKey,
  source,
  setSortName,
  setSortDesc,
  onClick,
  children,
}) => {
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleSorting = (name: string) => {
    trackEvent(MARKETS.SORT, { sort_by: name, tile: source });
    setSortDesc && setSortDesc(false);
    setSortName && setSortName(name);
    if (sortName === name) {
      setSortDesc && setSortDesc(!sortDesc);
    }
  };

  return (
    <Typography
      component="div"
      variant="subheader2"
      color="text.muted"
      textTransform="uppercase"
      noWrap
      onClick={() =>
        onClick ? onClick() : !!sortKey && handleSorting(sortKey)
      }
      sx={{
        cursor: !!onClick || !!sortKey ? "pointer" : "default",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {children}

      {!!sortKey && (
        <Box sx={{ display: "inline-flex", flexDirection: "column", ml: 0.5 }}>
          <Box
            component="span"
            sx={(theme) => ({
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "0 4px 4px 4px",
              borderColor: `transparent transparent ${
                sortName === sortKey && sortDesc
                  ? theme.palette.text.secondary
                  : theme.palette.divider
              } transparent`,
              mb: 0.25,
            })}
          />
          <Box
            component="span"
            sx={(theme) => ({
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "4px 4px 0 4px",
              borderColor: `${
                sortName === sortKey && !sortDesc
                  ? theme.palette.text.secondary
                  : theme.palette.divider
              } transparent transparent transparent`,
            })}
          />
        </Box>
      )}
    </Typography>
  );
};
