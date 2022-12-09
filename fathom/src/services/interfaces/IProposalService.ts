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

  castVote(
    proposalId: string,
    account: string,
    support: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<number>;

  getVBalance(account: string): Promise<number>;

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
