import { Box } from "@mui/material";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListItem } from "apps/lending/components/lists/ListItem";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

const HistoryMobileRowItem = () => {
  return (
    <ListItem px={2} minHeight={66} sx={{ alignItems: "start" }}>
      <ListColumn isRow maxWidth={280}>
        <Box
          sx={{
            overflow: "hidden",
            flexDirection: "column",
            display: "flex",
            gap: "8px",
          }}
        >
          <CustomSkeleton width={80} height={16} animation={"wave"} />
          <CustomSkeleton variant="circular" width={24} height={24} />
        </Box>
      </ListColumn>

      <ListColumn align="right">
        <Box sx={{ display: "flex", gap: 1 }}>
          <CustomSkeleton width={55} height={16} animation={"wave"} />
          <CustomSkeleton width={70} height={20} animation={"wave"} />
        </Box>
      </ListColumn>
    </ListItem>
  );
};

export const HistoryMobileItemLoader = () => {
  return (
    <>
      <ListItem px={2} minHeight={35}>
        <ListColumn align="left">
          <CustomSkeleton width={80} height={16} animation={"wave"} />
        </ListColumn>
      </ListItem>
      <HistoryMobileRowItem />
      <HistoryMobileRowItem />
      <HistoryMobileRowItem />
    </>
  );
};
