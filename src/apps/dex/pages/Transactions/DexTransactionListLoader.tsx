import useSharedContext from "context/shared";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";
import {
  ListColumn,
  ListItem,
} from "components/PositionActivityList/PositionActivityListLoader";

const DexTransactionListRowItem = () => {
  const { isMobile } = useSharedContext();

  return (
    <ListItem
      minHeight={isMobile ? 68 : 85}
      sx={{ padding: isMobile ? "12px 16px" : "16px 24px 16px 48px" }}
    >
      <ListColumn
        minWidth={isMobile ? 240 : 400}
        align="left"
        p={isMobile ? 0 : 0.5}
        gap={1}
      >
        <CustomSkeleton
          width={isMobile ? 240 : 280}
          height={isMobile ? 16 : 20}
        />
        <CustomSkeleton
          variant={isMobile ? "circular" : "rectangular"}
          width={isMobile ? 24 : 150}
          height={isMobile ? 24 : 18}
        />
      </ListColumn>
      {!isMobile && (
        <ListColumn isRow align="center">
          <CustomSkeleton variant={"circular"} width={24} height={24} />
        </ListColumn>
      )}
      <ListColumn align="right">
        <CustomSkeleton
          width={isMobile ? 44 : 77}
          height={isMobile ? 28 : 32}
        />
      </ListColumn>
    </ListItem>
  );
};

export const DexTransactionListLoader = ({
  txAmount = 1,
}: {
  txAmount?: number;
}) => {
  const { isMobile } = useSharedContext();
  return (
    <>
      <ListItem minHeight={56}>
        <ListColumn align="left">
          <CustomSkeleton width={100} height={isMobile ? 22 : 24} />
        </ListColumn>
      </ListItem>
      {Array.from({ length: txAmount }).map((_, index) => (
        <DexTransactionListRowItem key={index} />
      ))}
    </>
  );
};
