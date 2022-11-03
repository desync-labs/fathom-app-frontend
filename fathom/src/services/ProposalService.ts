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
  chainId = Constants.DEFAULT_CHAINID;

  async createProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions,
    chainId?: number
  ): Promise<number> {
    chainId = chainId || this.chainId;

    if (chainId) {
      const FathomGovernor = Web3Utils.getContractInstance(
        SmartContractFactory.FathomGovernor(chainId),
        chainId
      );
      return await FathomGovernor.methods
        .propose(targets, values, calldatas, description)
        .send({ from: account })
        .on("transactionHash", (hash: any) => {
          transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.Approve,
            active: false,
            status: TransactionStatus.None,
            title: `Proposal Creation Pending`,
            message: "Click on transaction to view on blockexplorer.",
          });
        });
    } else {
      return 0;
    }
  }

  async executeProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions,
    chainId?: number
  ): Promise<number> {
    chainId = chainId || this.chainId;

    if (chainId) {
      const FathomGovernor = Web3Utils.getContractInstance(
        SmartContractFactory.FathomGovernor(chainId),
        chainId
      );
      return await FathomGovernor.methods
        .execute(targets, values, callData, keccak256(description))
        .send({ from: account });

    } else {
      return 0;
    }
  }

  async queueProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions,
    chainId?: number
  ): Promise<number> {
    chainId = chainId || this.chainId;

    if (chainId) {
      const FathomGovernor = Web3Utils.getContractInstance(
        SmartContractFactory.FathomGovernor(chainId),
        chainId
      );
      return await FathomGovernor.methods
        .queue(targets, values, callData, keccak256(description))
        .send({ from: account });
    } else {
      return 0;
    }
  }

  async viewAllProposals(
    account: string,
    chainId?: number
  ): Promise<IProposal[]> {
    let fetchedProposals: IProposal[] = [];
    try {
      chainId = chainId || this.chainId;
      if (chainId) {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(chainId),
          this.chainId,
        );

        const result = await FathomGovernor.methods.getProposals(12).call();

        result[0].forEach((_id: string, i: number) => {
          fetchedProposals.push({
            description: result[1][i],
            proposalId: _id.toString(),
            status: Constants.Status[parseInt(result[2][i])],
          });
        });
      }

      return fetchedProposals;
    } catch (e) {
      console.error(`Error in getting Proposals: ${e}`);
      return fetchedProposals;
    }
  }

  async viewProposal(
    proposalId: string,
    account: string,
    chainId?: number
  ): Promise<IProposal> {
    let proposal = {} as IProposal;
    chainId = chainId || this.chainId;

    try {
      if (chainId) {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(chainId),
          chainId
        );

        const _description = await FathomGovernor.methods
          .getDescription(proposalId)
          .call({ from: account });

        const _status = await FathomGovernor.methods
          .state(proposalId)
          .call({ from: account });

        proposal = {
          description: _description,
          proposalId: proposalId,
          status: Constants.Status[parseInt(_status)],
        };
      }
      return proposal;
    } catch (e) {
      console.error(`Error in getting Proposals: ${e}`);
      return proposal;
    }
  }

  async viewProposalState(
    proposalId: string,
    account: string,
    chainId?: number
  ): Promise<string> {
    let proposalState = "";
    try {
      chainId = chainId || this.chainId;
      if (chainId) {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(chainId),
          chainId
        );

        proposalState = await FathomGovernor.methods
          .state(proposalId)
          .call({ from: account });
      }
      return proposalState;
    } catch (e) {
      console.error(`Error in getting Proposals: ${e}`);
      return proposalState;
    }
  }

  async viewVoteCounts(
    proposalId: string,
    account: string,
    chainId?: number
  ): Promise<IVoteCounts> {
    let proposalVotes = {} as IVoteCounts;
    chainId = chainId || this.chainId;

    try {
      if (chainId) {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(chainId),
          this.chainId
        );

        proposalVotes = await FathomGovernor.methods
          .proposalVotes(proposalId)
          .call({ from: account });
      }
      return proposalVotes;
    } catch (e) {
      console.error(`Error in getting Proposals: ${e}`);
      return proposalVotes;
    }
  }

  async castVote(
    proposalId: string,
    account: string,
    support: string,
    transactionStore: ActiveWeb3Transactions,
    chainId?: number
  ): Promise<number> {
    let weight = 0;
    chainId = chainId || this.chainId;
    try {
      if (chainId) {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(chainId),
          this.chainId
        );

        weight = await FathomGovernor.methods
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
      return weight;
    } catch (e) {
      console.error(`Error in getting Proposals: ${e}`);
      return weight;
    }
  }

  async getVeBalance(account: string, chainId?: number): Promise<number> {
    let weight = 0;
    chainId = chainId || this.chainId;
    try {
      if (chainId) {
        const VeFathom = Web3Utils.getContractInstance(
          SmartContractFactory.VeFathom(chainId),
          this.chainId
        );
        weight = await VeFathom.methods.balanceOf(account).call();
      }
      return weight;
    } catch (e) {
      console.error(`Error in getting Ve token balance: ${e}`);
      return weight;
    }
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
