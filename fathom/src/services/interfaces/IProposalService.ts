import ActiveWeb3Transactions from "stores/transaction.store";
import Xdc3 from "xdc3";

export default interface IProposalService {
  createProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<number>;

  viewProposalState(
    proposalId: string,
    account: string,
    library: Xdc3
  ): Promise<string>;

  castVote(
    proposalId: string,
    account: string,
    support: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<number>;

  getVBalance(account: string, library: Xdc3): Promise<number>;

  hasVoted(proposalId: string, account: string, library: Xdc3): Promise<boolean>

  executeProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<number>;

  queueProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<number>;
}
