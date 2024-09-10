import { Box } from "@mui/material";

import { Row } from "apps/lending/components/primitives/Row";
import { ListMobileItemWrapper } from "apps/lending/modules/dashboard/lists/ListMobileItemWrapper";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

export const MobileListItemLoader = () => {
  return (
    <ListMobileItemWrapper loading>
      <Row
        caption={<CustomSkeleton width={100} height={20} animation={"wave"} />}
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <CustomSkeleton width={70} height={20} animation={"wave"} />
      </Row>

      <Row
        caption={<CustomSkeleton width={100} height={20} animation={"wave"} />}
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <CustomSkeleton width={70} height={20} animation={"wave"} />
      </Row>

      <Row
        caption={<CustomSkeleton width={100} height={20} animation={"wave"} />}
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <CustomSkeleton width={70} height={20} animation={"wave"} />
      </Row>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 5,
        }}
      >
        <CustomSkeleton
          width="100%"
          height={36}
          sx={{ mr: 1.5 }}
          animation={"wave"}
        />
        <CustomSkeleton width="100%" height={36} animation={"wave"} />
      </Box>
    </ListMobileItemWrapper>
  );
};
