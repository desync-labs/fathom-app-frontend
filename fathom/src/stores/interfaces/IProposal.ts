export default interface IProposal {
  id: string;
  proposalId: string;
  proposer: string;
  startBlock: string;
  blockNumber?: string;
  blockTimestamp?: string;
  endBlock: string;
  description: string;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  calldatas: string;
  signatures: string;
  values: string;
  targets: string;
}
