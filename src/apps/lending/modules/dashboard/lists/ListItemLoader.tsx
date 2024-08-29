import { Box } from "@mui/material";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListItem } from "apps/lending/components/lists/ListItem";
import { ListButtonsColumn } from "apps/lending/modules/dashboard/lists/ListButtonsColumn";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

export const ListItemLoader = () => {
  return (
    <ListItem>
      <ListColumn maxWidth={160} isRow>
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          <CustomSkeleton variant="circular" width={32} height={32} />
          <CustomSkeleton sx={{ ml: 3 }} width={39} height={20} />
        </Box>
      </ListColumn>

      <ListColumn>
        <CustomSkeleton width={70} height={20} animation={"wave"} />
      </ListColumn>

      <ListColumn>
        <CustomSkeleton width={70} height={20} animation={"wave"} />
      </ListColumn>

      <ListColumn>
        <CustomSkeleton width={70} height={20} animation={"wave"} />
      </ListColumn>

      <ListButtonsColumn>
        <CustomSkeleton height={38} width={74} animation={"wave"} />
        <CustomSkeleton
          height={38}
          width={74}
          sx={{ ml: "6px" }}
          animation={"wave"}
        />
      </ListButtonsColumn>
    </ListItem>
  );
};
