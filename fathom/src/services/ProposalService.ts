import Xdc3 from "xdc3";
import { TransactionReceipt } from "xdc3-eth";
import { keccak256 } from "xdc3-utils";

import { SmartContractFactory } from "config/SmartContractFactory";
import IProposalService from "services/interfaces/services/IProposalService";
import { Web3Utils } from "helpers/Web3Utils";

import {
  TransactionStatus,
  TransactionType
} from "services/interfaces/models/ITransaction";
import {
  DEFAULT_CHAIN_ID
} from "helpers/Constants";

import { getEstimateGas } from "utils/getEstimateGas";

import { SKIP_ERRORS } from "connectors/networks";
import {
  UseAlertAndTransactionServiceType
} from "context/alertAndTransaction";

export default class ProposalService implements IProposalService {
  chainId = DEFAULT_CHAIN_ID;
  alertAndTransactionContext: UseAlertAndTransactionServiceType;

  constructor(alertAndTransactionContext: UseAlertAndTransactionServiceType) {
    this.alertAndTransactionContext = alertAndTransactionContext;
  }

  createProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    library: Xdc3
  ): Promise<number|Error> {
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
            this.alertAndTransactionContext.setShowSuccessAlertHandler(
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
            this.alertAndTransactionContext.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Proposal Creation Pending",
              message: "Click on transaction to view on block Explorer."
            });
          })
          .then((transactionReceipt: TransactionReceipt) => {
            this.alertAndTransactionContext.setShowSuccessAlertHandler(
              true,
              "Proposal created successfully!"
            );
            resolve(transactionReceipt.blockNumber);
          })
          .catch((e: Error) => {
            this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
            reject(e);
          });
      } catch (e: any) {
        this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
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
  ): Promise<number|Error> {
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
            this.alertAndTransactionContext.setShowSuccessAlertHandler(
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
            this.alertAndTransactionContext.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Execute Proposal Pending",
              message: "Click on transaction to view on block Explorer."
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertAndTransactionContext.setShowSuccessAlertHandler(
              true,
              "Proposal executed successfully!"
            );
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
            reject(e);
          });
      } catch (e: any) {
        this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
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
  ): Promise<number|Error> {
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
            this.alertAndTransactionContext.setShowSuccessAlertHandler(
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
            this.alertAndTransactionContext.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Queue Proposal Pending",
              message: "Click on transaction to view on block Explorer."
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertAndTransactionContext.setShowSuccessAlertHandler(
              true,
              "Queue Proposal executed successfully!"
            );
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
            reject(e);
          });
      } catch (e: any) {
        this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
        reject(e);
      }
    });
  }

  castVote(
    proposalId: string,
    account: string,
    support: string,
    library: Xdc3
  ): Promise<number|Error> {
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
            this.alertAndTransactionContext.setShowSuccessAlertHandler(
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
            this.alertAndTransactionContext.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: `Vote Pending`,
              message: "Click on transaction to view on block Explorer."
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertAndTransactionContext.setShowSuccessAlertHandler(
              true,
              "You have successfully voted!"
            );
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
            reject(e);
          });
      } catch (e: any) {
        this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
        reject(e);
      }
    });
  }

  hasVoted(
    proposalId: string,
    account: string,
    library: Xdc3
  ) {
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
  ) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      library
    );
    return FathomGovernor.methods.state(proposalId).call({ from: account });
  }

  nextAcceptableProposalTimestamp(
    account: string,
    library: Xdc3
  ) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      library
    );

    return FathomGovernor.methods
      .nextAcceptableProposalTimestamp(account)
      .call();
  }

  getVBalance(account: string, library: Xdc3) {
    const VeFathom = Web3Utils.getContractInstance(
      SmartContractFactory.vFathom(this.chainId),
      library
    );

    return VeFathom.methods.balanceOf(account).call();
  }

  quorum(blockNumber: string, library: Xdc3) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      library
    );

    return FathomGovernor.methods.quorum(blockNumber).call();
  }

  proposalVotes(proposalId: string, library: Xdc3) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      library
    );

    return FathomGovernor.methods.proposalVotes(proposalId).call();
  }

  proposalThreshold(library: Xdc3) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      library
    );

    return FathomGovernor.methods.proposalThreshold().call();
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
