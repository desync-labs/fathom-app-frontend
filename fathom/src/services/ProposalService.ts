import { SmartContractFactory } from "../config/SmartContractFactory";
import IProposalService from "./interfaces/IProposalService";
import { Web3Utils } from "../helpers/Web3Utils";
import IProposal from "../stores/interfaces/IProposal";
import IVoteCounts from "../stores/interfaces/IVoteCounts";
import ActiveWeb3Transactions from "../stores/transaction.store";
import {
  TransactionStatus,
  TransactionType,
} from "../stores/interfaces/ITransaction";
import { Constants } from "../helpers/Constants";
import { Strings } from "../helpers/Strings";

export default class ProposalService implements IProposalService {
  chainId = Constants.DEFAULT_CHAINID;

  async createProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<number> {
    const chainId = this.chainId;

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
            message: Strings.CheckOnBlockExplorer,
          });
        });
    } else {
      return 0;
    }
  }

  async viewAllProposals(
    account: string
  ): Promise<IProposal[]> {
    let fetchedProposals: IProposal[] = [];
    try {
      const chainId = this.chainId;
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
    account: string
  ): Promise<IProposal> {
    let proposal = {} as IProposal;
    const chainId = this.chainId;

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
          .send({ from: account })
          .on("transactionHash", (hash: any) => {
            transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: `Vote Pending`,
              message: Strings.CheckOnBlockExplorer,
            });
          });
      }
      return weight;
    } catch (e) {
      console.error(`Error in getting Proposals: ${e}`);
      return weight;
    }
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
