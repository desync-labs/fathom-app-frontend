import { Grid } from "@mui/material";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Dispatch, FC, memo } from "react";
import { styled } from "@mui/material/styles";

// const ProposalSelect = styled(Select)`
//   padding: 8px 12px;
//   gap: 8px;
//   height: 40px;
//   background: #253656;
//   border: 1px solid #324567;
//   border-radius: 8px;
//   width: 100%;
// `;

type ProposalFiltersType = {
  search: string;
  setSearch: Dispatch<string>;
  time: string;
  setTime: Dispatch<string>;
  proposals: string;
  setProposals: Dispatch<string>;
  setCreateProposal: Dispatch<boolean>;
};

const AddProposalButton = styled(ButtonPrimary)`
  float: right;
  padding: 8px 40px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    margin-top: 10px;
  }
`;

const ProposalFilters: FC<ProposalFiltersType> = ({
  /*search,
  setSearch,
  time,
  setTime,
  proposals,
  setProposals,*/
  setCreateProposal,
}) => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={1} alignItems={"center"}>
        {/*
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
            onChange={(event: SelectChangeEvent) => {
              setProposals(event.target.value);
            }}
          >
            <MenuItem value="all">All proposals</MenuItem>
            <MenuItem value={1}>All proposals 1</MenuItem>
            <MenuItem value={2}>All proposals 2</MenuItem>
          </ProposalSelect>
        </Grid>
        */}
        <Grid item xs={12}>
          <AddProposalButton onClick={() => setCreateProposal(true)}>
            <AddCircleIcon
              sx={{
                color: "#005C55",
                fontSize: "16px",
                marginRight: "7px",
              }}
            />
            Create a proposal
          </AddProposalButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(ProposalFilters);
