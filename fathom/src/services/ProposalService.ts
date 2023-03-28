import { SmartContractFactory } from "config/SmartContractFactory";
import IProposalService from "services/interfaces/IProposalService";
import { Web3Utils } from "helpers/Web3Utils";
import ActiveWeb3Transactions from "stores/transaction.store";
import { keccak256 } from "web3-utils";
import {
  TransactionStatus,
  TransactionType,
} from "stores/interfaces/ITransaction";
import { Constants } from "helpers/Constants";
import Xdc3 from "xdc3";
import { getEstimateGas } from "utils/getEstimateGas";

export default class ProposalService implements IProposalService {
  chainId = Constants.DEFAULT_CHAIN_ID;

  transactionStore: ActiveWeb3Transactions;

  constructor(transactionStore: ActiveWeb3Transactions) {
    this.transactionStore = transactionStore;
  }

  async createProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<number> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      library
    );

    const options = { from: account, gas: 0 };
    const gas = await getEstimateGas(
      FathomGovernor,
      "propose",
      [targets, values, callData, description],
      options
    );
    options.gas = gas;

    return FathomGovernor.methods
      .propose(targets, values, callData, description)
      .send(options)
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
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<number> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      library
    );

    const options = { from: account, gas: 0 };
    const gas = await getEstimateGas(
      FathomGovernor,
      "execute",
      [targets, values, callData, keccak256(description)],
      options
    );
    options.gas = gas;

    return FathomGovernor.methods
      .execute(targets, values, callData, keccak256(description))
      .send(options);
  }

  async queueProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<number> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      library
    );

    const options = { from: account, gas: 0 };
    const gas = await getEstimateGas(
      FathomGovernor,
      "queue",
      [targets, values, callData, keccak256(description)],
      options
    );
    options.gas = gas;

    return FathomGovernor.methods
      .queue(targets, values, callData, keccak256(description))
      .send(options);
  }

  hasVoted(
    proposalId: string,
    account: string,
    library: Xdc3
  ): Promise<boolean> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      library
    );

    return FathomGovernor.methods.hasVoted(proposalId, account).call();
  }

  viewProposalState(
    proposalId: string,
    account: string,
    library: Xdc3
  ): Promise<string> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      library
    );

    return FathomGovernor.methods.state(proposalId).call({ from: account });
  }

  nextAcceptableProposalTimestamp(
    account: string,
    library: Xdc3
  ): Promise<number> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      library
    );

    return FathomGovernor.methods
      .nextAcceptableProposalTimestamp(account)
      .call();
  }

  async castVote(
    proposalId: string,
    account: string,
    support: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<number> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      library
    );

    const options = { from: account, gas: 0 };
    const gas = await getEstimateGas(
      FathomGovernor,
      "castVote",
      [proposalId, support],
      options
    );
    options.gas = gas;

    return FathomGovernor.methods
      .castVote(proposalId, support)
      .send(options)
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

  getVBalance(account: string, library: Xdc3): Promise<number> {
    const VeFathom = Web3Utils.getContractInstance(
      SmartContractFactory.vFathom(this.chainId),
      library
    );

    return VeFathom.methods.balanceOf(account).call();
  }

  quorum(blockNumber: string, library: Xdc3): Promise<number> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      library
    );

    return FathomGovernor.methods.quorum(blockNumber).call();
  }

  proposalVotes(proposalId: string, library: Xdc3): Promise<any> {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      library
    );

    return FathomGovernor.methods.proposalVotes(proposalId).call();
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
