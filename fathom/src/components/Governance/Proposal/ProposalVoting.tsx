import React, { FC } from "react";
import { styled } from "@mui/material/styles";
import MuiLinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import {
  ImageSrc,
  ProposalItemStatus,
} from "components/Governance/ViewAllProposalItem";
import { ProposalStatus } from "helpers/Constants";
import { VotingEndedButton } from "components/AppComponents/AppButton/AppButton";
import useProposalContext from "context/proposal";


const ProposalStatusBox = styled(Box)`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
`;

function LinearProgress(props: LinearProgressProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%" }}>
        <MuiLinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}

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

const ProposalVoting = () => {
  const {
    hasVoted,
    votePending,
    forVotes,
    abstainVotes,
    againstVotes,

    vote,

    fetchedTotalVotes,
    status,
  } = useProposalContext();

  return (
    <Grid item xs={12} md={4} lg={4}>
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
                  {Math.round((100 * againstVotes) / fetchedTotalVotes || 0)}%
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
                  {Math.round((100 * abstainVotes) / fetchedTotalVotes || 0)}%
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
  );
};

export default ProposalVoting;
