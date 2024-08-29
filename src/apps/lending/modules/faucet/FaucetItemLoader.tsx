import { Box, Button } from "@mui/material";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListItem } from "apps/lending/components/lists/ListItem";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

export const FaucetItemLoader = () => {
  return (
    <ListItem px={3} minHeight={76}>
      <ListColumn isRow maxWidth={280}>
        <CustomSkeleton
          variant="circular"
          width={32}
          height={32}
          animation={"wave"}
        />
        <Box sx={{ pl: 1.75, overflow: "hidden" }}>
          <CustomSkeleton width={75} height={24} animation={"wave"} />
        </Box>
      </ListColumn>

      <ListColumn>
        <CustomSkeleton width={70} height={24} animation={"wave"} />
      </ListColumn>

      <ListColumn maxWidth={280} align="right">
        <Button variant="gradient">Faucet</Button>
      </ListColumn>
    </ListItem>
  );
};
