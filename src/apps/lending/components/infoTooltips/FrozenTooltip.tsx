import ErrorIcon from "@mui/icons-material/Error";
import { Box, SvgIcon } from "@mui/material";

import { ContentWithTooltip } from "apps/lending/components/ContentWithTooltip";

export const FrozenTooltip = () => {
  return (
    <ContentWithTooltip
      tooltipContent={
        <Box>
          <>
            This asset is frozen due to an Fathom Protocol Governance decision.
          </>
        </Box>
      }
    >
      <SvgIcon sx={{ fontSize: "20px", color: "error.main", ml: 2 }}>
        <ErrorIcon />
      </SvgIcon>
    </ContentWithTooltip>
  );
};
