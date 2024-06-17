import useConnector from "context/connector";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProposalStatus, XDC_BLOCK_TIME } from "utils/Constants";
import { useServices } from "context/services";
import { IProposal } from "fathom-sdk";
import BigNumber from "bignumber.js";

const useViewProposalItem = (proposal: IProposal) => {
  const { chainId, account, library } = useConnector();
  const [status, setStatus] = useState<ProposalStatus>();
  const { proposalService } = useServices();

  const [timestamp, setTimestamp] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const [quorumError, setQuorumError] = useState<boolean>(false);

  const getTimestamp = useCallback(async () => {
    const currentBlock = await library.getBlockNumber();
    let endTimestamp;

    if (BigNumber(currentBlock).isLessThanOrEqualTo(proposal.startBlock)) {
      const blockData = await library.getBlock(currentBlock);
      const timestamp = BigNumber(blockData.timestamp).plus(
        BigNumber(proposal.startBlock)
          .minus(currentBlock)
          .multipliedBy(XDC_BLOCK_TIME)
      );
      endTimestamp = timestamp
        .plus(
          BigNumber(proposal.endBlock)
            .minus(proposal.startBlock)
            .multipliedBy(XDC_BLOCK_TIME)
        )
        .toNumber();
    } else if (BigNumber(currentBlock).isLessThan(proposal.endBlock)) {
      const blockData = await library.getBlock(currentBlock);
      const timestamp = BigNumber(blockData.timestamp);
      endTimestamp = timestamp
        .plus(
          BigNumber(proposal.endBlock)
            .minus(currentBlock)
            .multipliedBy(XDC_BLOCK_TIME)
        )
        .toNumber();
    } else {
      const blockData = await library.getBlock(Number(proposal.endBlock));
      endTimestamp = blockData.timestamp;
    }

    const now = Date.now() / 1000;
    setTimestamp(endTimestamp);

    if (BigNumber(endTimestamp).minus(now).isLessThanOrEqualTo(0)) {
      return setSeconds(0);
    } else {
      setSeconds(endTimestamp - now);
    }
  }, [proposal, library, setSeconds, setTimestamp]);

  const checkProposalVotesAndQuorum = useCallback(async () => {
    const [totalVotes, quorum] = await Promise.all([
      proposalService.proposalVotes(proposal.proposalId),
      proposalService.quorum(proposal.startBlock),
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
  }, [proposalService, proposal]);

  const fetchProposalState = useCallback(async () => {
    const [status, currentBlock] = await Promise.all([
      proposalService.viewProposalState(proposal.proposalId),
      library.getBlockNumber(),
    ]);
    /**
     * If proposal expired but state is not updated on chain
     */
    if (
      BigNumber(currentBlock).isGreaterThan(proposal.endBlock) &&
      [0, 1].includes(status)
    ) {
      setStatus((Object.values(ProposalStatus) as any)["6"]);
    } else {
      setStatus((Object.values(ProposalStatus) as any)[status]);
    }
  }, [proposalService, proposal, account, library]);

  useEffect(() => {
    library && getTimestamp();
  }, [proposal, chainId, account, library, getTimestamp]);

  useEffect(() => {
    fetchProposalState();
  }, [proposal, fetchProposalState]);

  useEffect(() => {
    if (status && status === ProposalStatus.Defeated) {
      checkProposalVotesAndQuorum();
    }
  }, [status, proposal, checkProposalVotesAndQuorum]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (seconds > 0) {
      timeout = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else if (seconds <= 0 && chainId) {
      timeout = setTimeout(() => {
        fetchProposalState();
      }, 2000);
    }

    return () => timeout && clearTimeout(timeout);
  }, [seconds, chainId, setSeconds, fetchProposalState]);

  const proposalTitle = useMemo(() => {
    const title = proposal.description.split("----------------")[0];
    return title.substring(0, 50) + (title.length > 50 ? "... " : "");
  }, [proposal.description]);

  return {
    quorumError,
    proposalTitle,
    timestamp,
    seconds,
    status,
  };
};

export default useViewProposalItem;
