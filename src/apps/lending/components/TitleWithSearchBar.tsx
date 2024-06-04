import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  IconButton,
  SvgIcon,
  Typography,
  TypographyProps,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ElementType, ReactNode, useState } from "react";

import { SearchInput } from "./SearchInput";

interface TitleWithSearchBarProps<C extends ElementType> {
  onSearchTermChange: (value: string) => void;
  searchPlaceholder: string;
  titleProps?: TypographyProps<C, { component?: C }>;
  title: ReactNode;
}

export const TitleWithSearchBar = <T extends ElementType>({
  onSearchTermChange,
  searchPlaceholder,
  titleProps,
  title,
}: TitleWithSearchBarProps<T>) => {
  const [showSearchBar, setShowSearchBar] = useState(false);

  const { breakpoints, palette } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));

  const showSearchIcon = sm && !showSearchBar;
  const showMarketTitle = !sm || !showSearchBar;

  const handleCancelClick = () => {
    setShowSearchBar(false);
    onSearchTermChange("");
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {showMarketTitle && (
        <Typography
          component="div"
          variant="h2"
          sx={{ mr: 2 }}
          color={palette.text.primary}
          {...titleProps}
        >
          {title}
        </Typography>
      )}
      <Box
        sx={{
          height: "40px",
          width: showSearchBar && sm ? "100%" : "unset",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {showSearchIcon && (
          <IconButton onClick={() => setShowSearchBar(true)}>
            <SvgIcon>
              <SearchIcon />
            </SvgIcon>
          </IconButton>
        )}
        {(showSearchBar || !sm) && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <SearchInput
              wrapperSx={{
                width: {
                  xs: "100%",
                  sm: "340px",
                },
              }}
              placeholder={searchPlaceholder}
              onSearchTermChange={onSearchTermChange}
            />
            {sm && (
              <Button sx={{ ml: 1 }} onClick={() => handleCancelClick()}>
                <Typography variant="buttonM" color="text.primary">
                  Cancel
                </Typography>
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
