import { FC } from "react";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Divider,
  ButtonGroup,
  LinearProgress,
  linearProgressClasses,
  styled,
} from "@mui/material";
import useProposalContext from "context/proposal";
import {
  ProposalItemStatus,
  StatusIcon,
} from "components/Governance/ViewAllProposalItem";
import { VotingEndedButton } from "components/AppComponents/AppButton/AppButton";
import WalletConnectBtn from "components/Common/WalletConnectBtn";
import { BasePaper } from "components/Base/Paper/StyledPaper";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";

import BigNumber from "bignumber.js";
import { formatNumber } from "utils/format";
import { ProposalStatus } from "utils/Constants";

const VoteButtonGroup = styled(ButtonGroup)`
  width: 100%;
  height: 48px;

  button {
    background: #324567;
    width: 33.33%;
    height: 100%;
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

const VotingTitle = styled(Typography)`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
`;

const VotersLabel = styled(Typography)`
  color: #8ea4cc;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
`;

const VotersCount = styled(Typography)`
  color: #fff;
  text-align: right;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`;

const VoteProgressItem = styled(Box)`
  border-radius: 8px;
  border: 1px solid transparent;
  background: rgba(79, 101, 140, 0.2);
  cursor: pointer;
  padding: 12px;

  &:hover {
    border: 1px solid #43fff1;
  }
`;
const VoteProgressItemLabel = styled(Typography)`
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 16px;
  text-transform: uppercase;
`;

export const LinearProgressForVotes = styled(LinearProgress)(() => ({
  height: 4,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#566E99",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor: "#3DA329",
  },
}));

export const LinearProgressAgainstVoted = styled(LinearProgress)(() => ({
  height: 4,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#566E99",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor: "#F04242",
  },
}));

export const LinearProgressAbstainsVoted = styled(LinearProgress)(() => ({
  height: 4,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#566E99",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor: "#43FFF1",
  },
}));

const ProposalVoting: FC = () => {
  const {
    account,
    hasVoted,
    votePending,
    forVotes,
    abstainVotes,
    againstVotes,
    fetchedProposal,
    fetchedTotalVotes,
    vote,
    status,
    quorumError,
    vFTHMTotalSupply,
  } = useProposalContext();

  return (
    <BasePaper>
      <BaseFlexBox>
        <VotingTitle>Proposal Status</VotingTitle>
        <ProposalDetailsStatus status={status} sx={{ margin: "10px 0" }}>
          <StatusIcon status={status} />
          {quorumError ? "Voting quorum was not reached" : status}
        </ProposalDetailsStatus>
      </BaseFlexBox>
      <Divider sx={{ borderColor: "#2C4066", marginY: "12px" }} />
      <BaseFlexBox sx={{ marginBottom: "18px" }}>
        <VotersLabel>Total Voting power</VotersLabel>
        <VotersCount>
          {formatNumber(
            BigNumber(vFTHMTotalSupply)
              .dividedBy(10 ** 18)
              .toNumber()
          )}{" "}
          vFTHM
        </VotersCount>
      </BaseFlexBox>
      <BaseFlexBox>
        <VotersLabel>Total Votes</VotersLabel>
        <VotersCount>
          {formatNumber(
            BigNumber(fetchedTotalVotes)
              .dividedBy(10 ** 18)
              .toNumber()
          )}{" "}
          vFTHM
        </VotersCount>
      </BaseFlexBox>
      <BaseFlexBox
        sx={{
          flexDirection: "column",
          alignItems: "stretch",
          gap: 1,
          marginTop: "24px",
        }}
      >
        <VoteProgressItem>
          <BaseFlexBox>
            <VoteProgressItemLabel>For</VoteProgressItemLabel>
            {fetchedProposal?.forVotes && fetchedTotalVotes ? (
              <VotersCount>
                {formatNumber(
                  BigNumber(fetchedProposal.forVotes)
                    .dividedBy(10 ** 18)
                    .toNumber()
                )}{" "}
                (
                {BigNumber(fetchedProposal.forVotes / fetchedTotalVotes)
                  .multipliedBy(100)
                  .toFixed(2)}
                %)
              </VotersCount>
            ) : (
              <VotersCount>0 (0.00%)</VotersCount>
            )}
          </BaseFlexBox>
          <Box sx={{ width: "100%", marginTop: "12px" }}>
            <LinearProgressForVotes variant="determinate" value={forVotes} />
          </Box>
        </VoteProgressItem>
        <VoteProgressItem>
          <BaseFlexBox>
            <VoteProgressItemLabel>Against</VoteProgressItemLabel>
            {fetchedProposal?.againstVotes && fetchedTotalVotes ? (
              <VotersCount>
                {formatNumber(
                  BigNumber(fetchedProposal.againstVotes)
                    .dividedBy(10 ** 18)
                    .toNumber()
                )}{" "}
                (
                {BigNumber(fetchedProposal.againstVotes / fetchedTotalVotes)
                  .multipliedBy(100)
                  .toFixed(2)}
                %)
              </VotersCount>
            ) : (
              <VotersCount>0 (0.00%)</VotersCount>
            )}
          </BaseFlexBox>
          <Box sx={{ width: "100%", marginTop: "12px" }}>
            <LinearProgressAgainstVoted
              variant="determinate"
              value={againstVotes}
            />
          </Box>
        </VoteProgressItem>
        <VoteProgressItem>
          <BaseFlexBox>
            <VoteProgressItemLabel>Abstains</VoteProgressItemLabel>
            {fetchedProposal.abstainVotes && fetchedTotalVotes ? (
              <VotersCount>
                {formatNumber(
                  BigNumber(fetchedProposal.abstainVotes)
                    .dividedBy(10 ** 18)
                    .toNumber()
                )}{" "}
                (
                {BigNumber(fetchedProposal.abstainVotes / fetchedTotalVotes)
                  .multipliedBy(100)
                  .toFixed(2)}
                %)
              </VotersCount>
            ) : (
              <VotersCount>0 (0.00%)</VotersCount>
            )}
          </BaseFlexBox>
          <Box sx={{ width: "100%", marginTop: "12px" }}>
            <LinearProgressAbstainsVoted
              variant="determinate"
              value={abstainVotes}
            />
          </Box>
        </VoteProgressItem>

        <Buttons
          account={account}
          hasVoted={hasVoted}
          fetchedProposalState={status as string}
          vote={vote}
          votePending={votePending as string}
        />
      </BaseFlexBox>
    </BasePaper>
  );
};

export default ProposalVoting;
