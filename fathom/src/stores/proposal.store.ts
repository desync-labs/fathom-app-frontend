import { RootStore } from ".";
import IProposalService from "services/interfaces/IProposalService";
import IProposal from "stores/interfaces/IProposal";
import IVoteCounts from "stores/interfaces/IVoteCounts";
import { makeAutoObservable, runInAction } from "mobx";

export default class ProposalStore {
  fetchedProposals: IProposal[] = [];
  fetchedProposal: IProposal;
  fetchedVotes: IVoteCounts;
  fetchedTotalVotes: number = 0.000000001;
  fetchedProposalState: string = "";
  weight: number = 0;
  veBalance: number = 0;
  service: IProposalService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IProposalService) {
    makeAutoObservable(this);
    this.service = service;
    this.fetchedProposal = {} as IProposal;
    this.fetchedVotes = {} as IVoteCounts;

    this.rootStore = rootStore;
  }

  async createProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string
  ): Promise<number> {
    return this.service.createProposal(
      targets,
      values,
      callData,
      description,
      account,
      this.rootStore.transactionStore
    );
  }

  async executeProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string
  ): Promise<number> {
    return this.service.executeProposal(
      targets,
      values,
      callData,
      description,
      account,
      this.rootStore.transactionStore
    );
  }

  async queueProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string
  ): Promise<number> {
    return this.service.queueProposal(
      targets,
      values,
      callData,
      description,
      account,
      this.rootStore.transactionStore
    );
  }

  setProposals(_proposal: IProposal[]) {
    this.fetchedProposals = _proposal;
  }

  setProposal(_proposal: IProposal) {
    this.fetchedProposal = _proposal;
  }

  setProposalState(_proposalState: string) {
    this.fetchedProposalState = _proposalState;
  }

  setProposalVotes(_proposalVotes: IVoteCounts) {
    _proposalVotes.abstainVotes = _proposalVotes.abstainVotes / 10 ** 18;
    _proposalVotes.againstVotes = _proposalVotes.againstVotes / 10 ** 18;
    _proposalVotes.forVotes = _proposalVotes.forVotes / 10 ** 18;

    this.fetchedTotalVotes =
      _proposalVotes.abstainVotes +
      _proposalVotes.againstVotes +
      _proposalVotes.forVotes;
    this.fetchedVotes = _proposalVotes;
  }

  setWeight(_weight: number) {
    this.weight = _weight;
  }

  setVeBalance(_veBalance: number) {
    this.veBalance = _veBalance;
  }

  async castVote(
    proposalId: string,
    account: string,
    support: string,
    chainId?: number
  ) {
    const _weight = await this.service.castVote(
      proposalId,
      account,
      support,
      this.rootStore.transactionStore,
      chainId
    );
    runInAction(() => {
      this.setWeight(_weight);
    });
  }

  async getVeBalance(account: string, chainId?: number) {
    const _veBalance = await this.service.getVeBalance(account, chainId);
    runInAction(() => {
      this.setVeBalance(_veBalance);
    });
  }

  async fetchProposals(account: string, chainId?: number) {
    const fetchedProposals = await this.service.viewAllProposals(
      account,
      chainId
    );
    this.setProposals(fetchedProposals);
  }

  async fetchProposal(proposal: string, account: string, chainId?: number) {
    const fetchedProposal = await this.service.viewProposal(
      proposal,
      account,
      chainId
    );
    this.setProposal(fetchedProposal);
  }

  async fetchProposalState(
    proposal: string,
    account: string,
    chainId?: number
  ) {
    const fetchedProposalState = await this.service.viewProposalState(
      proposal,
      account,
      chainId
    );
    this.setProposalState(fetchedProposalState);
  }

  async fetchProposalVotes(
    proposal: string,
    account: string,
    chainId?: number
  ) {
    const fetchedVotes = await this.service.viewVoteCounts(
      proposal,
      account,
      chainId
    );
    this.setProposalVotes(fetchedVotes);
  }
}