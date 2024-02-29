import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, ReactNode } from "react";

type NoSearchResultsProps = {
  searchTerm?: string;
  subtitle?: ReactNode;
};

export const NoSearchResults: FC<NoSearchResultsProps> = ({
  searchTerm,
  subtitle,
}) => {
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        pt: 7.5,
        pb: 16,
        px: 2,
      }}
    >
      {sm ? (
        <Box sx={{ textAlign: "center", maxWidth: "300px" }}>
          <Typography variant="h2" color="text.light">{`No search results${
            searchTerm && " for"
          }`}</Typography>
          {searchTerm && (
            <Typography
              sx={{ overflowWrap: "anywhere" }}
              variant="h2"
              color="text.light"
            >
              &apos;{searchTerm}&apos;
            </Typography>
          )}
        </Box>
      ) : (
        <Typography
          sx={{
            textAlign: "center",
            maxWidth: "480px",
            overflowWrap: "anywhere",
          }}
          variant="h2"
          color="text.light"
        >
          No search results for {searchTerm}
        </Typography>
      )}
      {subtitle && (
        <Typography
          sx={{ width: "280px", textAlign: "center" }}
          variant="description"
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
