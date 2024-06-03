import { FC, memo } from "react";
import { FormProvider } from "react-hook-form";
import {
  Box,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import BigNumber from "bignumber.js";

import { IVault, IVaultPosition } from "fathom-sdk";
import useVaultManageDeposit, { FormType } from "hooks/useVaultManageDeposit";
import useConnector from "context/connector";

import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import ManageVaultForm from "components/Vaults/VaultList/ManageVaultModal/ManageVaultForm";
import ManageVaultInfo from "components/Vaults/VaultList/ManageVaultModal/ManageVaultInfo";
import {
  VaultNavItem,
  VaultNavWrapper,
} from "components/Vaults/VaultDetail/VaultDetailInfoNav";
import {
  ButtonPrimary,
  ButtonSecondary,
  ModalButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";
import WalletConnectBtn from "components/Common/WalletConnectBtn";
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

export type VaultManageProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  performanceFee: number;
  onClose: () => void;
};

const VaultListItemManageModal: FC<VaultManageProps> = ({
  vaultItemData,
  vaultPosition,
  performanceFee,
  onClose,
}) => {
  const {
    methods,
    walletBalance,
    isWalletFetching,
    control,
    formToken,
    formSharedToken,
    approveBtn,
    approvalPending,
    formType,
    balanceToken,
    openDepositLoading,
    errors,
    setFormType,
    approve,
    setMax,
    validateMaxValue,
    handleSubmit,
    onSubmit,
  } = useVaultManageDeposit(vaultItemData, vaultPosition, onClose);
  const { account } = useConnector();
  const { shutdown } = vaultItemData;

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
        {shutdown ? (
          "Withdrawing"
        ) : (
          <VaultNavWrapper sx={{ marginTop: "-10px" }}>
            <VaultNavItem
              onClick={() => setFormType(FormType.DEPOSIT)}
              className={formType === FormType.DEPOSIT ? "active" : ""}
            >
              Deposit
            </VaultNavItem>
            <VaultNavItem
              onClick={() => setFormType(FormType.WITHDRAW)}
              className={formType === FormType.WITHDRAW ? "active" : ""}
            >
              Withdraw
            </VaultNavItem>
          </VaultNavWrapper>
        )}
      </AppDialogTitle>

      <DialogContent>
        <FormProvider {...methods}>
          <ManageVaultForm
            balanceToken={balanceToken}
            vaultItemData={vaultItemData}
            vaultPosition={vaultPosition}
            walletBalance={walletBalance}
            control={control}
            formType={formType}
            setMax={setMax}
            validateMaxValue={validateMaxValue}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
          <ManageVaultInfo
            formType={formType}
            vaultItemData={vaultItemData}
            vaultPosition={vaultPosition}
            formToken={formToken}
            formSharedToken={formSharedToken}
            performanceFee={performanceFee}
          />
          {isWalletFetching &&
            formType === FormType.DEPOSIT &&
            (BigNumber(walletBalance)
              .dividedBy(10 ** 18)
              .isLessThan(BigNumber(formToken)) ||
              walletBalance == "0") && (
              <ErrorBox sx={{ marginBottom: 0 }}>
                <InfoIcon />
                <Typography>
                  Wallet balance is not enough to deposit.
                </Typography>
              </ErrorBox>
            )}
          {approveBtn &&
            formType === FormType.DEPOSIT &&
            walletBalance !== "0" && (
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
            {!account ? (
              <WalletConnectBtn />
            ) : approveBtn && walletBalance !== "0" ? (
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
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={
                  openDepositLoading ||
                  (formType === FormType.DEPOSIT && approveBtn) ||
                  !!Object.keys(errors).length
                }
                isLoading={openDepositLoading}
              >
                {openDepositLoading ? (
                  <CircularProgress sx={{ color: "#0D1526" }} size={20} />
                ) : formType === FormType.DEPOSIT ? (
                  "Deposit"
                ) : (
                  "Withdraw"
                )}
              </ButtonPrimary>
            )}
          </ModalButtonWrapper>
        </FormProvider>
      </DialogContent>
    </VaultManageGridDialogWrapper>
  );
};

export default memo(VaultListItemManageModal);
