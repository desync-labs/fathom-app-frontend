import { createContext, Dispatch, FC, ReactElement, useContext } from "react";
import { IOpenPosition, ICollateralPool } from "fathom-sdk";
import useRepayPosition from "hooks/Positions/useRepayPosition";
import { ChainId } from "connectors/networks";

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
  priceOfCollateral: string;
};

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

const useRepayPositionContext = () => useContext(RepayPositionContext);

export default useRepayPositionContext;
