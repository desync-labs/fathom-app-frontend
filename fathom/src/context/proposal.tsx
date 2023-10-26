import { createContext, FC, ReactElement, useContext } from "react";
import useProposalItem from "hooks/useProposalItem";

type ProposalContextType = {
  children: ReactElement;
};

type UseProposalContextReturnType = {}

// @ts-ignore
export const ProposalContext = createContext<UseProposalContextReturnType>(
  {} as UseProposalContextReturnType
);

export const ProposalProvider: FC<ProposalContextType> = ({ children }) => {
  const values= useProposalItem();

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
