import { FC } from "react";
import { styled } from "@mui/material/styles";
import MuiLinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { ProposalStatus } from "utils/Constants";
import useProposalContext from "context/proposal";
import useSharedContext from "context/shared";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import {
  ImageSrc,
  ProposalItemStatus,
} from "components/Governance/ViewAllProposalItem";
import { VotingEndedButton } from "components/AppComponents/AppButton/AppButton";
import WalletConnectBtn from "components/Common/WalletConnectBtn";

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

const ProposalDetailsStatus = styled(ProposalItemStatus)`
  max-width: 100%;
`;

type ButtonsProps = {
  account: string | null | undefined;
  hasVoted: boolean;
  fetchedProposalState: string;
  vote: (support: string) => void;
  votePending: string;
};

const Buttons: FC<ButtonsProps> = ({
  account,
  hasVoted,
  fetchedProposalState,
  votePending,
  vote,
}) => {
  if (fetchedProposalState === ProposalStatus.OpenToVote && !account) {
    return <WalletConnectBtn fullwidth />;
  }

  if (fetchedProposalState === ProposalStatus.Pending) {
    return (
      <VotingEndedButton disabled={true}>
        Voting hasn't started yet
      </VotingEndedButton>
    );
  }

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
    account,
    hasVoted,
    votePending,
    forVotes,
    abstainVotes,
    againstVotes,
    vote,
    status,
    quorumError,
  } = useProposalContext();
  const { isMobile } = useSharedContext();

  return (
    <Grid item xs={12} md={4} lg={4}>
      <AppPaper sx={{ padding: isMobile ? "20px 12px 25px" : "24px" }}>
        <Box sx={{ width: "100%" }}>
          <ProposalStatusBox>Proposal Status</ProposalStatusBox>
          <ProposalDetailsStatus
            className={status?.toLowerCase()}
            sx={{ margin: "10px 0" }}
          >
            {["Defeated", "Succeeded"].includes(status as string) ? (
              <img src={ImageSrc[status as string]} alt={status} />
            ) : null}
            {quorumError ? "Voting quorum was not reached" : status}
          </ProposalDetailsStatus>
          <Box sx={{ margin: "30px 0" }}>
            <VotingWrapperBox>
              <Box>
                <Typography gutterBottom>For</Typography>
                <Typography>{Math.round(forVotes)}%</Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                color={"success"}
                value={forVotes}
              />
            </VotingWrapperBox>

            <VotingWrapperBox>
              <Box>
                <Typography gutterBottom>Against</Typography>
                <Typography>{Math.round(againstVotes)}%</Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                color={"error"}
                value={againstVotes}
              />
            </VotingWrapperBox>

            <VotingWrapperBox>
              <Box>
                <Typography gutterBottom>Abstains</Typography>
                <Typography variant={"body2"} color="text.secondary">
                  {Math.round(abstainVotes)}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                color={"info"}
                value={abstainVotes}
              />
            </VotingWrapperBox>
          </Box>
        </Box>
        <Buttons
          account={account}
          hasVoted={hasVoted}
          fetchedProposalState={status as string}
          vote={vote}
          votePending={votePending as string}
        />
      </AppPaper>
    </Grid>
  );
};

export default ProposalVoting;
