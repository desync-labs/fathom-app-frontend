import { useCallback, useEffect, useState, useMemo } from "react";
import useMetaMask from "context/metamask";
import { useNavigate, useParams } from "react-router-dom";
import { useStores } from "stores";
import { ProposalStatus, XDC_BLOCK_TIME } from "helpers/Constants";
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

  const [status, setStatus] = useState<string>();

  const [votingStartsTime, setVotingStartsTime] = useState<string | null>(null);
  const [votingEndTime, setVotingEndTime] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery(GOVERNANCE_PROPOSAL_ITEM, {
    variables: {
      id: _proposalId,
    },
    context: { clientName: "governance" },
  });

  const fetchHasVoted = useCallback(async () => {
    if (data && data.proposal && account) {
      const hasVoted = await proposalStore.hasVoted(
        data.proposal.proposalId,
        account
      );
      setHasVoted(hasVoted!);
    }
  }, [proposalStore, data, account, setHasVoted]);

  const fetchStatus = useCallback(async () => {
    if (data && data.proposal && account) {
      const status = await proposalStore.fetchProposalState(
        data.proposal.proposalId,
        account
      );
      // @ts-ignore
      setStatus(Object.values(ProposalStatus)[status]);
    }
  }, [proposalStore, data, account, setStatus]);

  const getVotingStartsTime = useCallback(async () => {
    if (data && data.proposal) {
      const { timestamp } = await Web3Utils.getWeb3Instance(
        chainId
      ).eth.getBlock(data.proposal.startBlock);

      return setVotingStartsTime(new Date(timestamp * 1000).toLocaleString());
    }
  }, [data, chainId, setVotingStartsTime]);

  const getVotingEndTime = useCallback(async () => {
    if (data && data.proposal) {
      const { timestamp } = await Web3Utils.getWeb3Instance(
        chainId
      ).eth.getBlock(data.proposal.startBlock);

      const endTimestamp =
        timestamp +
        (Number(data.proposal.endBlock) - Number(data.proposal.startBlock)) *
          XDC_BLOCK_TIME;

      const now = Date.now() / 1000;

      if (endTimestamp - now <= 0) {
        setVotingEndTime(new Date(endTimestamp * 1000).toLocaleString());
        const status = await proposalStore.fetchProposalState(
          data.proposal.proposalId,
          account
        );
        // @ts-ignore
        setStatus(Object.values(ProposalStatus)[status]);
        return setSeconds(0);
      } else {
        setSeconds(endTimestamp - now);
      }
    }
  }, [proposalStore, data, chainId, account, setVotingEndTime, setStatus]);

  useEffect(() => {
    if (data && data.proposal && account) {
      fetchHasVoted();
      fetchStatus();
    }
  }, [data, account, fetchHasVoted, fetchStatus]);

  useEffect(() => {
    if (data && data.proposal) {
      getVotingStartsTime();
      getVotingEndTime();
    }
  }, [data, getVotingStartsTime, getVotingEndTime]);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      fetchStatus();
    } else {
      setTimeout(() => {
        console.log('getVotingEndTime')
        getVotingEndTime();
      }, 2000);
    }
  }, [seconds, setSeconds, getVotingEndTime, fetchStatus]);

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
        setVotePending(support);
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
