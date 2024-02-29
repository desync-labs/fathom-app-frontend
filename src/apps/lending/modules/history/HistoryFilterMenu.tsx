import { XCircleIcon } from "@heroicons/react/solid";
import { Check as CheckIcon, Sort as SortIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DarkTooltip } from "apps/lending/components/infoTooltips/DarkTooltip";
import { useRootStore } from "apps/lending/store/root";
import { TRANSACTION_HISTORY } from "apps/lending/utils/mixPanelEvents";

import { FilterOptions } from "./types";

interface HistoryFilterMenuProps {
  onFilterChange: (filter: FilterOptions[]) => void;
  currentFilter: FilterOptions[];
}

interface FilterLabelProps {
  filter: FilterOptions;
}

const FilterLabel: React.FC<FilterLabelProps> = ({ filter }) => {
  switch (filter) {
    case FilterOptions.SUPPLY:
      return <>Supply</>;
    case FilterOptions.BORROW:
      return <>Borrow</>;
    case FilterOptions.WITHDRAW:
      return <>Withdraw</>;
    case FilterOptions.REPAY:
      return <>Repay</>;
    case FilterOptions.RATECHANGE:
      return <>Rate change</>;
    case FilterOptions.COLLATERALCHANGE:
      return <>Collateral change</>;
    case FilterOptions.LIQUIDATION:
      return <>Liqudation</>;
  }
};

export const HistoryFilterMenu: React.FC<HistoryFilterMenuProps> = ({
  onFilterChange,
  currentFilter,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [localFilter, setLocalFilter] =
    useState<FilterOptions[]>(currentFilter);
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    onFilterChange(localFilter);
  }, [localFilter, onFilterChange]);

  const theme = useTheme();
  const downToMD = useMediaQuery(theme.breakpoints.down("md"));

  const allSelected = currentFilter.length === 0;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onFilterChange(currentFilter);
  };

  const handleFilterClick = (filter: FilterOptions | undefined) => {
    let newFilter: FilterOptions[] = [];
    if (filter !== undefined) {
      if (currentFilter.includes(filter)) {
        newFilter = currentFilter.filter((item) => item !== filter);
      } else {
        trackEvent(TRANSACTION_HISTORY.FILTER, { value: filter });
        newFilter = [...currentFilter, filter];
        // Checks if all filter options are selected,  enum length is divided by 2 based on how Typescript creates object from enum
        if (newFilter.length === Object.keys(FilterOptions).length / 2) {
          newFilter = [];
        }
      }
    }

    setLocalFilter(newFilter);
  };

  const FilterButtonLabel = () => {
    if (allSelected) {
      return <>All transactions</>;
    } else {
      const displayLimit = 2;
      const hiddenCount = currentFilter.length - displayLimit;
      const displayedFilters = currentFilter
        .slice(0, displayLimit)
        .map((filter) => (
          <React.Fragment key={filter}>
            <FilterLabel filter={filter} />
            {filter !== currentFilter[currentFilter.length - 1] && ","}
            {filter !== currentFilter[displayLimit - 1] && " "}
          </React.Fragment>
        ));

      return (
        <Box sx={{ display: "flex" }}>
          <Typography
            variant="description"
            color={theme.palette.text.primary}
            sx={{ mr: 0.5 }}
          >
            TXs:
          </Typography>
          {displayedFilters}
          {hiddenCount > 0 && (
            <React.Fragment>...(+{hiddenCount})</React.Fragment>
          )}
        </Box>
      );
    }
  };

  const handleClearFilter = (event: React.MouseEvent) => {
    trackEvent(TRANSACTION_HISTORY.FILTER, { value: "cleared" });
    event.stopPropagation();
    setLocalFilter([]);
  };

  return (
    <Box>
      <Button
        sx={{
          minWidth: 148,
          maxWidth: downToMD ? "100%" : 360,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 36,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "4px",
          mr: downToMD ? 0 : 1,
          ml: downToMD ? 2 : 0,
          pl: 1,
          pr: 0.5,
        }}
        onClick={handleClick}
      >
        <Box display="flex" alignItems="center" overflow="hidden">
          <SvgIcon height={9} width={9} color="primary">
            <SortIcon />
          </SvgIcon>
          <Typography
            variant="subheader1"
            color="text.light"
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              mx: 0.5,
            }}
          >
            <FilterButtonLabel />
          </Typography>
        </Box>
        {!allSelected && (
          <DarkTooltip
            title={
              <Typography variant="caption" color="common.white">
                Reset
              </Typography>
            }
          >
            <Box
              sx={{
                cursor: "pointer",
                color: "primary",
                height: "auto",
                width: "auto",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleClearFilter}
            >
              <XCircleIcon color="#A5A8B6" width={18} height={18} />
            </Box>
          </DarkTooltip>
        )}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 280,
            maxHeight: 300,
            mt: 0.5,
            boxShadow:
              "0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
          },
        }}
      >
        <MenuItem
          onClick={() => handleFilterClick(undefined)}
          sx={{
            background: allSelected
              ? theme.palette.background.surface
              : undefined,
            display: "flex",
            justifyContent: "space-between",
            color: theme.palette.text.light,
          }}
        >
          <Typography variant="subheader1" color="text.light">
            All transactions
          </Typography>
          {allSelected && (
            <SvgIcon sx={{ fontSize: "16px" }} color={"inherit"}>
              <CheckIcon />
            </SvgIcon>
          )}
        </MenuItem>
        <Divider sx={{ mt: 0.5 }} />
        <Box
          sx={{
            overflowY: "scroll",
            maxHeight: 200,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {Object.keys(FilterOptions)
            .filter((key) => isNaN(Number(key)))
            .map((optionKey) => {
              const option =
                FilterOptions[optionKey as keyof typeof FilterOptions];
              return (
                <MenuItem
                  key={optionKey}
                  onClick={() => handleFilterClick(option)}
                  sx={{
                    background: currentFilter.includes(option)
                      ? theme.palette.background.surface
                      : undefined,
                    display: "flex",
                    justifyContent: "space-between",
                    color: theme.palette.text.light,
                  }}
                >
                  <Typography variant="subheader1" color="text.light">
                    <FilterLabel filter={option} />
                  </Typography>
                  {currentFilter.includes(option) && (
                    <SvgIcon sx={{ fontSize: "16px" }} color={"inherit"}>
                      <CheckIcon />
                    </SvgIcon>
                  )}
                </MenuItem>
              );
            })}
        </Box>
      </Menu>
    </Box>
  );
};
