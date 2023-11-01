import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GOVERNANCE_PROPOSAL_ITEM } from "apollo/queries";
import { useStores } from "context/services";
import { ProposalStatus, XDC_BLOCK_TIME } from "helpers/Constants";
import IProposal from "services/interfaces/IProposal";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { useMediaQuery, useTheme } from "@mui/material";
import BigNumber from "bignumber.js";

const useProposalItem = () => {
  const { account, chainId, library } = useConnector()!;
  const navigate = useNavigate();

  const { _proposalId } = useParams();
  const { proposalService } = useStores();

  const [votePending, setVotePending] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [quorumError, setQuorumError] = useState<boolean>(false);

  const [seconds, setSeconds] = useState<number>(0);

  const [status, setStatus] = useState<string>();

  const [votingStartsTime, setVotingStartsTime] = useState<string | null>(null);
  const [votingEndTime, setVotingEndTime] = useState<string | null>(null);

  const { syncDao, prevSyncDao, setLastTransactionBlock } = useSyncContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, loading, refetch } = useQuery(GOVERNANCE_PROPOSAL_ITEM, {
    variables: {
      id: _proposalId,
    },
    context: { clientName: "governance" },
  });

  useEffect(() => {
    if (syncDao && !prevSyncDao) {
      refetch();
    }
  }, [syncDao, prevSyncDao, refetch]);

  const fetchHasVoted = useCallback(async () => {
    const hasVoted = await proposalService.hasVoted(
      data.proposal.proposalId,
      account,
      library
    );
    setHasVoted(hasVoted!);
  }, [proposalService, data, account, library, setHasVoted]);

  const fetchStatus = useCallback(async () => {
    if (data && data.proposal && account) {
      const status = await proposalService.viewProposalState(
        data.proposal.proposalId,
        account,
        library
      );
      // @ts-ignore
      setStatus(Object.values(ProposalStatus)[status]);
    }
  }, [proposalService, data, account, library, setStatus]);

  const getVotingStartsTime = useCallback(async () => {
    if (data && data.proposal) {
      const currentBlock = await library.eth.getBlockNumber();
      let timestamp;

      if (BigNumber(currentBlock).isLessThan(data.proposal.startBlock)) {
        const blockData = await library.eth.getBlock(currentBlock);
        timestamp = BigNumber(blockData.timestamp)
          .plus(BigNumber(data.proposal.startBlock)
            .minus(currentBlock)
            .multipliedBy(XDC_BLOCK_TIME))
      } else {
        const blockData = await library.eth.getBlock(
          data.proposal.startBlock
        );
        timestamp = BigNumber(blockData.timestamp);
      }

      return setVotingStartsTime(new Date(timestamp.toNumber() * 1000).toLocaleString());
    }
  }, [data, library, setVotingStartsTime]);

  const getVotingEndTime = useCallback(async () => {
    if (data && data.proposal && chainId) {
      const currentBlock = await library.eth.getBlockNumber();
      let timestamp;

      if (Number(currentBlock) < Number(data.proposal.startBlock)) {
        const blockData = await library.eth.getBlock(currentBlock);
        timestamp = BigNumber(blockData.timestamp)
          .plus(BigNumber(data.proposal.startBlock)
            .minus(currentBlock)
            .multipliedBy(XDC_BLOCK_TIME));
      } else {
        const blockData = await library.eth.getBlock(
          data.proposal.startBlock
        );
        timestamp = BigNumber(blockData.timestamp);
      }

      const endTimestamp = timestamp
        .plus(BigNumber(data.proposal.endBlock).minus(data.proposal.startBlock))
        .multipliedBy(XDC_BLOCK_TIME)
        .toNumber();

      const now = Date.now() / 1000;

      if (endTimestamp - now <= 0) {
        setVotingEndTime(new Date(endTimestamp * 1000).toLocaleString());
        const status = await proposalService.viewProposalState(
          data.proposal.proposalId,
          account,
          library
        );
        // @ts-ignore
        setStatus(Object.values(ProposalStatus)[status]);
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
      proposalService.proposalVotes(data.proposal.proposalId, library),
      proposalService.quorum(data.proposal.startBlock, library),
    ]);

    const { abstainVotes, forVotes } = totalVotes;

    if (BigNumber(quorum!).isLessThan(BigNumber(abstainVotes).plus(forVotes))) {
      setQuorumError(false);
    } else {
      setQuorumError(true);
    }
  }, [proposalService, data?.proposal, library]);

  useEffect(() => {
    if (data && data.proposal && account) {
      fetchHasVoted();
      fetchStatus();
    }
  }, [data, account, fetchHasVoted, fetchStatus]);

  useEffect(() => {
    if (chainId && data && data.proposal) {
      getVotingStartsTime();
      getVotingEndTime();
    }
  }, [data, chainId, getVotingStartsTime, getVotingEndTime]);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      if (seconds % 2 < 1) {
        fetchStatus();
      }
    } else {
      setTimeout(() => {
        getVotingEndTime();
      }, 1500);

      setTimeout(() => {
        fetchStatus();
      }, 3000);
    }
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
          _proposalId!,
          account,
          support,
          library
        );
        setLastTransactionBlock(blockNumber);
        setHasVoted(true);
      } catch (err) {
        console.log(err);
      }
      setVotePending(null);
    },
    [
      _proposalId,
      proposalService,
      account,
      library,
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

  return {
    isMobile,
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
    quorumError,
    secondsLeft: seconds,
  };
};

export default useProposalItem;
