import { createContext, Dispatch, FC, ReactElement, useContext } from "react";
import IOpenPosition from "services/interfaces/models/IOpenPosition";
import useRepayPosition from "hooks/useRepayPosition";
import { ChainId } from "connectors/networks";
import ICollateralPool from "services/interfaces/models/ICollateralPool";

export type ClosePositionContextType = {
  children: ReactElement;
  position: IOpenPosition;
  onClose: () => void;
};

export type UseRepayPositionContextReturnType = {
  liquidationPrice: number;
  ltv: number;
  overCollateral: number;
  chainId: ChainId;
  collateral: string;
  lockedCollateral: string;
  price: string;
  fathomToken: string;
  pool: ICollateralPool;
  balance: string;
  balanceError: boolean;
  balanceErrorNotFilled: boolean;
  fathomTokenIsDirty: boolean;
  closePositionHandler: () => Promise<void>;
  disableClosePosition: boolean;
  handleFathomTokenTextFieldChange: (e: any) => void;
  handleCollateralTextFieldChange: (e: any) => void;
  setMax: () => void;
  onClose: () => void;
  position: IOpenPosition;
  debtValue: string;
  switchPosition: (callback: Dispatch<IOpenPosition>) => void;
  approveBtn: boolean;
  approvalPending: boolean;
  approve: () => Promise<void>;
};

// @ts-ignore
export const RepayPositionContext =
  createContext<UseRepayPositionContextReturnType>(
    {} as UseRepayPositionContextReturnType
  );

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

const useRepayPositionContext = (): any => {
  const context = useContext(RepayPositionContext);

  if (!context) {
    throw new Error(
      "useClosePositionContext hook must be used with a ClosePositionContext component"
    );
  }

  return context;
};

export default useRepayPositionContext;
