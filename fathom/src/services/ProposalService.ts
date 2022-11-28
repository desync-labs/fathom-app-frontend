import { SmartContractFactory } from "config/SmartContractFactory";
import IProposalService from "services/interfaces/IProposalService";
import { Web3Utils } from "helpers/Web3Utils";
import IProposal from "stores/interfaces/IProposal";
import IVoteCounts from "stores/interfaces/IVoteCounts";
import ActiveWeb3Transactions from "stores/transaction.store";
import { keccak256 } from "web3-utils";
import {
  TransactionStatus,
  TransactionType,
} from "stores/interfaces/ITransaction";
import { Constants } from "helpers/Constants";

export default class ProposalService implements IProposalService {
  chainId = Constants.DEFAULT_CHAIN_ID;

  async createProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<number> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.chainId
    );
    return FathomGovernor.methods
      .propose(targets, values, callData, description)
      .send({ from: account })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.Approve,
          active: false,
          status: TransactionStatus.None,
          title: "Proposal Creation Pending",
          message: "Click on transaction to view on block Explorer.",
        });
      });
  }

  async executeProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<number> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.chainId
    );

    return FathomGovernor.methods
      .execute(targets, values, callData, keccak256(description))
      .send({ from: account });
  }

  async queueProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<number> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.chainId
    );
    return FathomGovernor.methods
      .queue(targets, values, callData, keccak256(description))
      .send({ from: account });
  }

  async viewAllProposals(account: string): Promise<IProposal[]> {
    const fetchedProposals: IProposal[] = [];

    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.chainId
    );

    const result = await FathomGovernor.methods.getProposals(12).call();

    console.log(result);

    result[0].forEach((_id: string, i: number) => {
      fetchedProposals.push({
        description: result[1][i],
        proposalId: _id.toString(),
        status: Constants.Status[parseInt(result[2][i])],
      });
    });

    return fetchedProposals;
  }

  async hasVoted(proposalId: string, account: string): Promise<boolean> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.chainId
    );

    return FathomGovernor.methods.hasVoted(proposalId, account).call();
  }

  async viewProposal(proposalId: string, account: string): Promise<IProposal> {
    let proposal = {} as IProposal;

    return new Promise(async (resolve, reject) => {
      try {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(this.chainId),
          this.chainId
        );

        const [_description, _status] = await Promise.all([
          FathomGovernor.methods
            .getDescription(proposalId)
            .call({ from: account }),

          FathomGovernor.methods.state(proposalId).call({ from: account }),
        ]);

        proposal = {
          description: _description,
          proposalId: proposalId,
          status: Constants.Status[parseInt(_status)],
        };

        resolve(proposal);
      } catch (e) {
        reject(e);
      }
    });
  }

  async viewProposalState(
    proposalId: string,
    account: string
  ): Promise<string> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.chainId
    );

    return FathomGovernor.methods
      .state(proposalId)
      .call({ from: account });
  }

  async viewVoteCounts(
    proposalId: string,
    account: string,
  ): Promise<IVoteCounts> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.chainId
    );

    return FathomGovernor.methods
      .proposalVotes(proposalId)
      .call({ from: account });
  }

  async castVote(
    proposalId: string,
    account: string,
    support: string,
    transactionStore: ActiveWeb3Transactions,
  ): Promise<number> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.chainId
    );

    return FathomGovernor.methods
      .castVote(proposalId, support)
      .send({ from: account })
      .on("transactionHash", (hash: any) => {
        transactionStore.addTransaction({
          hash: hash,
          type: TransactionType.Approve,
          active: false,
          status: TransactionStatus.None,
          title: `Vote Pending`,
          message: "Click on transaction to view on block Explorer.",
        });
      });
  }

  async getVeBalance(account: string): Promise<number> {
    const VeFathom = Web3Utils.getContractInstance(
      SmartContractFactory.vFathom(this.chainId),
      this.chainId
    );

    return VeFathom.methods.balanceOf(account).call();
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
