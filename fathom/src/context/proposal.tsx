import { createContext, FC, ReactElement, useContext } from "react";
import useProposalItem from "hooks/useProposalItem";

export type ProposalContextType = {
  children: ReactElement;
};

// @ts-ignore
export const ProposalContext = createContext<UseStakingViewType>(null);

export const ProposalProvider: FC<ProposalContextType> = ({ children }) => {
  const values = useProposalItem();

  return (
    <ProposalContext.Provider value={values}>{children}</ProposalContext.Provider>
  );
};

const useProposalContext = () => {
  const context = useContext(ProposalContext);

  if (context === undefined) {
    throw new Error(
      "useProposalContext hook must be used with a ProposalContext component"
    );
  }

  return context;
};

export default useProposalContext;
