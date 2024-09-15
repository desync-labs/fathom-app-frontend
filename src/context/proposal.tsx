import { createContext, FC, ReactElement, ReactNode, useContext } from "react";
import useProposalItem from "hooks/Governance/useProposalItem";
import { ChainId } from "connectors/networks";
import { ProposalStatus } from "utils/Constants";

export type ProposalContextType = {
  children: ReactElement;
};

export type UseProposalContextReturnType = {
  hasVoted: boolean;
  votePending: string | null;
  account: string | null | undefined;
  chainId: ChainId;
  _proposalId: string | undefined;
  vote: (support: string) => Promise<void>;
  getTitleDescription: (title: string, index: number) => ReactNode;
  status: ProposalStatus;
  forVotes: number;
  abstainVotes: number;
  againstVotes: number;
  fetchedTotalVotes: number;
  fetchedProposal: any;
  back: () => void;
  submitTime: string | null;
  votingStartsTime: string | null;
  votingEndTime: string | null;
  quorumError: boolean;
  secondsLeft: number;
  vFTHMTotalSupply: string;
  currentBlock: number;
  isLoading: boolean;
};

export const ProposalContext = createContext<UseProposalContextReturnType>(
  {} as UseProposalContextReturnType
);

export const ProposalProvider: FC<ProposalContextType> = ({ children }) => {
  const values = useProposalItem();

  return (
    <ProposalContext.Provider value={values}>
      {children}
    </ProposalContext.Provider>
  );
};

const useProposalContext = () => useContext(ProposalContext);

export default useProposalContext;
