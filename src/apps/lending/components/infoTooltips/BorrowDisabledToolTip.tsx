import InfoIcon from "@mui/icons-material/Info";
import { Box, SvgIcon } from "@mui/material";

import { ContentWithTooltip } from "apps/lending/components/ContentWithTooltip";
import { BorrowDisabledWarning } from "apps/lending/components/Warnings/BorrowDisabledWarning";

export const BorrowDisabledToolTip = () => {
  return (
    <ContentWithTooltip
      tooltipContent={
        <Box>
          <BorrowDisabledWarning />
        </Box>
      }
    >
      <SvgIcon sx={{ fontSize: "20px", color: "error.main", ml: 2 }}>
        <InfoIcon />
      </SvgIcon>
    </ContentWithTooltip>
  );
};
