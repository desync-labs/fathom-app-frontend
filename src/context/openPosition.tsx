import { createContext, FC, ReactElement, useContext } from "react";
import useOpenPosition, { defaultValues } from "hooks/useOpenPosition";
import { ICollateralPool } from "fathom-sdk";
import { Control, FieldErrorsImpl, UseFormHandleSubmit } from "react-hook-form";

export type OpenPositionContextType = {
  children: ReactElement;
  pool: ICollateralPool;
  onClose: () => void;
  proxyWallet: string;
};

export type UseOpenPositionContextReturnType = {
  isMobile: boolean;
  safeMax: string;
  approveBtn: boolean;
  approve: () => void;
  approvalPending: boolean;
  collateralToBeLocked: string;
  collateralAvailableToWithdraw: string;
  fxdAvailableToBorrow: string;
  debtRatio: string;
  overCollateral: string;
  fxdToBeBorrowed: string;
  balance: string;
  safetyBuffer: string;
  liquidationPrice: string;
  collateral: string;
  fathomToken: string;
  openPositionLoading: boolean;
  setMax: (balance: string) => void;
  setSafeMax: () => void;
  onSubmit: (values: Record<string, any>) => void;
  control: Control<typeof defaultValues>;
  handleSubmit: UseFormHandleSubmit<typeof defaultValues>;
  availableFathomInPool: number;
  pool: ICollateralPool;
  onClose: () => void;
  dangerSafetyBuffer: boolean;
  errors: Partial<FieldErrorsImpl<typeof defaultValues>>;
  maxBorrowAmount: string;
  proxyWalletExists: boolean;
};

// @ts-ignore
export const OpenPositionContext =
  createContext<UseOpenPositionContextReturnType>(
    {} as UseOpenPositionContextReturnType
  );

export const OpenPositionProvider: FC<OpenPositionContextType> = ({
  children,
  pool,
  onClose,
  proxyWallet,
}) => {
  const values = useOpenPosition(pool, onClose, proxyWallet);

  return (
    <OpenPositionContext.Provider value={values}>
      {children}
    </OpenPositionContext.Provider>
  );
};

const useOpenPositionContext = () => {
  const context = useContext(OpenPositionContext);

  if (!context) {
    throw new Error(
      "useOpenPositionContext hook must be used with a OpenPositionContext component"
    );
  }

  return context;
};

export default useOpenPositionContext;
