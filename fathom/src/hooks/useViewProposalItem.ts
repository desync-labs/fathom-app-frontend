import useConnector from "context/connector";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProposalStatus, XDC_BLOCK_TIME } from "helpers/Constants";
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
    const currentBlock = await library.eth.getBlockNumber();
    let timestamp;

    if (Number(currentBlock) < Number(proposal.startBlock)) {
      const blockData = await library.eth.getBlock(currentBlock);
      timestamp = BigNumber(blockData.timestamp).plus(
        BigNumber(proposal.startBlock)
          .minus(currentBlock)
          .multipliedBy(XDC_BLOCK_TIME)
      );
    } else {
      const blockData = await library.eth.getBlock(proposal.startBlock);
      timestamp = BigNumber(blockData.timestamp);
    }

    const endTimestamp = timestamp
      .plus(Number(proposal.endBlock) - Number(proposal.startBlock))
      .multipliedBy(XDC_BLOCK_TIME)
      .toNumber();

    const now = Date.now() / 1000;
    setTimestamp(endTimestamp);

    if (endTimestamp - now <= 0) {
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

    if (BigNumber(quorum).isLessThan(BigNumber(abstainVotes).plus(forVotes))) {
      setQuorumError(false);
    } else {
      setQuorumError(true);
    }
  }, [proposalService, proposal]);

  const fetchProposalState = useCallback(async () => {
    const status = await proposalService.viewProposalState(
      proposal.proposalId,
      account
    );
    // @ts-ignore
    setStatus(Object.values(ProposalStatus)[status]);
  }, [proposalService, proposal, account]);

  useEffect(() => {
    if (proposal && chainId && account) {
      getTimestamp();
      fetchProposalState();
    }
  }, [proposal, chainId, account, getTimestamp, fetchProposalState]);

  useEffect(() => {
    if (status && status === ProposalStatus.Defeated) {
      checkProposalVotesAndQuorum();
    }
  }, [status, proposal, checkProposalVotesAndQuorum]);

  useEffect(() => {
    if (chainId) {
      if (seconds > 0) {
        setTimeout(() => {
          setSeconds(seconds - 1);
        }, 1000);
      } else {
        setTimeout(() => {
          fetchProposalState();
        }, 2000);
      }
    }
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
