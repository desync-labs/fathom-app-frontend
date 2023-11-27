import { createContext, FC, ReactElement, useContext } from "react";
import { defaultValues } from "hooks/useOpenPosition";
import { FieldErrorsImpl } from "react-hook-form";
import useVaultDeposit from "hooks/useVaultDeposit";

export type VaultDepositContextType = {
  children: ReactElement;
  vault: any;
  onClose: () => void;
};

export type UseVaultDepositContextReturnType = {
  isMobile: boolean;
  safeMax: number;
  onClose: () => void;
  errors: Partial<FieldErrorsImpl<typeof defaultValues>>;
};

// @ts-ignore
export const VaultDepositContext =
  createContext<UseVaultDepositContextReturnType>(
    {} as UseVaultDepositContextReturnType
  );

export const VaultDepositContextProvider: FC<VaultDepositContextType> = ({
  children,
  vault,
  onClose,
}) => {
  const values = useVaultDeposit(vault, onClose);

  return (
    <VaultDepositContext.Provider value={values}>
      {children}
    </VaultDepositContext.Provider>
  );
};

const useVaultDepositContext = () => {
  const context = useContext(VaultDepositContext);

  if (!context) {
    throw new Error(
      "useVaultDepositContext hook must be used with a VaultDepositContext component"
    );
  }

  return context;
};

export default useVaultDepositContext;
