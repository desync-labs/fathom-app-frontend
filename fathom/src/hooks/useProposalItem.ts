import useMetaMask from "context/metamask";
import { useNavigate, useParams } from "react-router-dom";
import { useStores } from "stores";
import { useCallback, useEffect, useState } from "react";
import { Constants } from "helpers/Constants";

const useProposalItem = () => {
  const { account, chainId } = useMetaMask()!;
  const [isDone] = useState(false);

  const { _proposalId } = useParams();
  const { proposalStore } = useStores();
  const navigate = useNavigate();
  const [votePending, setVotePending] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false)

  const fetchData = useCallback(async () => {
    if (_proposalId && account) {
      const [hasVoted] = await Promise.all([
        proposalStore.hasVoted(_proposalId, account),
        proposalStore.fetchProposal(_proposalId, account),
        proposalStore.fetchProposalState(_proposalId, account),
        proposalStore.fetchProposalVotes(_proposalId, account),
      ])

      setHasVoted(hasVoted!)
    }
  }, [proposalStore, _proposalId, account, setHasVoted])

  useEffect(() => {
    fetchData()
  }, [fetchData]);

  const toStatus = useCallback((_num: string) => {
    return Constants.Status[parseInt(_num)];
  }, []);

  const getTitle = useCallback((_string: string) => {
    if (_string && _string.includes("---------------")) {
      return _string.split("----------------")[0];
    } else {
      return "";
    }
  }, []);

  const getDescription = useCallback((_string: string) => {
    if (_string && _string.includes("---------------")) {
      return _string.split("----------------")[1];
    } else {
      return "";
    }
  }, []);

  const handleFor = useCallback(async () => {
    try {
      if (typeof _proposalId === "string") {
        setVotePending("for");
        await proposalStore.castVote(_proposalId, account, "1");
        setHasVoted(true)
      }
    } catch (err) {
      console.log(err);
    }
    setVotePending(null);
  }, [_proposalId, proposalStore, account, setVotePending, setHasVoted]);

  const handleAgainst = useCallback(async () => {
    try {
      if (typeof _proposalId === "string") {
        setVotePending("against");
        await proposalStore.castVote(_proposalId, account, "0");
        setHasVoted(true)
      }
    } catch (err) {
      console.log(err);
    }
    setVotePending(null);
  }, [_proposalId, proposalStore, account, setVotePending, setHasVoted]);

  const handleAbstain = useCallback(async () => {
    try {
      if (typeof _proposalId === "string") {
        setVotePending("abstain");
        await proposalStore.castVote(_proposalId, account, "2");
        setHasVoted(true)
      }
    } catch (err) {
      console.log(err);
    }
    setVotePending(null);
  }, [_proposalId, proposalStore, account, setVotePending, setHasVoted]);

  const back = useCallback(() => {
    navigate("/dao/proposals");
  }, [navigate]);

  return {
    hasVoted,
    votePending,
    isDone,
    account,
    chainId,
    _proposalId,
    handleAbstain,
    handleAgainst,
    handleFor,

    getTitle,
    getDescription,
    toStatus,

    fetchedProposals: proposalStore.fetchedProposals,
    fetchedProposal: proposalStore.fetchedProposal,

    forVotes: proposalStore.fetchedVotes.forVotes,
    abstainVotes: proposalStore.fetchedVotes.abstainVotes,
    againstVotes: proposalStore.fetchedVotes.againstVotes,
    fetchedTotalVotes: proposalStore.fetchedTotalVotes,

    fetchedProposalState: proposalStore.fetchedProposalState,
    back,
  };
};

export default useProposalItem;
