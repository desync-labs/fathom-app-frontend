import { createContext, Dispatch, FC, ReactElement, useContext } from "react";
import useTopUpPosition from "hooks/Positions/useTopUpPosition";
import { ICollateralPool, IOpenPosition } from "fathom-sdk";
import { Control, UseFormHandleSubmit } from "react-hook-form/dist/types";

export type TopUpPositionContextType = {
  children: ReactElement;
  position: IOpenPosition;
  pool: ICollateralPool;
  onClose: () => void;
};

export type UseTopUpPositionContextReturnType = {
  position: IOpenPosition;
  safeMinCollateral: string;
  debtValue: string;
  approveBtn: boolean;
  approve: () => Promise<void>;
  approvalPending: boolean;
  balance: string;
  liquidationPrice: string;
  ltv: string;
  safetyBuffer: string;
  collateral: number;
  fathomToken: string;
  openPositionLoading: boolean;
  onSubmit: (values: any) => Promise<void>;
  control: Control<
    {
      collateral: string;
      fathomToken: string;
      safeMinCollateral: string;
    },
    any
  >;
  handleSubmit: UseFormHandleSubmit<{
    collateral: string;
    fathomToken: string;
    safeMinCollateral: string;
  }>;
  pool: ICollateralPool;
  onClose: () => void;
  switchPosition: (callback: Dispatch<IOpenPosition>) => void;
  totalCollateral: string;
  totalFathomToken: string;
  overCollateral: number;
  maxBorrowAmount: string;
  availableFathomInPool: number;
  errorAtLeastOneField: boolean;
  validateMaxBorrowAmount: () => boolean | string;
  priceOfCollateral: string;
  setBorrowMax: (collateralAmount?: number) => void;
  setCollateralMax: (balance: string) => void;
  setCollateralSafeMax: () => void;
  setAiPredictionCollateral: (value: string) => void;
};

export const TopUpPositionContext =
  createContext<UseTopUpPositionContextReturnType>(
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

const useTopUpPositionContext = () => useContext(TopUpPositionContext);

export default useTopUpPositionContext;
