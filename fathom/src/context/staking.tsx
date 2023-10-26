import { createContext, FC, ReactElement, useContext } from "react";
import useStakingView from "hooks/useStakingView";

type StakingProviderType = {
  children: ReactElement;
};

type UseStakingContextReturnType = {}

// @ts-ignore
export const StakingContext = createContext<UseStakingContextReturnType>(
  {} as UseStakingContextReturnType
);

export const StakingProvider: FC<StakingProviderType> = ({ children }) => {
  const values = useStakingView();

  return (
    <StakingContext.Provider value={values}>{children}</StakingContext.Provider>
  );
};

const useStakingContext = () => {
  const context = useContext(StakingContext);

  if (!context) {
    throw new Error(
      "useStakingContext hook must be used with a StakingContext component"
    );
  }

  return context;
};

export default useStakingContext;
