import { Container, Grid } from "@mui/material";
import ProposalInfo from "components/Governance/Proposal/ProposalInfo";
import ProposalVoting from "components/Governance/Proposal/ProposalVoting";
import useSharedContext from "context/shared";
import ProposalViewTopBar from "components/Governance/Proposal/ProposalViewTopBar";
import ProposalHistory from "components/Governance/Proposal/ProposalHistory";
import useProposalContext from "context/proposal";

const ProposalView = () => {
  const { isMobile } = useSharedContext();
  const { isLoading } = useProposalContext();

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4, px: isMobile ? 1 : 2 }}
    >
      <ProposalViewTopBar isLoading={isLoading} />
      <Grid container>
        <Grid item sm={7.8} xs={12} sx={{ mb: isMobile ? 1.25 : 0 }}>
          <ProposalInfo />
        </Grid>
        <Grid item sm={0.2} xs={12}></Grid>
        <Grid item sm={4} xs={12}>
          <ProposalVoting />
          <ProposalHistory />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProposalView;
