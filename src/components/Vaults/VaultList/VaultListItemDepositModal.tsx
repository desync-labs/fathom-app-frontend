import { FC } from "react";
import { FormProvider } from "react-hook-form";
import {
  Box,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import BigNumber from "bignumber.js";

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
import { ErrorBox, InfoBoxV2 } from "components/AppComponents/AppBox/AppBox";
import { InfoIcon } from "components/Governance/Propose";

const VaultManageGridDialogWrapper = styled(AppDialog)`
  & .MuiDialog-paper {
    border-radius: 16px;
    border: 1px solid #2c4066;
    background: #132340;

    & .MuiDialogContent-root {
      padding: 0 24px 24px;
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
      <AppDialogTitle
        id="customized-dialog-title"
        onClose={onClose}
        sx={{ padding: "24px" }}
        sxCloseIcon={{ right: "16px", top: "16px" }}
      >
        Deposit
      </AppDialogTitle>

      <DialogContent>
        <FormProvider {...methods}>
          <DepositVaultForm
            vaultItemData={vaultItemData}
            walletBalance={walletBalance}
            control={control}
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
          {isWalletFetching &&
            (BigNumber(walletBalance)
              .dividedBy(10 ** 18)
              .isLessThan(BigNumber(deposit)) ||
              walletBalance == "0") && (
              <ErrorBox sx={{ marginBottom: 0 }}>
                <InfoIcon />
                <Typography>
                  Wallet balance is not enough to deposit.
                </Typography>
              </ErrorBox>
            )}
          {approveBtn && walletBalance !== "0" && (
            <InfoBoxV2>
              <InfoIcon />
              <Box flexDirection="column">
                <Typography width="100%">
                  First-time connect? Please allow token approval in your
                  MetaMask
                </Typography>
              </Box>
            </InfoBoxV2>
          )}
          <ModalButtonWrapper>
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
            {approveBtn && walletBalance !== "0" ? (
              <ButtonPrimary onClick={approve}>
                {" "}
                {approvalPending ? (
                  <CircularProgress size={20} sx={{ color: "#0D1526" }} />
                ) : (
                  "Approve token"
                )}{" "}
              </ButtonPrimary>
            ) : (
              <ButtonPrimary
                type="submit"
                disabled={
                  openDepositLoading ||
                  approveBtn ||
                  !!Object.keys(errors).length
                }
                isLoading={openDepositLoading}
              >
                {openDepositLoading ? (
                  <CircularProgress sx={{ color: "#0D1526" }} size={20} />
                ) : (
                  "Deposit"
                )}
              </ButtonPrimary>
            )}
          </ModalButtonWrapper>
        </FormProvider>
      </DialogContent>
    </VaultManageGridDialogWrapper>
  );
};

export default VaultListItemDepositModal;
