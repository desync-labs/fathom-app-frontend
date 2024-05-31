import { FC } from "react";
import { FormProvider } from "react-hook-form";
import { CircularProgress, DialogContent } from "@mui/material";
import { styled } from "@mui/material/styles";

import { IVault } from "fathom-sdk";
import useVaultOpenDeposit from "hooks/useVaultOpenDeposit";

import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import DepositVaultInfo from "components/Vaults/VaultList/DepositVaultModal/DepositVaultInfo";
import DepositVaultForm from "components/Vaults/VaultList/DepositVaultModal/DepositVaultForm";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  ButtonPrimary,
  ButtonSecondary,
  ModalButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";

const VaultManageGridDialogWrapper = styled(AppDialog)`
  & .MuiDialog-paper {
    border-radius: 16px;
    border: 1px solid #2c4066;
    background: #132340;

    & .MuiDialogContent-root {
      padding: 10px 24px 24px;
    }
  }
`;

export type VaultDepositProps = {
  vaultItemData: IVault;
  performanceFee: number;
  onClose: () => void;
};

const VaultListItemDepositModal: FC<VaultDepositProps> = ({
  vaultItemData,
  performanceFee,
  onClose,
}) => {
  const {
    methods,
    walletBalance,
    isWalletFetching,
    control,
    deposit,
    sharedToken,
    approveBtn,
    approvalPending,
    openDepositLoading,
    errors,
    approve,
    setMax,
    validateMaxDepositValue,
    handleSubmit,
    onSubmit,
  } = useVaultOpenDeposit(vaultItemData, onClose);

  return (
    <VaultManageGridDialogWrapper
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Deposit
      </AppDialogTitle>

      <DialogContent>
        <FormProvider {...methods}>
          <DepositVaultForm
            vaultItemData={vaultItemData}
            walletBalance={walletBalance}
            isWalletFetching={isWalletFetching}
            control={control}
            deposit={deposit}
            approveBtn={approveBtn}
            approvalPending={approvalPending}
            approve={approve}
            setMax={setMax}
            validateMaxDepositValue={validateMaxDepositValue}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
          <DepositVaultInfo
            vaultItemData={vaultItemData}
            deposit={deposit}
            sharedToken={sharedToken}
            performanceFee={performanceFee}
          />
          <ModalButtonWrapper>
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
            <ButtonPrimary
              type="submit"
              disabled={
                openDepositLoading || approveBtn || !!Object.keys(errors).length
              }
              isLoading={openDepositLoading}
            >
              {openDepositLoading ? (
                <CircularProgress sx={{ color: "#0D1526" }} size={20} />
              ) : (
                "Deposit"
              )}
            </ButtonPrimary>
          </ModalButtonWrapper>
        </FormProvider>
      </DialogContent>
    </VaultManageGridDialogWrapper>
  );
};

export default VaultListItemDepositModal;
