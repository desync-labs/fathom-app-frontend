import { Divider } from "@mui/material";

import { Row } from "apps/lending/components/primitives/Row";
import { ListMobileItemWrapper } from "apps/lending/modules/dashboard/lists/ListMobileItemWrapper";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

export const MarketAssetsListMobileItemLoader = () => {
  return (
    <ListMobileItemWrapper loading>
      <Row
        caption={<CustomSkeleton width={100} height={20} animation={"wave"} />}
        captionVariant="description"
        mb={3}
      >
        <CustomSkeleton width={45} height={20} animation={"wave"} />
      </Row>
      <Row
        caption={<CustomSkeleton width={100} height={20} animation={"wave"} />}
        captionVariant="description"
        mb={3}
        align="flex-start"
      >
        <CustomSkeleton width={45} height={20} animation={"wave"} />
      </Row>

      <Divider sx={{ mb: 3 }} />

      <Row
        caption={<CustomSkeleton width={100} height={20} animation={"wave"} />}
        captionVariant="description"
        mb={3}
      >
        <CustomSkeleton width={45} height={20} animation={"wave"} />
      </Row>
      <Row
        caption={<CustomSkeleton width={100} height={20} animation={"wave"} />}
        captionVariant="description"
        mb={3}
        align="flex-start"
      >
        <CustomSkeleton width={45} height={20} animation={"wave"} />
      </Row>
      <Row
        caption={<CustomSkeleton width={100} height={20} animation={"wave"} />}
        captionVariant="description"
        mb={4}
        align="flex-start"
      >
        <CustomSkeleton width={45} height={20} animation={"wave"} />
      </Row>

      <CustomSkeleton width="100%" height={38} animation={"wave"} />
    </ListMobileItemWrapper>
  );
};
