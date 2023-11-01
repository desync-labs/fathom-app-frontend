import Xdc3 from "xdc3";

export default interface IProposalService {
  createProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    library: Xdc3
  ): Promise<number | Error>;

  castVote(
    proposalId: string,
    account: string,
    support: string,
    library: Xdc3
  ): Promise<number | Error>;

  executeProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    library: Xdc3
  ): Promise<number | Error>;

  queueProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    library: Xdc3
  ): Promise<number | Error>;

  viewProposalState(
    proposalId: string,
    account: string,
    library: Xdc3
  ): Promise<string> | undefined;

  nextAcceptableProposalTimestamp(
    account: string,
    library: Xdc3
  ): Promise<number> | undefined;

  getVBalance(account: string, library: Xdc3): Promise<number> | undefined;

  hasVoted(
    proposalId: string,
    account: string,
    library: Xdc3
  ): Promise<boolean> | undefined;

  quorum(blockNumber: string, library: Xdc3): Promise<number> | undefined;
  proposalVotes(proposalId: string, library: Xdc3): Promise<any> | undefined;
  proposalThreshold(library: Xdc3): Promise<any | undefined>;
}
