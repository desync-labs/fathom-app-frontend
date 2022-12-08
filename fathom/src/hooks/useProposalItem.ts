import { useCallback, useEffect, useState, useMemo } from "react";
import useMetaMask from "context/metamask";
import { useNavigate, useParams } from "react-router-dom";
import { useStores } from "stores";
import { ProposalStatus } from "helpers/Constants";
import IProposal from "stores/interfaces/IProposal";
import { useQuery } from "@apollo/client";
import { GOVERNANCE_PROPOSAL_ITEM } from "apollo/queries";
import { Web3Utils } from "helpers/Web3Utils";

const useProposalItem = () => {
  const { account, chainId } = useMetaMask()!;
  const navigate = useNavigate();

  const { _proposalId } = useParams();
  const { proposalStore } = useStores();

  const [votePending, setVotePending] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const [seconds, setSeconds] = useState<number>(0);

  const [status, setStatus] = useState<string>(ProposalStatus.Pending);

  const [votingStartsTime, setVotingStartsTime] = useState<string | null>(null);
  const [votingEndTime, setVotingEndTime] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery(GOVERNANCE_PROPOSAL_ITEM, {
    variables: {
      id: _proposalId,
    },
    context: { clientName: "governance" },
  });

  const fetchData = useCallback(async () => {
    if (data?.proposal && account) {
      const [hasVoted, status] = await Promise.all([
        proposalStore.hasVoted(data.proposal.proposalId, account),
        proposalStore.fetchProposalState(data.proposal.proposalId, account),
      ]);

      setHasVoted(hasVoted!);
      // @ts-ignore
      setStatus(Object.values(ProposalStatus)[status]);
    }
  }, [proposalStore, data?.proposal, account, setHasVoted]);

  const getVotingStartsTime = useCallback(async () => {
    if (data?.proposal) {
      const { timestamp } = await Web3Utils.getWeb3Instance(
        chainId
      ).eth.getBlock(data.proposal.startBlock);

      console.log(timestamp);

      return setVotingStartsTime(new Date(timestamp * 1000).toLocaleString());
    }

    return setVotingStartsTime(null);
  }, [data?.proposal, chainId, setVotingStartsTime]);

  const getVotingEndTime = useCallback(async () => {
    if (data?.proposal) {
      const { timestamp } = await Web3Utils.getWeb3Instance(
        chainId
      ).eth.getBlock(data.proposal.endBlock);

      const now = Date.now() / 1000;

      if (timestamp - now <= 0) {
        setVotingEndTime(new Date(timestamp * 1000).toLocaleString());
        return setSeconds(0);
      } else {
        setSeconds(timestamp - now);
      }
    }

    return setVotingStartsTime(null);
  }, [data?.proposal, chainId, setVotingEndTime]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data?.proposal) {
      getVotingStartsTime();
      getVotingEndTime();
    }
  }, [data?.proposal, getVotingStartsTime, getVotingEndTime]);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    }
  }, [seconds, setSeconds]);

  const getTitleDescription = useCallback((title: string, index: number) => {
    if (title) {
      return title.split("----------------")[index];
    } else {
      return "";
    }
  }, []);

  const vote = useCallback(
    async (support: string) => {
      try {
        setVotePending("against");
        await proposalStore.castVote(_proposalId!, account, support);
        setHasVoted(true);
        refetch();
      } catch (err) {
        console.log(err);
      }
      setVotePending(null);
    },
    [_proposalId, proposalStore, account, setVotePending, setHasVoted, refetch]
  );

  const back = useCallback(() => {
    navigate("/dao/governance");
  }, [navigate]);

  const fetchedTotalVotes = useMemo(() => {
    let sum = 0;
    if (data?.proposal) {
      ["abstainVotes", "forVotes", "againstVotes"].forEach((param) => {
        sum += Number(data.proposal[param]);
      });
    }
    return sum;
  }, [data?.proposal]);

  const submitTime = useMemo(() => {
    if (data?.proposal) {
      return new Date(
        Number(data?.proposal?.blockTimestamp) * 1000
      ).toLocaleString();
    }
    return null;
  }, [data?.proposal]);

  return {
    hasVoted,
    votePending,
    account,
    chainId,
    _proposalId,

    vote,

    getTitleDescription,
    status,

    forVotes: loading ? 0 : Number(data.proposal.forVotes),
    abstainVotes: loading ? 0 : Number(data.proposal.abstainVotes),
    againstVotes: loading ? 0 : Number(data.proposal.againstVotes),

    fetchedTotalVotes,

    fetchedProposal: loading ? ({} as IProposal) : data.proposal,
    back,

    submitTime,
    votingStartsTime,
    votingEndTime,

    secondsLeft: seconds,
  };
};

export default useProposalItem;
