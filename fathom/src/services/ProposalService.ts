import { SmartContractFactory } from "../config/SmartContractFactory";
import IProposalService from "./interfaces/IProposalService";
import { Web3Utils } from "../helpers/Web3Utils";
import IProposal from "../stores/interfaces/IProposal";
import IVoteCounts from "../stores/interfaces/IVoteCounts";
import ActiveWeb3Transactions from "../stores/transaction.store";
import { keccak256 } from "web3-utils";
import {
  TransactionStatus,
  TransactionType,
} from "../stores/interfaces/ITransaction";
import { Constants } from "../helpers/Constants";

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
        .execute(targets, values, calldatas, keccak256(description))
        .send({ from: account });
    } else {
      return 0;
    }
  }

  async queueProposal(
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
        .queue(targets, values, calldatas, keccak256(description))
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
          SmartContractFactory.FathomGovernor(chainId)
        );

        const proposalIds = await FathomGovernor.methods
          .getProposalIds()
          .call();
        console.log(typeof proposalIds[0]);
        const descriptions: any = [];
        const statusses: any = [];

        for (let i = 0; i < proposalIds.length; i++) {
          descriptions.push(
            await FathomGovernor.methods
              .getDescription(proposalIds[i])
              .call({ from: account })
          );
          statusses.push(
            Constants.Status[
              await FathomGovernor.methods
                .state(proposalIds[i])
                .call({ from: account })
            ]
          );

          let proposal = {
            description: descriptions[i],
            proposalId: proposalIds[i],
            status: statusses[i],
          };
          fetchedProposals.push(proposal);
        }
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

        let _description = await FathomGovernor.methods
          .getDescription(proposalId)
          .call({ from: account });
        let _status = await FathomGovernor.methods
          .state(proposalId)
          .call({ from: account });

        proposal = {
          description: _description,
          proposalId: proposalId,
          status: _status,
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
              message: "Click on transaction to view on blockexplorer.",
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
      console.error(`Error in getting Ve token blance: ${e}`);
      return weight;
    }
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
