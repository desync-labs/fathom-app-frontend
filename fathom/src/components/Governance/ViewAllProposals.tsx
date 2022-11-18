import {
  Typography,
  Grid,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import IProposal from "stores/interfaces/IProposal";
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { PageHeader } from "components/Dashboard/PageHeader";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";

import SearchSrc from "assets/svg/search.svg";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import { useAllProposals } from "hooks/useAllProposals";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import ViewAllProposalItem from "components/Governance/ViewAllProposalItem";
import Propose from "components/Governance/Propose";

const ProposalSelect = styled(Select)`
  padding: 8px 12px;
  gap: 8px;
  height: 40px;
  background: #253656;
  border: 1px solid #324567;
  borderradius: 8px;
  width: 100%;
`;

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
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems={"center"}>
            <Grid item xs={3}>
              <AppFormInputWrapper sx={{ margin: 0 }}>
                <AppTextField
                  id="outlined-helperText"
                  placeholder="Search by ID, name, address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <AppFormInputLogo
                  sx={{ top: "10px", left: "9px" }}
                  src={SearchSrc}
                  alt="search"
                />
              </AppFormInputWrapper>
            </Grid>
            <Grid item xs={2}>
              <ProposalSelect
                value={time}
                // @ts-ignore
                onChange={(event: SelectChangeEvent) => {
                  setTime(event.target.value);
                }}
              >
                <MenuItem value="all">All time</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
              </ProposalSelect>
            </Grid>
            <Grid item xs={2}>
              <ProposalSelect
                value={proposals}
                // @ts-ignore
                onChange={(event: SelectChangeEvent) => {
                  setProposals(event.target.value);
                }}
              >
                <MenuItem value="all">All proposals</MenuItem>
                <MenuItem value={1}>All proposals 1</MenuItem>
                <MenuItem value={2}>All proposals 2</MenuItem>
              </ProposalSelect>
            </Grid>
            <Grid item xs={5}>
              <ButtonPrimary
                onClick={() => setCreateProposal(true)}
                sx={{ float: "right", padding: "8px 40px" }}
              >
                <AddCircleIcon
                  sx={{
                    color: "#005C55",
                    fontSize: "16px",
                    marginRight: "7px",
                  }}
                />
                Create a proposal
              </ButtonPrimary>
            </Grid>
          </Grid>
        </Grid>
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
