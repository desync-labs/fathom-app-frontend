import { Container, Grid } from "@mui/material";
import ProposalInfo from "components/Governance/Proposal/ProposalInfo";
import ProposalVoting from "components/Governance/Proposal/ProposalVoting";
import useSharedContext from "context/shared";
import ProposalViewTopBar from "components/Governance/Proposal/ProposalViewTopBar";
import ProposalHistory from "./Proposal/ProposalHistory";

const ProposalView = () => {
  const { isMobile } = useSharedContext();

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4, px: isMobile ? 0 : 2 }}
    >
      <ProposalViewTopBar />
      <Grid container>
        <Grid item xs={7.8}>
          <ProposalInfo />
        </Grid>
        <Grid xs={0.2}></Grid>
        <Grid item xs={4}>
          <ProposalVoting />
          <ProposalHistory />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProposalView;
