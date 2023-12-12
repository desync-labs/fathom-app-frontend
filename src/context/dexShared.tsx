import { createContext, FC, ReactElement, useContext } from "react";
import { DexViewProps } from "components/Dashboard/DexView";

export type UseDexSharedReturnType = DexViewProps;

export const DexSharedContext = createContext<UseDexSharedReturnType>(
  {} as UseDexSharedReturnType
);

type DexSharedProviderType = {
  children: ReactElement;
} & DexViewProps;

export const DexSharedProvider: FC<DexSharedProviderType> = ({
  children,
  ...rest
}) => {
  return (
    <DexSharedContext.Provider value={rest}>
      {children}
    </DexSharedContext.Provider>
  );
};

const useDexShared = () => useContext(DexSharedContext);

export default useDexShared;
