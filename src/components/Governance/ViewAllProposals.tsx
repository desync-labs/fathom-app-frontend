import { Box } from "@mui/material";

import {
  ProposalsTabs,
  useAllProposals,
} from "hooks/Governance/useAllProposals";
import ProposalsListTabs, {
  AddProposalBtnComponent,
} from "components/Governance/List/ProposalsListTabs";
import BasePageHeader from "components/Base/PageHeader";
import BasePageContainer from "components/Base/PageContainer";
import ProposalsView from "components/Governance/List/ProposalsView";
import ProposalsDraftView from "components/Governance/List/ProposalsDraftView";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import useConnector from "context/connector";

const AllProposalsView = () => {
  const { account } = useConnector();
  const {
    tab,
    isLoading,
    fetchedProposals,
    itemsCount,
    currentPage,
    handlePageChange,
    draftProposals,
  } = useAllProposals();

  return (
    <BasePageContainer>
      <BasePageHeader
        title="Governance"
        description="Fathom is a decentralized, community governed protocol. Locking FTHM tokens in our DAO vault will <br/> allow you to put forward forum-vetted proposals and vote on them."
      />
      <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        {draftProposals.length ? (
          <ProposalsListTabs tab={tab} />
        ) : account ? (
          <BaseFlexBox sx={{ justifyContent: "right" }}>
            <AddProposalBtnComponent />
          </BaseFlexBox>
        ) : null}
        {tab === ProposalsTabs.PROPOSALS && (
          <ProposalsView
            isLoading={isLoading}
            fetchedProposals={fetchedProposals}
            itemsCount={itemsCount}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        )}
        {tab === ProposalsTabs.DRAFTS && (
          <ProposalsDraftView draftProposals={draftProposals} />
        )}
      </Box>
    </BasePageContainer>
  );
};

export default AllProposalsView;
