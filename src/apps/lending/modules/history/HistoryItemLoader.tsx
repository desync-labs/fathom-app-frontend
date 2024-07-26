import { Box, Skeleton } from "@mui/material";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListItem } from "apps/lending/components/lists/ListItem";
import useSharedContext from "context/shared";

const HistoryRowItem = () => {
  const { isSmallDesktop } = useSharedContext();
  return (
    <Box px={6}>
      <ListItem px={0} minHeight={50} sx={{ borderTop: "1px solid #2c4066" }}>
        <ListColumn isRow maxWidth={760} minWidth={isSmallDesktop ? 300 : 540}>
          <Box sx={{ overflow: "hidden" }}>
            <Skeleton width={120} height={30} />
          </Box>
        </ListColumn>

        <ListColumn isRow align="center">
          <Box sx={{ pl: 3, display: "flex", gap: 1, alignItems: "center" }}>
            <Skeleton width={110} height={22} />
          </Box>
        </ListColumn>

        <ListColumn align="right">
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton width={75} height={32} />
          </Box>
        </ListColumn>
      </ListItem>
    </Box>
  );
};

export const HistoryItemLoader = () => {
  return (
    <>
      <ListItem
        minHeight={26}
        sx={{ ml: 4.5, mt: 1.5, mb: 1, "&:not(:last-child)": {} }}
        px={0}
      >
        <ListColumn align="left">
          <Skeleton width={140} height={18} />
        </ListColumn>
      </ListItem>
      <HistoryRowItem />
      <HistoryRowItem />
      <HistoryRowItem />
    </>
  );
};
