import { createContext, Dispatch, FC, ReactElement, useContext } from "react";
import useTopUpPosition from "hooks/useTopUpPosition";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { Control, UseFormHandleSubmit } from "react-hook-form/dist/types";

export type TopUpPositionContextType = {
  children: ReactElement;
  position: IOpenPosition;
  pool: ICollateralPool;
  onClose: () => void;
};

export type UseTopUpPositionContextReturnType = {
  position: IOpenPosition,
  safeMax: number,
  debtValue: string,
  approveBtn: boolean,
  approve: () => Promise<void>,
  approvalPending: boolean,
  balance: number,
  liquidationPrice: string,
  ltv: string,
  safetyBuffer: string,
  collateral: number,
  fathomToken: string,
  openPositionLoading: boolean,
  setMax: (balance: number) => void,
  setSafeMax: () => void,
  onSubmit: (values: any) => Promise<void>,
  control: Control<{
    collateral: string;
    fathomToken: string;
    safeMax: number;
    dangerSafeMax: number;
  }, any>,
  handleSubmit: UseFormHandleSubmit<{
    collateral: string;
    fathomToken: string;
    safeMax: number;
    dangerSafeMax: number;
  }>,
  pool: ICollateralPool,
  onClose: () => void,
  switchPosition: (callback: Dispatch<IOpenPosition>) => void,
  totalCollateral: string,
  totalFathomToken: string,
  overCollateral: number,
  maxBorrowAmount: string,
  availableFathomInPool: number,
  isMobile: boolean,
};

// @ts-ignore
export const TopUpPositionContext = createContext<UseTopUpPositionContextReturnType>(
  {} as UseTopUpPositionContextReturnType
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
