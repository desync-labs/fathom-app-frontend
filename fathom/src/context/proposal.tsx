import { createContext, FC, ReactElement, useContext } from "react";
import useProposalItem from "hooks/useProposalItem";
import { ChainId } from "connectors/networks";

export type ProposalContextType = {
  children: ReactElement;
};

export type UseProposalContextReturnType = {
  isMobile: boolean,
  hasVoted: boolean,
  votePending: string | null,
  account: string | null | undefined,
  chainId: ChainId,
  _proposalId: string | undefined,
  vote: (support: string) => Promise<void>,
  getTitleDescription: (title: string, index: number) => string,
  status: string | undefined,
  forVotes: number,
  abstainVotes: number,
  againstVotes: number,
  fetchedTotalVotes: number,
  fetchedProposal: any,
  back: () => void,
  submitTime: string | null,
  votingStartsTime: string | null,
  votingEndTime: string | null,
  quorumError: boolean,
  secondsLeft: number,
};

// @ts-ignore
export const ProposalContext = createContext<UseProposalContextReturnType>(
  {} as UseProposalContextReturnType
);

export const ProposalProvider: FC<ProposalContextType> = ({ children }) => {
  const values = useProposalItem();

  return (
    <ProposalContext.Provider value={values}>{children}</ProposalContext.Provider>
  );
};

const useProposalContext = () => {
  const context = useContext(ProposalContext);

  if (!context) {
    throw new Error(
      "useProposalContext hook must be used with a ProposalContext component"
    );
  }

  return context;
};

export default useProposalContext;
