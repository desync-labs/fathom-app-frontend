import { useMediaQuery, useTheme } from "@mui/material";
import { VaultDepositContextType } from "context/vaultDeposit";
import { useForm } from "react-hook-form";

export const defaultValues = {
  collateral: "",
  fathomToken: "",
  safeMax: 0,
  dangerSafeMax: 0,
};

const useVaultDeposit = (
  vailt: VaultDepositContextType["vault"],
  onClose: VaultDepositContextType["onClose"]
) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    handleSubmit,
    watch,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const safeMax = watch("safeMax");
  const dangerSafeMax = watch("dangerSafeMax");

  return {
    isMobile,
    safeMax,
    onClose,
    errors,
  };
};

export default useVaultDeposit;
