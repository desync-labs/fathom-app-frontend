import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import {
  ProposalItemProposalId,
  ProposalItemWrapper,
  ProposalLabel,
  ProposalValue,
} from "components/Governance/ViewAllProposalItem";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

const ViewAllProposalItemSkeleton = () => {
  return (
    <ProposalItemWrapper>
      <BaseFlexBox width={"100%"}>
        <ProposalItemProposalId>
          <CustomSkeleton animation={"wave"} width={80} height={20} />
        </ProposalItemProposalId>
        <BaseFlexBox>
          <CustomSkeleton animation={"wave"} width={110} height={32} />
        </BaseFlexBox>
      </BaseFlexBox>
      <ProposalLabel>Title</ProposalLabel>
      <ProposalValue>
        <CustomSkeleton animation={"wave"} width={200} height={20} />
      </ProposalValue>
      <ProposalLabel>Description</ProposalLabel>
      <ProposalValue>
        <CustomSkeleton animation={"wave"} width={200} height={20} />
      </ProposalValue>
    </ProposalItemWrapper>
  );
};

const ViewAllProposalSkeleton = () => {
  return (
    <>
      <ViewAllProposalItemSkeleton />
      <ViewAllProposalItemSkeleton />
      <ViewAllProposalItemSkeleton />
      <ViewAllProposalItemSkeleton />
    </>
  );
};

export default ViewAllProposalSkeleton;
