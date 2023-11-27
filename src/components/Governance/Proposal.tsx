import React from "react";
import { Grid, Icon, Container } from "@mui/material";
import { BackToProposalsButton } from "components/AppComponents/AppButton/AppButton";
import ProposalInfo from "components/Governance/Proposal/ProposalInfo";
import ProposalVoting from "components/Governance/Proposal/ProposalVoting";

import useProposalContext from "context/proposal";

import BackSrc from "assets/svg/back.svg";

const BackIcon = () => (
  <Icon sx={{ height: "21px" }}>
    <img alt="staking-icon" src={BackSrc} />
  </Icon>
);

const ProposalView = () => {
  const { back, isMobile } = useProposalContext();

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}
    >
      <Grid container spacing={isMobile ? 1 : 5}>
        <Grid item xs={12}>
          <BackToProposalsButton onClick={back}>
            <BackIcon />
            Back to All Proposals
          </BackToProposalsButton>
        </Grid>
        {isMobile && <ProposalVoting />}
        <ProposalInfo />
        {!isMobile && <ProposalVoting />}
      </Grid>
    </Container>
  );
};

export default ProposalView;
