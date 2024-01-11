import { ExclamationIcon } from "@heroicons/react/outline";
import { Box, SvgIcon } from "@mui/material";

import { ContentWithTooltip } from "apps/lending/components/ContentWithTooltip";
import { BUSDOffBoardingWarning } from "apps/lending/components/Warnings/BUSDOffBoardingWarning";

export const BUSDOffBoardingTooltip = () => {
  return (
    <ContentWithTooltip
      tooltipContent={
        <Box>
          <BUSDOffBoardingWarning />
        </Box>
      }
    >
      <SvgIcon sx={{ fontSize: "20px", color: "error.main", ml: 2 }}>
        <ExclamationIcon />
      </SvgIcon>
    </ContentWithTooltip>
  );
};
