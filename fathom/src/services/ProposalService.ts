import { SmartContractFactory } from "config/SmartContractFactory";
import IProposalService from "services/interfaces/IProposalService";
import { Web3Utils } from "helpers/Web3Utils";
import ActiveWeb3Transactions from "stores/transaction.store";
import { keccak256 } from "web3-utils";
import {
  TransactionStatus,
  TransactionType
} from "stores/interfaces/ITransaction";
import {
  DEFAULT_CHAIN_ID
} from "helpers/Constants";
import Xdc3 from "xdc3";
import { getEstimateGas } from "utils/getEstimateGas";
import AlertStore from "stores/alert.stores";
import { TransactionReceipt } from "xdc3-eth";
import { SKIP_ERRORS } from "../connectors/networks";

export default class ProposalService implements IProposalService {
  chainId = DEFAULT_CHAIN_ID;

  transactionStore: ActiveWeb3Transactions;
  alertStore: AlertStore;

  constructor(
    alertStore: AlertStore,
    transactionStore: ActiveWeb3Transactions
  ) {
    this.alertStore = alertStore;
    this.transactionStore = transactionStore;
  }

  createProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
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

        /**
         * Block for XDC Pay.
         */
        FathomGovernor.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(
              true,
              "Proposal created successfully!"
            );
            resolve(transactionReceipt.blockNumber);
          }
        );

        FathomGovernor.methods
          .propose(targets, values, callData, description)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Proposal Creation Pending",
              message: "Click on transaction to view on block Explorer."
            });
          })
          .then((transactionReceipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "Proposal created successfully!"
            );
            resolve(transactionReceipt.blockNumber);
          })
          .catch((e: any) => {
            reject(e);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  executeProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
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

        /**
         * Block for XDC Pay.
         */
        FathomGovernor.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(
              true,
              "Proposal executed successfully!"
            );
            resolve(transactionReceipt.blockNumber);
          }
        );

        return FathomGovernor.methods
          .execute(targets, values, callData, keccak256(description))
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Execute Proposal Pending",
              message: "Click on transaction to view on block Explorer."
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "Proposal executed successfully!"
            );
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            reject(e);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  queueProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
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

        /**
         * Block for XDC Pay.
         */
        FathomGovernor.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(
              true,
              "Queue Proposal executed successfully!"
            );
            resolve(transactionReceipt.blockNumber);
          }
        );

        FathomGovernor.methods
          .queue(targets, values, callData, keccak256(description))
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Queue Proposal Pending",
              message: "Click on transaction to view on block Explorer."
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "Queue Proposal executed successfully!"
            );
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            reject(e);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  castVote(
    proposalId: string,
    account: string,
    support: string,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
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

        /**
         * Block for XDC Pay.
         */
        FathomGovernor.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(
              true,
              "You have successfully voted!"
            );
            resolve(transactionReceipt.blockNumber);
          }
        );

        return FathomGovernor.methods
          .castVote(proposalId, support)
          .send(options)
          .on("transactionHash", (hash: string) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: `Vote Pending`,
              message: "Click on transaction to view on block Explorer."
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(
              true,
              "You have successfully voted!"
            );
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            reject(e);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  hasVoted(
    proposalId: string,
    account: string,
    library: Xdc3
  ): Promise<boolean>|undefined {
    try {
      const FathomGovernor = Web3Utils.getContractInstance(
        SmartContractFactory.FathomGovernor(this.chainId),
        library
      );
      return FathomGovernor.methods.hasVoted(proposalId, account).call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  viewProposalState(
    proposalId: string,
    account: string,
    library: Xdc3
  ): Promise<string>|undefined {
    try {
      const FathomGovernor = Web3Utils.getContractInstance(
        SmartContractFactory.FathomGovernor(this.chainId),
        library
      );
      return FathomGovernor.methods.state(proposalId).call({ from: account });
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  nextAcceptableProposalTimestamp(
    account: string,
    library: Xdc3
  ): Promise<number>|undefined {
    try {
      const FathomGovernor = Web3Utils.getContractInstance(
        SmartContractFactory.FathomGovernor(this.chainId),
        library
      );

      return FathomGovernor.methods
        .nextAcceptableProposalTimestamp(account)
        .call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getVBalance(account: string, library: Xdc3): Promise<number>|undefined {
    try {
      const VeFathom = Web3Utils.getContractInstance(
        SmartContractFactory.vFathom(this.chainId),
        library
      );

      return VeFathom.methods.balanceOf(account).call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  quorum(blockNumber: string, library: Xdc3): Promise<number>|undefined {
    try {
      const FathomGovernor = Web3Utils.getContractInstance(
        SmartContractFactory.MainFathomGovernor(this.chainId),
        library
      );

      return FathomGovernor.methods.quorum(blockNumber).call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  proposalVotes(proposalId: string, library: Xdc3): Promise<any>|undefined {
    try {
      const FathomGovernor = Web3Utils.getContractInstance(
        SmartContractFactory.MainFathomGovernor(this.chainId),
        library
      );

      return FathomGovernor.methods.proposalVotes(proposalId).call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  proposalThreshold(library: Xdc3) {
    try {
      const FathomGovernor = Web3Utils.getContractInstance(
        SmartContractFactory.MainFathomGovernor(this.chainId),
        library
      );

      return FathomGovernor.methods.proposalThreshold().call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
