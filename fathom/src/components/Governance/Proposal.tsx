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

import {
  ProposalItemStatus,
  ImageSrc,
} from "components/Governance/ViewAllProposalItem";
import StakingCountdown from "../Staking/StakingCountdown";
import { secondsToTime } from "utils/secondsToTime";
import { ProposalStatus } from "helpers/Constants";
import { useWeb3React } from "@web3-react/core";
import { getAccountUrl } from "utils/exporer";
import { ChainId } from "connectors/networks";

import BackSrc from "assets/svg/back.svg";
import Web3 from "web3";

const BackIcon = () => (
  <Icon sx={{ height: "21px" }}>
    <img alt="staking-icon" src={BackSrc} />
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

const ActionLabel = styled(Box)`
  color: #7d91b5;
  font-weight: 700;
  font-size: 13px;
  line-height: 16px;
`;

const ActionWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 7px;
  justify-content: start;
`;

const TimeslotInProgress = styled(Box, {
  shouldForwardProp: (prop) => prop !== "lessTimeLeft" && prop !== "isDone",
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

const ProposalStatusBox = styled(Box)`
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
  vote: (support: string) => void;
  votePending: string;
};

const Buttons: FC<ButtonsProps> = ({
  hasVoted,
  fetchedProposalState,
  votePending,
  vote,
}) => {
  if (fetchedProposalState !== ProposalStatus.OpenToVote) {
    return <VotingEndedButton disabled={true}>Voting Ended</VotingEndedButton>;
  }

  if (hasVoted) {
    return (
      <VotingEndedButton disabled={true}>
        You have already voted.
      </VotingEndedButton>
    );
  }

  return (
    <VoteButtonGroup variant="outlined">
      <Button onClick={() => vote("1")}>
        {votePending === "1" ? <CircularProgress size={25} /> : "For"}
      </Button>
      <Button onClick={() => vote("0")}>
        {votePending === "0" ? <CircularProgress size={25} /> : "Against"}
      </Button>
      <Button onClick={() => vote("2")}>
        {votePending === "2" ? <CircularProgress size={25} /> : "Abstain"}
      </Button>
    </VoteButtonGroup>
  );
};

const ProposalView = observer(() => {
  const { chainId } = useWeb3React();
  const {
    hasVoted,
    votePending,

    getTitleDescription,

    forVotes,
    abstainVotes,
    againstVotes,

    vote,

    fetchedTotalVotes,

    back,
    status,

    fetchedProposal,

    submitTime,
    votingStartsTime,
    votingEndTime,

    secondsLeft,
  } = useProposalItem();

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
                  {getTitleDescription(fetchedProposal.description, 0)}
                </ProposalTitle>
              </Grid>
              <Grid item xs={12}>
                <TimeslotContainer container gap={2}>
                  <Grid item xs={3}>
                    <TimeslotTitle>Submit time:</TimeslotTitle>
                    <TimeslotValue>{submitTime}</TimeslotValue>
                  </Grid>
                  <Grid item xs={3}>
                    <TimeslotTitle>Voting starts:</TimeslotTitle>
                    <TimeslotValue>{votingStartsTime}</TimeslotValue>
                  </Grid>
                  <Grid item xs={5}>
                    <TimeslotTitle>Voting ends:</TimeslotTitle>
                    <TimeslotValue>
                      {secondsLeft ? "in " : null}
                      <TimeslotInProgress
                        isDone={secondsLeft <= 0}
                        lessTimeLeft={secondsLeft > 0 && secondsLeft < 15 * 60}
                        component="span"
                      >
                        {secondsLeft > 0 ? (
                          <StakingCountdown
                            timeObject={secondsToTime(secondsLeft)}
                          />
                        ) : (
                          votingEndTime
                        )}
                      </TimeslotInProgress>
                    </TimeslotValue>
                  </Grid>
                </TimeslotContainer>
              </Grid>
              {!!getTitleDescription(fetchedProposal.description, 1) && (
                <Grid item xs={12} sx={{ padding: "24px 24px 12px 24px" }}>
                  <ProposalLabel>Description</ProposalLabel>
                  <ProposalDescription>
                    {getTitleDescription(fetchedProposal.description, 1)}
                  </ProposalDescription>
                </Grid>
              )}
              {fetchedProposal.targets &&
                fetchedProposal.targets.length &&
                !Web3.utils.toBN(fetchedProposal.targets[0]).isZero() && (
                  <Grid item xs={12} sx={{ padding: "12px 24px" }}>
                    <ProposalLabel>Action</ProposalLabel>
                    <ProposalDescription>
                      <ActionWrapper>
                        <ActionLabel>Targets: </ActionLabel>
                        {fetchedProposal.targets.join(", ")}
                      </ActionWrapper>
                      <ActionWrapper>
                        <ActionLabel>Values: </ActionLabel>
                        {fetchedProposal.values.join(", ")}
                      </ActionWrapper>
                      <ActionWrapper>
                        <ActionLabel>Call Data:</ActionLabel>{" "}
                        {fetchedProposal.calldatas.join(", ")}
                      </ActionWrapper>
                    </ProposalDescription>
                  </Grid>
                )}
              {/*<Grid item xs={12} sx={{ padding: "12px 24px" }}>*/}
              {/*  <ProposalLabel>Discussion</ProposalLabel>*/}
              {/*  <ProposalDescription>*/}
              {/*    <a href="/">Discord / Forum / Medium / etc...</a>*/}
              {/*  </ProposalDescription>*/}
              {/*</Grid>*/}
              <Grid item xs={12} sx={{ padding: "12px 24px 24px 24px" }}>
                <ProposalLabel>Proposer</ProposalLabel>
                <ProposalDescription>
                  <a
                    target="_blank"
                    href={getAccountUrl(
                      fetchedProposal.proposer,
                      chainId as ChainId
                    )}
                  >
                    {fetchedProposal.proposer}
                  </a>
                </ProposalDescription>
              </Grid>
            </Grid>
          </AppPaper>
        </Grid>

        <Grid item xs={4} md={4} lg={4}>
          <AppPaper sx={{ padding: "24px" }}>
            <Box sx={{ width: "100%" }}>
              <ProposalStatusBox>Proposal Status</ProposalStatusBox>
              <ProposalItemStatus
                className={status?.toLowerCase()}
                sx={{ margin: "10px 0" }}
              >
                {["Defeated", "Succeeded"].includes(status!) ? (
                  <img src={ImageSrc[status!]} alt={status} />
                ) : null}
                {status}
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
              fetchedProposalState={status!}
              vote={vote}
              votePending={votePending!}
            />
          </AppPaper>
        </Grid>
      </Grid>
    </Container>
  );
});

export default ProposalView;
