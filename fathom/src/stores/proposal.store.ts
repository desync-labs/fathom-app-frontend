import { RootStore } from ".";
import IProposalService from "../services/interfaces/IProposalService";
import IProposal from "../stores/interfaces/IProposal";
import IVoteCounts from "../stores/interfaces/IVoteCounts";
import { makeAutoObservable, runInAction } from "mobx";

export default class ProposalStore {
  fetchedProposals: IProposal[] = [];
  fetchedProposal: IProposal;
  fetchedVotes: IVoteCounts;
  fetchedTotalVotes: number = 0.000000001;
  fetchedProposalState: string = "";
  weight: number = 0;
  service: IProposalService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IProposalService) {
    makeAutoObservable(this);
    this.service = service;
    this.fetchedProposal = {} as IProposal;
    this.fetchedVotes = {} as IVoteCounts;

    this.rootStore = rootStore;
  }

  // ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"],
  // [0],
  // ["0x0000000000000000000000000000000000000000000000000000000000000000"],
  // "Some string"

  createProposal = async (
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
    chainId?: number
  ): Promise<number> => {
    return await this.service.createProposal(
      targets,
      values,
      calldatas,
      description,
      account,
      this.rootStore.transactionStore,
      chainId
    );
  };

  setproposals = (_proposal: IProposal[]) => {
    this.fetchedProposals = _proposal;
  };

  setproposal = (_proposal: IProposal) => {
    this.fetchedProposal = _proposal;
  };

  setproposalState = (_proposalState: string) => {
    this.fetchedProposalState = _proposalState;
  };

  setproposalVotes = (_proposalVotes: IVoteCounts) => {
    _proposalVotes.abstainVotes = _proposalVotes.abstainVotes / 10 ** 18;
    _proposalVotes.againstVotes = _proposalVotes.againstVotes / 10 ** 18;
    _proposalVotes.forVotes = _proposalVotes.forVotes / 10 ** 18;

    this.fetchedTotalVotes =
      _proposalVotes.abstainVotes +
      _proposalVotes.againstVotes +
      _proposalVotes.forVotes;
    this.fetchedVotes = _proposalVotes;
  };

  setWeight = (_weight: number) => {
    this.weight = _weight;
  };

  castVote = async (
    proposalId: string,
    account: string,
    support: string,
    chainId?: number
  ) => {
    let _weight = await this.service.castVote(
      proposalId,
      account,
      support,
      this.rootStore.transactionStore,
      chainId
    );
    runInAction(() => {
      this.setWeight(_weight);
    });
  };

  fetchProposals = async (account: string, chainId?: number) => {
    let fetchedProposals = await this.service.viewAllProposals(
      account,
      chainId
    );
    runInAction(() => {
      this.setproposals(fetchedProposals);
    });
  };

  fetchProposal = async (
    proposal: string,
    account: string,
    chainId?: number
  ) => {
    let fetchedProposal = await this.service.viewProposal(
      proposal,
      account,
      chainId
    );
    runInAction(() => {
      this.setproposal(fetchedProposal);
    });
  };

  fetchProposalState = async (
    proposal: string,
    account: string,
    chainId?: number
  ) => {
    let fetchedProposalState = await this.service.viewProposalState(
      proposal,
      account,
      chainId
    );
    runInAction(() => {
      this.setproposalState(fetchedProposalState);
    });
  };

  fetchProposalVotes = async (
    proposal: string,
    account: string,
    chainId?: number
  ) => {
    let fetchedVotes = await this.service.viewVoteCounts(
      proposal,
      account,
      chainId
    );
    runInAction(() => {
      this.setproposalVotes(fetchedVotes);
    });
  };
}
