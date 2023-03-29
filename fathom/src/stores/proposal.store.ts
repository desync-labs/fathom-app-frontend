import { RootStore } from ".";
import IProposalService from "services/interfaces/IProposalService";
import Xdc3 from "xdc3";

export default class ProposalStore {
  service: IProposalService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IProposalService) {
    this.service = service;
    this.rootStore = rootStore;
  }

  showErrorMessage(msg: string) {
    this.rootStore.alertStore.setShowErrorAlert(true, msg);
  }

  async createProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    library: Xdc3
  ): Promise<any> {
    try {
      return await this.service
        .createProposal(
          targets,
          values,
          callData,
          description,
          account,
          this.rootStore.transactionStore,
          library,
        )
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Proposal created successfully!"
          );
          return receipt;
        });
    } catch (e: any) {
      this.showErrorMessage(e.message);
      throw e;
    }
  }

  async executeProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string,
    library: Xdc3
  ) {
    try {
      return await this.service
        .executeProposal(
          targets,
          values,
          callData,
          description,
          account,
          this.rootStore.transactionStore,
          library
        )
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Proposal executed created successfully!"
          );
          return receipt;
        });
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  async castVote(
    proposalId: string,
    account: string,
    support: string,
    library: Xdc3
  ): Promise<any> {
    try {
      return await this.service
        .castVote(
          proposalId,
          account,
          support,
          this.rootStore.transactionStore,
          library
        )
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "You have successfully voted!"
          );
          return receipt;
        });
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  async nextAcceptableProposalTimestamp(
    account: string,
    library: Xdc3
  ): Promise<any> {
    try {
      const data = await this.service.nextAcceptableProposalTimestamp(
        account,
        library
      );
      return data;
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  async hasVoted(
    proposalId: string,
    account: string,
    library: Xdc3
  ): Promise<boolean | undefined> {
    try {
      return await this.service.hasVoted(proposalId, account, library);
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  async getVBalance(account: string, library: Xdc3) {
    try {
      return await this.service.getVBalance(account, library);
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  async fetchProposalState(proposal: string, account: string, library: Xdc3) {
    try {
      return await this.service.viewProposalState(proposal, account, library);
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  async voteQuorum(blockNumber: string, library: Xdc3) {
    try {
      return await this.service.quorum(blockNumber, library);
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  async proposalVotes(proposalId: string, library: Xdc3) {
    try {
      return await this.service.proposalVotes(proposalId, library);
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }
}
