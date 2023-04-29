import { createContext, FC, ReactElement, useContext } from "react";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import useRepayPosition from "hooks/useRepayPosition";

export type ClosePositionContextType = {
  children: ReactElement;
  position: IOpenPosition;
  onClose: () => void;
};

// @ts-ignore
export const RepayPositionContext = createContext<UseStakingViewType>(null);

export const ClosePositionProvider: FC<ClosePositionContextType> = ({
  children,
  position,
  onClose,
}) => {
  const values = useRepayPosition(position, onClose);

  return (
    <RepayPositionContext.Provider value={values}>
      {children}
    </RepayPositionContext.Provider>
  );
};

const useRepayPositionContext = () => {
  const context = useContext(RepayPositionContext);

  if (context === undefined) {
    throw new Error(
      "useClosePositionContext hook must be used with a ClosePositionContext component"
    );
  }

  return context;
};

export default useRepayPositionContext;
