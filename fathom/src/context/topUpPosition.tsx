import { createContext, FC, ReactElement, useContext } from "react";
import useTopUpPosition from "hooks/useTopUpPosition";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import IOpenPosition from "stores/interfaces/IOpenPosition";

export type TopUpPositionContextType = {
  children: ReactElement;
  position: IOpenPosition;
  pool: ICollateralPool;
  onClose: () => void;
};

// @ts-ignore
export const TopUpPositionContext = createContext<UseStakingViewType>(null);

export const TopUpPositionProvider: FC<TopUpPositionContextType> = ({
  children,
  position,
  pool,
  onClose,
}) => {
  const values = useTopUpPosition(pool, onClose, position);

  return (
    <TopUpPositionContext.Provider value={values}>
      {children}
    </TopUpPositionContext.Provider>
  );
};

const useTopUpPositionContext = () => {
  const context = useContext(TopUpPositionContext);

  if (context === undefined) {
    throw new Error(
      "useOpenPositionContext hook must be used with a OpenPositionContext component"
    );
  }

  return context;
};

export default useTopUpPositionContext;
