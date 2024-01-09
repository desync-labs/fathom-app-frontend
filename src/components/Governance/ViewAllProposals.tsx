import loadable from "@loadable/component";
import { useMemo } from "react";
import {
  Typography,
  Grid,
  CircularProgress,
  Pagination,
  Box,
} from "@mui/material";
import { useAllProposals } from "hooks/useAllProposals";
import { IProposal } from "fathom-sdk";
import { PageHeader } from "components/Dashboard/PageHeader";
const ViewAllProposalItem = loadable(
  () => import("../Governance/ViewAllProposalItem")
);
const Propose = loadable(() => import("../Governance/Propose"));
const ProposalFilters = loadable(() => import("../Governance/ProposalFilters"));
import { NoResults } from "components/AppComponents/AppBox/AppBox";

import { COUNT_PER_PAGE } from "utils/Constants";
import { styled } from "@mui/material/styles";
import useSharedContext from "context/shared";

const PaginationWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const AllProposalsTypography = styled("h2")`
  font-size: 24px;
  line-height: 28px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 16px;
  }
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
    createProposal,
    setCreateProposal,
    itemsCount,
    currentPage,
    handlePageChange,
  } = useAllProposals();
  const { isMobile } = useSharedContext();

  return (
    <>
      <Grid container spacing={isMobile ? 1 : 3}>
        {useMemo(
          () =>
            !isMobile ? (
              <PageHeader
                title="Governance"
                description={`Participate in Fathom Governance to determine the future of the protocol. <br /> All actions require voting power (vFTHM). <br /> Voting power can be accrued by staking your FTHM tokens in DAO Staking.`}
              />
            ) : null,
          [isMobile]
        )}
        <ProposalFilters
          search={search}
          setSearch={setSearch}
          time={time}
          setTime={setTime}
          proposals={proposals}
          setProposals={setProposals}
          setCreateProposal={setCreateProposal}
        />
        <Grid item xs={12}>
          <AllProposalsTypography>All proposals</AllProposalsTypography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={1}>
            {useMemo(
              () =>
                fetchProposalsPending ? (
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      Loading all proposals <CircularProgress size={20} />
                    </Typography>
                  </Grid>
                ) : fetchedProposals.length ? (
                  fetchedProposals.map((proposal: IProposal, index: number) => (
                    <ViewAllProposalItem
                      proposal={proposal}
                      key={proposal.proposalId}
                      index={index}
                    />
                  ))
                ) : (
                  <Grid item xs={12}>
                    <NoResults>No opened any proposals</NoResults>
                  </Grid>
                ),
              [fetchedProposals, fetchProposalsPending]
            )}
            {!fetchProposalsPending && fetchedProposals.length > 0 && (
              <Grid item xs={12}>
                <PaginationWrapper>
                  <Pagination
                    count={Math.ceil(itemsCount / COUNT_PER_PAGE)}
                    page={currentPage}
                    onChange={handlePageChange}
                  />
                </PaginationWrapper>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      {createProposal && <Propose onClose={() => setCreateProposal(false)} />}
    </>
  );
};

export default AllProposalsView;
