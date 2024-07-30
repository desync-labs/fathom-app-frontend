import { createContext, FC, ReactElement, useContext } from "react";
import useOpenPosition, {
  defaultValues,
} from "hooks/Positions/useOpenPosition";
import { ICollateralPool } from "fathom-sdk";
import { Control, FieldErrorsImpl, UseFormHandleSubmit } from "react-hook-form";

export type OpenPositionContextType = {
  children: ReactElement;
  pool: ICollateralPool;
  onClose: () => void;
  proxyWallet: string;
  fetchProxyWallet: () => void;
};

export type UseOpenPositionContextReturnType = {
  safeMinCollateral: string;
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
  setCollateralMax: (balance: string) => void;
  setCollateralSafeMax: () => void;
  setBorrowMax: (collateral?: number) => void;
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
  minCollateralAmount: number;
  validateMaxBorrowAmount: () => boolean | string;
  priceOfCollateral: string;
  setAiPredictionCollateral: (value: string) => void;
};

export const OpenPositionContext =
  createContext<UseOpenPositionContextReturnType>(
    {} as UseOpenPositionContextReturnType
  );

export const OpenPositionProvider: FC<OpenPositionContextType> = ({
  children,
  pool,
  onClose,
  proxyWallet,
  fetchProxyWallet,
}) => {
  const values = useOpenPosition(pool, onClose, proxyWallet, fetchProxyWallet);

  return (
    <OpenPositionContext.Provider value={values}>
      {children}
    </OpenPositionContext.Provider>
  );
};

const useOpenPositionContext = () => useContext(OpenPositionContext);

export default useOpenPositionContext;
