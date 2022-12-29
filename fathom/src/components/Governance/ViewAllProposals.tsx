import {
  Typography,
  Grid,
  CircularProgress,
  Pagination,
  Box,
} from "@mui/material";
import IProposal from "stores/interfaces/IProposal";
import React, { useMemo } from "react";
import { PageHeader } from "components/Dashboard/PageHeader";
import { useAllProposals } from "hooks/useAllProposals";
import ViewAllProposalItem from "components/Governance/ViewAllProposalItem";
import Propose from "components/Governance/Propose";
import ProposalFilters from "components/Governance/ProposalFilters";
import { Constants } from "helpers/Constants";
import { styled } from "@mui/material/styles";
import { NoResults } from "../AppComponents/AppBox/AppBox";

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
    isMobile,
  } = useAllProposals();

  return (
    <>
      <Grid container spacing={isMobile ? 1 : 3}>
        {useMemo(
          () =>
            !isMobile ? (
              <PageHeader
                title="Governance"
                description={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget tristique malesuada pulvinar commodo. Euismod massa, dis metus mattis porttitor ac est quis. Ut quis cursus ac nunc, aliquam curabitur nisl amet. Elit etiam dignissim orci. If this is the first-time you’re here, please visit our Whitepaper."
                }
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
                    count={Math.ceil(itemsCount / Constants.COUNT_PER_PAGE)}
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
