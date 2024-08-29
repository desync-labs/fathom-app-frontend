import { Box } from "@mui/material";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListItem } from "apps/lending/components/lists/ListItem";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

export const MarketAssetsListItemLoader = () => {
  return (
    <ListItem px={6} minHeight={76}>
      <ListColumn isRow maxWidth={280}>
        <CustomSkeleton
          variant="circular"
          width={32}
          height={32}
          animation={"wave"}
        />
        <Box sx={{ pl: 3.5, overflow: "hidden" }}>
          <CustomSkeleton width={75} height={24} animation={"wave"} />
        </Box>
      </ListColumn>

      <ListColumn>
        <CustomSkeleton width={70} height={24} animation={"wave"} />
      </ListColumn>

      <ListColumn>
        <CustomSkeleton width={70} height={24} animation={"wave"} />
      </ListColumn>

      <ListColumn>
        <CustomSkeleton width={70} height={24} animation={"wave"} />
      </ListColumn>

      <ListColumn>
        <CustomSkeleton width={70} height={24} animation={"wave"} />
      </ListColumn>

      <ListColumn>
        <CustomSkeleton width={70} height={24} animation={"wave"} />
      </ListColumn>

      <ListColumn maxWidth={95} minWidth={95} align="right">
        <CustomSkeleton width={74} height={38} animation={"wave"} />
      </ListColumn>
    </ListItem>
  );
};
