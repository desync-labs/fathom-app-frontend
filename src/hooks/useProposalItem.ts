import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GOVERNANCE_PROPOSAL_ITEM } from "apollo/queries";
import { useServices } from "context/services";
import { ProposalStatus, XDC_BLOCK_TIME } from "utils/Constants";
import { IProposal } from "fathom-sdk";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import BigNumber from "bignumber.js";

const useProposalItem = () => {
  const { account, chainId, library } = useConnector();
  const navigate = useNavigate();

  const { _proposalId } = useParams();
  const { proposalService } = useServices();

  const [votePending, setVotePending] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [quorumError, setQuorumError] = useState<boolean>(false);

  const [seconds, setSeconds] = useState<number>(0);

  const [status, setStatus] = useState<string>();

  const [votingStartsTime, setVotingStartsTime] = useState<string | null>(null);
  const [votingEndTime, setVotingEndTime] = useState<string | null>(null);

  const { syncDao, prevSyncDao, setLastTransactionBlock } = useSyncContext();

  const { data, loading, refetch } = useQuery(GOVERNANCE_PROPOSAL_ITEM, {
    variables: {
      id: _proposalId,
    },
    context: { clientName: "governance", chainId },
  });

  useEffect(() => {
    if (syncDao && !prevSyncDao) {
      refetch();
    }
  }, [syncDao, prevSyncDao, refetch]);

  const fetchHasVoted = useCallback(async () => {
    const hasVoted = await proposalService.hasVoted(
      data.proposal.proposalId,
      account
    );
    setHasVoted(hasVoted);
  }, [proposalService, data, account, setHasVoted]);

  const fetchStatus = useCallback(async () => {
    if (data?.proposal) {
      const [status, currentBlock] = await Promise.all([
        proposalService.viewProposalState(data.proposal.proposalId),
        library.getBlockNumber(),
      ]);
      if (
        BigNumber(currentBlock).isGreaterThan(data?.proposal.endBlock) &&
        [0, 1].includes(status)
      ) {
        setStatus((Object.values(ProposalStatus) as any)["6"]);
      } else {
        setStatus((Object.values(ProposalStatus) as any)[status]);
      }
    }
  }, [proposalService, data, account, setStatus]);

  const getVotingStartsTime = useCallback(async () => {
    if (data?.proposal) {
      const currentBlock = await library.getBlockNumber();

      let timestamp;
      if (
        BigNumber(currentBlock).isLessThanOrEqualTo(data.proposal.startBlock)
      ) {
        const blockData = await library.getBlock(currentBlock);
        timestamp = BigNumber(blockData.timestamp).plus(
          BigNumber(data.proposal.startBlock)
            .minus(currentBlock)
            .multipliedBy(XDC_BLOCK_TIME)
        );
      } else {
        const blockData = await library.getBlock(
          Number(data.proposal.startBlock)
        );
        timestamp = BigNumber(blockData.timestamp);
      }

      return setVotingStartsTime(
        new Date(timestamp.toNumber() * 1000).toLocaleString()
      );
    }
  }, [data, library, setVotingStartsTime]);

  const getVotingEndTime = useCallback(async () => {
    if (data?.proposal && library) {
      const currentBlock = await library.getBlockNumber();
      let endTimestamp;

      if (
        BigNumber(currentBlock).isLessThanOrEqualTo(data.proposal.startBlock)
      ) {
        const blockData = await library.getBlock(currentBlock);
        const timestamp = BigNumber(blockData.timestamp).plus(
          BigNumber(data.proposal.startBlock)
            .minus(currentBlock)
            .multipliedBy(XDC_BLOCK_TIME)
        );
        endTimestamp = timestamp
          .plus(
            BigNumber(data.proposal.endBlock)
              .minus(data.proposal.startBlock)
              .multipliedBy(XDC_BLOCK_TIME)
          )
          .toNumber();
      } else if (BigNumber(currentBlock).isLessThan(data.proposal.endBlock)) {
        const blockData = await library.getBlock(currentBlock);
        const timestamp = BigNumber(blockData.timestamp);
        endTimestamp = timestamp
          .plus(
            BigNumber(data.proposal.endBlock)
              .minus(currentBlock)
              .multipliedBy(XDC_BLOCK_TIME)
          )
          .toNumber();
      } else {
        const blockData = await library.getBlock(
          Number(data.proposal.endBlock)
        );
        endTimestamp = blockData.timestamp;
      }

      const now = Date.now() / 1000;

      setVotingEndTime(new Date(endTimestamp * 1000).toLocaleString());

      if (BigNumber(endTimestamp).minus(now).isLessThanOrEqualTo(0)) {
        const status = await proposalService.viewProposalState(
          data.proposal.proposalId
        );
        setStatus((Object.values(ProposalStatus) as any)[status]);
        return setSeconds(0);
      } else {
        setSeconds(endTimestamp - now);
      }
    }
  }, [
    proposalService,
    data,
    chainId,
    account,
    library,
    setVotingEndTime,
    setStatus,
  ]);

  const checkProposalVotesAndQuorum = useCallback(async () => {
    const [totalVotes, quorum] = await Promise.all([
      proposalService.proposalVotes(data.proposal.proposalId),
      proposalService.quorum(data.proposal.startBlock),
    ]);

    const { abstainVotes, forVotes } = totalVotes;

    if (
      BigNumber(quorum.toString()).isLessThan(
        BigNumber(abstainVotes.toString()).plus(forVotes.toString())
      )
    ) {
      setQuorumError(false);
    } else {
      setQuorumError(true);
    }
  }, [proposalService, data?.proposal]);

  useEffect(() => {
    if (data?.proposal && account) {
      fetchHasVoted();
      fetchStatus();
    }
  }, [data, account, fetchHasVoted, fetchStatus]);

  useEffect(() => {
    if (library) {
      getVotingStartsTime();
      getVotingEndTime();
    }
  }, [library, getVotingStartsTime, getVotingEndTime]);

  useEffect(() => {
    let timeout1: ReturnType<typeof setTimeout>;
    let timeout2: ReturnType<typeof setTimeout>;

    if (seconds > 0) {
      timeout1 = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      if (seconds % 2 < 1) {
        fetchStatus();
      }
    } else {
      timeout1 = setTimeout(() => {
        getVotingEndTime();
      }, 1500);

      timeout2 = setTimeout(() => {
        fetchStatus();
      }, 3000);
    }

    return () => {
      timeout1 && clearTimeout(timeout1);
      timeout2 && clearTimeout(timeout2);
    };
  }, [seconds, setSeconds, getVotingEndTime, fetchStatus]);

  useEffect(() => {
    if (data?.proposal && status && status === ProposalStatus.Defeated) {
      checkProposalVotesAndQuorum();
    }
  }, [status, data?.proposal, checkProposalVotesAndQuorum]);

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
        const blockNumber = await proposalService.castVote(
          _proposalId as string,
          account,
          support
        );
        setLastTransactionBlock(blockNumber as number);
        setHasVoted(true);
      } catch (err) {
        console.log(err);
      } finally {
        setVotePending(null);
      }
    },
    [
      _proposalId,
      proposalService,
      account,
      setVotePending,
      setHasVoted,
      setLastTransactionBlock,
    ]
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

  const forVotes = useMemo(() => {
    return loading
      ? 0
      : BigNumber(data?.proposal.forVotes)
          .multipliedBy(100)
          .dividedBy(fetchedTotalVotes)
          .toNumber() || 0;
  }, [data?.proposal, loading]);

  const againstVotes = useMemo(() => {
    return loading
      ? 0
      : BigNumber(data?.proposal.againstVotes)
          .multipliedBy(100)
          .dividedBy(fetchedTotalVotes)
          .toNumber() || 0;
  }, [data?.proposal, loading]);

  const abstainVotes = useMemo(() => {
    return loading
      ? 0
      : BigNumber(data?.proposal.abstainVotes)
          .multipliedBy(100)
          .dividedBy(fetchedTotalVotes)
          .toNumber() || 0;
  }, [data?.proposal, loading]);

  return {
    hasVoted,
    votePending,
    account,
    chainId,
    _proposalId,
    vote,
    getTitleDescription,
    status,
    forVotes,
    abstainVotes,
    againstVotes,
    fetchedTotalVotes,
    fetchedProposal: loading ? ({} as IProposal) : data.proposal,
    back,
    submitTime,
    votingStartsTime,
    votingEndTime,
    quorumError,
    secondsLeft: seconds,
  };
};

export default useProposalItem;
