import IProposal from "stores/interfaces/IProposal";
import IVoteCounts from "stores/interfaces/IVoteCounts";
import ActiveWeb3Transactions from "stores/transaction.store";

export default interface IProposalService {
  createProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions,
    chainId?: number
  ): Promise<number>;

  viewProposalState(
    proposalId: string,
    account: string,
  ): Promise<string>;

  viewVoteCounts(
    proposalId: string,
    account: string,
  ): Promise<IVoteCounts>;

  castVote(
    proposalId: string,
    account: string,
    support: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<number>;

  getVeBalance(account: string): Promise<number>;

  hasVoted(proposalId: string, account: string): Promise<boolean>

  executeProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<number>;

  queueProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<number>;
}
