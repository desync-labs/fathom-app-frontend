import ProposalViewTopBar, {
  ProposalViewTopBarVariant,
} from "./Proposal/ProposalViewTopBar";
import { Container } from "@mui/material";
import useSharedContext from "context/shared";
import ProposalDraftInfo from "components/Governance/ProposalDraft/ProposalDraftInfo";

const ProposalDraftView = () => {
  const { isMobile } = useSharedContext();
  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4, px: isMobile ? 1 : 2 }}
    >
      <ProposalViewTopBar variant={ProposalViewTopBarVariant.DraftProposal} />
      <ProposalDraftInfo />
    </Container>
  );
};

export default ProposalDraftView;
