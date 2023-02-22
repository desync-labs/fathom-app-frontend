import { createContext, FC, ReactElement, useContext } from "react";
import useOpenPosition from "hooks/useOpenPosition";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import IOpenPosition from "stores/interfaces/IOpenPosition";

export type AdjustPositionContextType = {
  children: ReactElement;
  position: IOpenPosition;
  pool: ICollateralPool;
  onClose: () => void;
};

// @ts-ignore
export const AdjustPositionContext = createContext<UseStakingViewType>(null);

export const AdjustPositionProvider: FC<AdjustPositionContextType> = ({
  children,
  position,
  pool,
  onClose,
}) => {
  const values = useOpenPosition(pool, onClose, position);

  return (
    <AdjustPositionContext.Provider value={values}>
      {children}
    </AdjustPositionContext.Provider>
  );
};

const useAdjustPositionContext = () => {
  const context = useContext(AdjustPositionContext);

  if (context === undefined) {
    throw new Error(
      "useOpenPositionContext hook must be used with a OpenPositionContext component"
    );
  }

  return context;
};

export default useAdjustPositionContext;
