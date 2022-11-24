import React, { FC } from "react";
import { styled } from "@mui/material/styles";
import {
  Button,
  Typography,
  Grid,
  Box,
  ButtonGroup,
  Icon,
  CircularProgress,
  Container,
} from "@mui/material";
import { observer } from "mobx-react";
import MuiLinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import useProposalItem from "hooks/useProposalItem";
import {
  BackToProposalsButton,
  VotingEndedButton,
} from "components/AppComponents/AppButton/AppButton";

import backSrc from "assets/svg/back.svg";

import {
  ProposalItemStatus,
  ImageSrc,
} from "components/Governance/ViewAllProposalItem";

const BackIcon = () => (
  <Icon sx={{ height: "21px" }}>
    <img alt="staking-icon" src={backSrc} />
  </Icon>
);

function LinearProgress(props: LinearProgressProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%" }}>
        <MuiLinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}

const ProposalTitle = styled(Typography)`
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  margin-bottom: 20px;
`;

const TimeslotContainer = styled(Grid)`
  border-bottom: 1px solid #253656;
  padding: 20px 24px 30px;
`;

const TimeslotTitle = styled(Typography)`
  text-transform: uppercase;
  font-weight: 700;
  font-size: 13px;
  line-height: 16px;
  color: #7d91b5;
`;

const TimeslotValue = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
`;

const TimeslotInProgress = styled(Box, {
  shouldForwardProp: (prop) => prop !== "lessTimeLeft",
})<{ lessTimeLeft?: boolean; isDone?: boolean }>(
  ({ theme, lessTimeLeft, isDone }) => {
    const styles = {
      color: "#3DA329",
      fontSize: "14px",
    };

    if (lessTimeLeft) {
      styles.color = "#C37022";
    } else if (isDone) {
      styles.color = "#fff";
    }

    return styles;
  }
);

const ProposalLabel = styled(Box)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

const ProposalDescription = styled(Box)`
  color: #9fadc6;
  font-size: 14px;
  line-height: 20px;
  padding: 10px 0;
`;

const ProposalStatus = styled(Box)`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
`;

const VotingWrapperBox = styled(Box)`
  background: rgba(79, 101, 140, 0.2);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  > div > p {
    color: #fff;
  }

  > div > p:first-of-type {
    text-transform: uppercase;
    font-size: 15px;
    font-weight: bold;
  }
  ,
  > div > p:last-child {
    font-size: 14px;
  }
`;

const VoteButtonGroup = styled(ButtonGroup)`
  width: 100%;
  height: 48px;

  button {
    background: #324567;
    width: 33.33%;
    border: 1px solid #4f658c;
    font-weight: 600;
    font-size: 17px;
    line-height: 24px;
    color: #fff;
    text-transform: none;

    :hover {
      background: linear-gradient(104.04deg, #b3fff9 0%, #00dbcb 100%);
      border: 1px solid #b3fff9;
      color: #00332f;
    }
  }
`;

type ButtonsProps = {
  hasVoted: boolean;
  fetchedProposalState: string;
  handleFor: () => void;
  handleAgainst: () => void;
  handleAbstain: () => void;
  votePending: string;
};

const Buttons: FC<ButtonsProps> = ({
  hasVoted,
  fetchedProposalState,
  handleFor,
  votePending,
  handleAgainst,
  handleAbstain,
}) => {
  if (fetchedProposalState !== "1") {
    return <VotingEndedButton disabled={true}>Voting Ended</VotingEndedButton>;
  }

  if (hasVoted) {
    return <VotingEndedButton disabled={true}>You have already voted.</VotingEndedButton>;
  }

  return (
    <VoteButtonGroup variant="outlined">
      <Button onClick={handleFor}>
        {votePending === "for" ? <CircularProgress size={25} /> : "For"}
      </Button>
      <Button onClick={handleAgainst}>
        {votePending === "against" ? <CircularProgress size={25} /> : "Against"}
      </Button>
      <Button onClick={handleAbstain}>
        {votePending === "abstain" ? <CircularProgress size={25} /> : "Abstain"}
      </Button>
    </VoteButtonGroup>
  );
};

const ProposalView = observer(() => {
  const {
    hasVoted,
    votePending,
    isDone,
    handleAbstain,
    handleAgainst,
    handleFor,

    getTitle,
    getDescription,
    toStatus,

    fetchedProposal,
    forVotes,
    abstainVotes,
    againstVotes,
    fetchedTotalVotes,
    fetchedProposalState,
    back,
  } = useProposalItem();

  console.log(fetchedProposal);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <BackToProposalsButton onClick={back}>
            <BackIcon />
            Back to All Proposals
          </BackToProposalsButton>
        </Grid>
        <Grid item xs={8} md={8} lg={8}>
          <AppPaper>
            <Grid container>
              <Grid item xs={12} sx={{ padding: "24px 24px 0" }}>
                <ProposalTitle>
                  {getTitle(fetchedProposal.description)}
                </ProposalTitle>
              </Grid>
              <Grid item xs={12}>
                <TimeslotContainer container gap={2}>
                  <Grid item xs={3}>
                    <TimeslotTitle>Submit time:</TimeslotTitle>
                    <TimeslotValue>2022-09-30 05:12:49</TimeslotValue>
                  </Grid>
                  <Grid item xs={3}>
                    <TimeslotTitle>Voting starts:</TimeslotTitle>
                    <TimeslotValue>2022-09-30 05:12:49</TimeslotValue>
                  </Grid>
                  <Grid item xs={3}>
                    <TimeslotTitle>Voting ends:</TimeslotTitle>
                    <TimeslotValue>
                      {isDone ? "in" : null}
                      <TimeslotInProgress lessTimeLeft={false} component="span">
                        3d 18h 55m 34s
                      </TimeslotInProgress>
                    </TimeslotValue>
                  </Grid>
                </TimeslotContainer>
              </Grid>
              <Grid item xs={12} sx={{ padding: "24px 24px 12px 24px" }}>
                <ProposalLabel>Description</ProposalLabel>
                <ProposalDescription>
                  {getDescription(fetchedProposal.description)}
                </ProposalDescription>
              </Grid>
              <Grid item xs={12} sx={{ padding: "12px 24px" }}>
                <ProposalLabel>Action</ProposalLabel>
                <ProposalDescription>
                  Lorem ipsum dolor sit amet. Aicies. Luaicira.
                </ProposalDescription>
              </Grid>
              <Grid item xs={12} sx={{ padding: "12px 24px" }}>
                <ProposalLabel>Discussion</ProposalLabel>
                <ProposalDescription>
                  <a href="/">Discord / Forum / Medium / etc...</a>
                </ProposalDescription>
              </Grid>
              <Grid item xs={12} sx={{ padding: "12px 24px 24px 24px" }}>
                <ProposalLabel>Proposer</ProposalLabel>
                <ProposalDescription>
                  <a href="/">0xe2F4Ba7d9d0aA7f7d39075a4b4AD9c4aa605b9db</a>
                </ProposalDescription>
              </Grid>
            </Grid>
          </AppPaper>
        </Grid>

        <Grid item xs={4} md={4} lg={4}>
          <AppPaper sx={{ padding: "24px" }}>
            <Box sx={{ width: "100%" }}>
              <ProposalStatus>Proposal Status</ProposalStatus>
              <ProposalItemStatus
                className={fetchedProposal.status?.toLowerCase()}
                sx={{ margin: "10px 0" }}
              >
                {["Defeated", "Succeeded"].includes(
                  toStatus(fetchedProposalState)
                ) ? (
                  <img
                    src={ImageSrc[fetchedProposal.status]}
                    alt={fetchedProposal.status}
                  />
                ) : null}
                {toStatus(fetchedProposalState)}
              </ProposalItemStatus>
              <Box sx={{ margin: "30px 0" }}>
                <VotingWrapperBox>
                  <Box>
                    <Typography gutterBottom>For</Typography>
                    <Typography>
                      {Math.round((100 * forVotes) / fetchedTotalVotes || 0)}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    color={"success"}
                    value={(100 * forVotes) / fetchedTotalVotes || 0}
                  />
                </VotingWrapperBox>

                <VotingWrapperBox>
                  <Box>
                    <Typography gutterBottom>Against</Typography>
                    <Typography variant="body2" color="">
                      {Math.round(
                        (100 * againstVotes) / fetchedTotalVotes || 0
                      )}
                      %
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    color={"error"}
                    value={(100 * againstVotes) / fetchedTotalVotes || 0}
                  />
                </VotingWrapperBox>

                <VotingWrapperBox>
                  <Box>
                    <Typography gutterBottom>Abstains</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(
                        (100 * abstainVotes) / fetchedTotalVotes || 0
                      )}
                      %
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    color={"info"}
                    value={(100 * abstainVotes) / fetchedTotalVotes || 0}
                  />
                </VotingWrapperBox>
              </Box>
            </Box>
            <Buttons
              hasVoted={hasVoted}
              fetchedProposalState={fetchedProposalState}
              handleFor={handleFor}
              handleAbstain={handleAbstain}
              handleAgainst={handleAgainst}
              votePending={votePending!}
            />
          </AppPaper>
        </Grid>
      </Grid>
    </Container>
  );
});

export default ProposalView;
