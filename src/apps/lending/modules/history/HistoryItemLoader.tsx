import { Box } from "@mui/material";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListItem } from "apps/lending/components/lists/ListItem";
import useSharedContext from "context/shared";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

const HistoryRowItem = () => {
  const { isSmallDesktop } = useSharedContext();
  return (
    <Box px={6}>
      <ListItem px={0} minHeight={50} sx={{ borderTop: "1px solid #2c4066" }}>
        <ListColumn isRow maxWidth={760} minWidth={isSmallDesktop ? 300 : 540}>
          <Box sx={{ overflow: "hidden" }}>
            <CustomSkeleton width={120} height={30} animation={"wave"} />
          </Box>
        </ListColumn>

        <ListColumn isRow align="center">
          <Box sx={{ pl: 3, display: "flex", gap: 1, alignItems: "center" }}>
            <CustomSkeleton width={110} height={22} animation={"wave"} />
          </Box>
        </ListColumn>

        <ListColumn align="right">
          <Box sx={{ display: "flex", gap: 1 }}>
            <CustomSkeleton width={75} height={32} animation={"wave"} />
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
          <CustomSkeleton width={140} height={18} animation={"wave"} />
        </ListColumn>
      </ListItem>
      <HistoryRowItem />
      <HistoryRowItem />
      <HistoryRowItem />
    </>
  );
};
