import Xdc3 from "xdc3";
import { ProposalVotes } from "../models/IProposal";

export default interface IProposalService {
  createProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    library: Xdc3
  ): Promise<number|Error>;

  castVote(
    proposalId: string,
    account: string,
    support: string,
    library: Xdc3
  ): Promise<number|Error>;

  executeProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    library: Xdc3
  ): Promise<number|Error>;

  queueProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    library: Xdc3
  ): Promise<number|Error>;

  viewProposalState(
    proposalId: string,
    account: string,
    library: Xdc3
  ): Promise<string>;

  nextAcceptableProposalTimestamp(
    account: string,
    library: Xdc3
  ): Promise<number>;

  getVBalance(account: string, library: Xdc3): Promise<number>;

  hasVoted(
    proposalId: string,
    account: string,
    library: Xdc3
  ): Promise<boolean>;

  quorum(blockNumber: string, library: Xdc3): Promise<number>;

  proposalVotes(proposalId: string, library: Xdc3): Promise<ProposalVotes>;

  proposalThreshold(library: Xdc3): Promise<number>;
}
