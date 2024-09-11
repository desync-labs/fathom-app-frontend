import { useMemo } from "react";
import { CircularProgress, Pagination, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IProposal } from "fathom-sdk";

import { useAllProposals } from "hooks/Governance/useAllProposals";
import { COUNT_PER_PAGE } from "utils/Constants";

import ViewAllProposalItem from "components/Governance/ViewAllProposalItem";
import ProposalFilters from "components/Governance/ProposalFilters";
import {
  CircleWrapper,
  NoResults,
} from "components/AppComponents/AppBox/AppBox";
import BasePageHeader from "../Base/PageHeader";
import BasePageContainer from "../Base/PageContainer";

const ProposalListWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
`;

const PaginationWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const AllProposalsView = () => {
  const {
    fetchProposalsPending,
    search,
    setSearch,
    time,
    setTime,
    fetchedProposals,
    proposals,
    setProposals,
    itemsCount,
    currentPage,
    handlePageChange,
  } = useAllProposals();

  return (
    <BasePageContainer>
      <BasePageHeader
        title="Governance"
        description="Fathom is a decentralized, community governed protocol. Locking FTHM tokens in our DAO vault will <br/> allow you to put forward forum-vetted proposals and vote on them."
      />
      <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        <ProposalFilters
          search={search}
          setSearch={setSearch}
          time={time}
          setTime={setTime}
          proposals={proposals}
          setProposals={setProposals}
        />
        <ProposalListWrapper>
          {useMemo(
            () =>
              fetchedProposals.length ? (
                fetchedProposals.map((proposal: IProposal, index: number) => (
                  <ViewAllProposalItem
                    proposal={proposal}
                    key={proposal.proposalId}
                    index={index}
                  />
                ))
              ) : (
                <NoResults>
                  {fetchProposalsPending ? (
                    <CircleWrapper>
                      <CircularProgress size={30} />
                    </CircleWrapper>
                  ) : (
                    "No opened any proposals."
                  )}
                </NoResults>
              ),
            [fetchedProposals, fetchProposalsPending]
          )}
        </ProposalListWrapper>
        {!fetchProposalsPending && fetchedProposals.length > COUNT_PER_PAGE && (
          <PaginationWrapper>
            <Pagination
              count={Math.ceil(itemsCount / COUNT_PER_PAGE)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </PaginationWrapper>
        )}
      </Box>
    </BasePageContainer>
  );
};

export default AllProposalsView;
