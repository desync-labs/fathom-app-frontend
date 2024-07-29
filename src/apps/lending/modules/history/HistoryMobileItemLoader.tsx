import { Box, Skeleton } from "@mui/material";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListItem } from "apps/lending/components/lists/ListItem";

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
          <Skeleton width={80} height={16} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
      </ListColumn>

      <ListColumn align="right">
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton width={55} height={16} />
          <Skeleton width={70} height={20} />
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
          <Skeleton width={80} height={16} />
        </ListColumn>
      </ListItem>
      <HistoryMobileRowItem />
      <HistoryMobileRowItem />
      <HistoryMobileRowItem />
    </>
  );
};
