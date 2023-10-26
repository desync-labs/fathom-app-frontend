import { createContext, FC, ReactElement, useContext } from "react";
import useTopUpPosition from "hooks/useTopUpPosition";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import IOpenPosition from "stores/interfaces/IOpenPosition";

type TopUpPositionContextType = {
  children: ReactElement;
  position: IOpenPosition;
  pool: ICollateralPool;
  onClose: () => void;
};

type UseTopUpPositionReturnType = {}

// @ts-ignore
export const TopUpPositionContext = createContext<UseTopUpPositionReturnType>(
  {} as UseTopUpPositionReturnType
);

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

const useTopUpPositionContext = (): UseTopUpPositionReturnType => {
  const context = useContext(TopUpPositionContext);

  if (!context) {
    throw new Error(
      "useOpenPositionContext hook must be used with a OpenPositionContext component"
    );
  }

  return context;
};

export default useTopUpPositionContext;
