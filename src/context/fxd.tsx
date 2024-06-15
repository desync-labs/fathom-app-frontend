import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  useContext,
  SetStateAction,
} from "react";
import useDashboardContext from "hooks/General/useDashboardContext";

export type UseFxdContextReturn = {
  loadingStats: boolean;
  loadingPositions: boolean;
  loadingPools: boolean;
  proxyWallet: string;
  positionCurrentPage: number;
  positionsItemsCount: number;
  setPositionCurrentPage: Dispatch<SetStateAction<number>>;
  fetchProxyWallet: () => void;
};

export const FxdContext = createContext<UseFxdContextReturn>(
  {} as UseFxdContextReturn
);

type SharedProviderType = {
  children: ReactElement;
};

export const FxdProvider: FC<SharedProviderType> = ({ children }) => {
  const values = useDashboardContext();
  return <FxdContext.Provider value={values}>{children}</FxdContext.Provider>;
};

const useDashboard = () => useContext(FxdContext);

export default useDashboard;
