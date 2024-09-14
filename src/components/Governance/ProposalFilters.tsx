import { Grid } from "@mui/material";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Dispatch, FC, memo } from "react";
import { styled } from "@mui/material/styles";
import { AppFormInputWrapper } from "components/AppComponents/AppForm/AppForm";
import { useNavigate } from "react-router-dom";

type ProposalFiltersType = {
  search: string;
  setSearch: Dispatch<string>;
  time: string;
  setTime: Dispatch<string>;
  proposals: string;
  setProposals: Dispatch<string>;
};

const AddProposalButton = styled(ButtonPrimary)`
  float: right;
  padding: 8px 40px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    margin-top: 10px;
  }
`;

const ProposalFilters: FC<ProposalFiltersType> = () => {
  const navigate = useNavigate();
  return (
    <Grid container spacing={1} alignItems={"center"}>
      <Grid item xs={2} sm={3}>
        <AppFormInputWrapper sx={{ margin: 0 }}>
          {/*<AppTextField*/}
          {/*  id="outlined-helperText"*/}
          {/*  placeholder="Search by ID, name, address..."*/}
          {/*  value={search}*/}
          {/*  onChange={(e) => setSearch(e.target.value)}*/}
          {/*/>*/}
          {/*<AppFormInputLogo*/}
          {/*  sx={{ top: "10px", left: "9px" }}*/}
          {/*  src={SearchSrc}*/}
          {/*  alt="search"*/}
          {/*/>*/}
        </AppFormInputWrapper>
      </Grid>
      <Grid item xs={1.5} sm={2}>
        {/*<ProposalSelect*/}
        {/*  value={time}*/}
        {/*  onChange={(event) => {*/}
        {/*    setTime(event.target.value as string);*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <MenuItem value="all">All time</MenuItem>*/}
        {/*  <MenuItem value={1}>1</MenuItem>*/}
        {/*  <MenuItem value={2}>2</MenuItem>*/}
        {/*</ProposalSelect>*/}
      </Grid>
      <Grid item xs={1.5} sm={2}>
        {/*<ProposalSelect*/}
        {/*  value={proposals}*/}
        {/*  onChange={(event) => {*/}
        {/*    setProposals(event.target.value as string);*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <MenuItem value="all">All proposals</MenuItem>*/}
        {/*  <MenuItem value={1}>All proposals 1</MenuItem>*/}
        {/*  <MenuItem value={2}>All proposals 2</MenuItem>*/}
        {/*</ProposalSelect>*/}
      </Grid>
      <Grid item xs={7} sm={5}>
        <AddProposalButton
          onClick={() => navigate("/dao/governance/proposal/create")}
        >
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
  );
};

export default memo(ProposalFilters);
