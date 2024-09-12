import { IProposal } from "fathom-sdk";
import ViewAllProposalItem from "components/Governance/ViewAllProposalItem";
import {
  CircleWrapper,
  NoResults,
} from "components/AppComponents/AppBox/AppBox";
import { Box, CircularProgress, Pagination } from "@mui/material";
import { COUNT_PER_PAGE } from "utils/Constants";
import { styled } from "@mui/material/styles";
import { ChangeEvent, FC } from "react";

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

type ProposalsViewProps = {
  fetchProposalsPending: boolean;
  fetchedProposals: IProposal[];
  itemsCount: number;
  currentPage: number;
  handlePageChange: (event: ChangeEvent<unknown>, value: number) => void;
};

const ProposalsView: FC<ProposalsViewProps> = ({
  fetchProposalsPending,
  fetchedProposals,
  itemsCount,
  currentPage,
  handlePageChange,
}) => {
  return (
    <>
      <ProposalListWrapper>
        {fetchedProposals.length && !fetchProposalsPending ? (
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
        )}
      </ProposalListWrapper>
      {!fetchProposalsPending && itemsCount > COUNT_PER_PAGE && (
        <PaginationWrapper>
          <Pagination
            count={Math.ceil(itemsCount / COUNT_PER_PAGE)}
            page={currentPage}
            onChange={handlePageChange}
          />
        </PaginationWrapper>
      )}
    </>
  );
};

export default ProposalsView;
