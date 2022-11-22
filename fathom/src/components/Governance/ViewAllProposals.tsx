import {
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import IProposal from "stores/interfaces/IProposal";
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { PageHeader } from "components/Dashboard/PageHeader";
import { useAllProposals } from "hooks/useAllProposals";
import ViewAllProposalItem from "components/Governance/ViewAllProposalItem";
import Propose from "components/Governance/Propose";
import ProposalFilters from "components/Governance/ProposalFilters";

const AllProposalsView = observer(() => {
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
  } = useAllProposals();

  return (
    <>
      <Grid container spacing={3}>
        {useMemo(
          () => (
            <PageHeader
              title="Governance"
              description={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget tristique malesuada pulvinar commodo. Euismod massa, dis metus mattis porttitor ac est quis. Ut quis cursus ac nunc, aliquam curabitur nisl amet. Elit etiam dignissim orci. If this is the first-time you’re here, please visit our Whitepaper."
              }
            />
          ),
          []
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
          <Typography
            component={"h2"}
            sx={{ fontSize: "24px", lineHeight: "28px" }}
          >
            All proposals
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={1}>
            {fetchProposalsPending ? (
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  Loading all proposals <CircularProgress size={20} />
                </Typography>
              </Grid>
            ) : (
              fetchedProposals.map((proposal: IProposal, index: number) => (
                <ViewAllProposalItem
                  proposal={proposal}
                  key={proposal.proposalId}
                  index={index}
                />
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
      {createProposal && <Propose onClose={() => setCreateProposal(false)} />}
    </>
  );
});

export default AllProposalsView;
