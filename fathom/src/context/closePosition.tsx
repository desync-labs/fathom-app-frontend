import { createContext, Dispatch, FC, ReactElement, useContext } from "react";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import useClosePosition, { ClosingType } from "hooks/useClosePosition";

export type ClosePositionContextType = {
  children: ReactElement;
  position: IOpenPosition;
  onClose: () => void;
  closingType: ClosingType;
  setType: Dispatch<ClosingType>;
};

// @ts-ignore
export const ClosePositionContext = createContext<UseStakingViewType>(null);

export const ClosePositionProvider: FC<ClosePositionContextType> = ({
  children,
  position,
  onClose,
  closingType,
  setType,
}) => {
  const values = useClosePosition(position, onClose, closingType, setType);

  return (
    <ClosePositionContext.Provider value={values}>
      {children}
    </ClosePositionContext.Provider>
  );
};

const useClosePositionContext = () => {
  const context = useContext(ClosePositionContext);

  if (context === undefined) {
    throw new Error(
      "useClosePositionContext hook must be used with a ClosePositionContext component"
    );
  }

  return context;
};

export default useClosePositionContext;
