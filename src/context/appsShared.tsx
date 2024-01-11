import { createContext, FC, ReactElement, useContext } from "react";
import { DexViewProps } from "components/Dashboard/DexView";
import { LendingViewProps } from "components/Dashboard/LendingView";

export type UseAppsSharedReturnType = DexViewProps | LendingViewProps;

export const AppsSharedContext = createContext<UseAppsSharedReturnType>(
  {} as UseAppsSharedReturnType
);

type DexSharedProviderType = {
  children: ReactElement;
} & (DexViewProps | LendingViewProps);

export const AppsSharedProvider: FC<DexSharedProviderType> = ({
  children,
  ...rest
}) => {
  return (
    <AppsSharedContext.Provider value={rest}>
      {children}
    </AppsSharedContext.Provider>
  );
};

const useAppsShared = () => useContext(AppsSharedContext);

export default useAppsShared;
