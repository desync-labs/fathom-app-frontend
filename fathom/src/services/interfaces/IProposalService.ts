import IProposal from "../../stores/interfaces/IProposal";
import IVoteCounts from "../../stores/interfaces/IVoteCounts";
import ActiveWeb3Transactions from "../../stores/transaction.store";


export default interface IProposalService{

    createProposal(targets:string[], values:number[], calldatas:string[], description:string, account:string,transactionStore:ActiveWeb3Transactions, chainId?: number): Promise<number>;
   
    viewAllProposals(account:string, chainId?: number): Promise<IProposal[]>

    viewProposal(proposalId:string, account:string, chainId?: number): Promise<IProposal>

    viewProposalState(proposalId:string, account:string, chainId?: number): Promise<string>

    viewVoteCounts(proposalId:string, account:string, chainId?: number): Promise<IVoteCounts>

    castVote(proposalId:string, account:string, support:string,transactionStore:ActiveWeb3Transactions, chainId?: number): Promise<number>

    getVeBalance(account: string, chainId?: number): Promise<number> 

    executeProposal(
        targets: string[],
        values: number[],
        calldatas: string[],
        description: string,
        account: string,
        transactionStore: ActiveWeb3Transactions
      ): Promise<number>

    queueProposal(
        targets: string[],
        values: number[],
        calldatas: string[],
        description: string,
        account: string,
        transactionStore: ActiveWeb3Transactions
      ): Promise<number>
}