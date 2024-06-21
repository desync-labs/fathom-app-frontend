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
import useVaultManageDeposit, {
  FormType,
} from "hooks/Vaults/useVaultManageDeposit";
import useConnector from "context/connector";

import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import ManageVaultForm from "components/Vaults/VaultList/ManageVaultModal/ManageVaultForm";
import ManageVaultInfo from "components/Vaults/VaultList/ManageVaultModal/ManageVaultInfo";
import {
  AppNavItem,
  AppNavWrapper,
} from "components/AppComponents/AppTabs/AppTabs";
import {
  ButtonPrimary,
  ButtonSecondary,
  ModalButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";
import WalletConnectBtn from "components/Common/WalletConnectBtn";
import {
  ErrorBox,
  InfoBoxV2,
  WarningBox,
} from "components/AppComponents/AppBox/AppBox";
import { InfoIcon } from "components/Governance/Propose";
import VaultModalLockingBar from "components/Vaults/VaultList/DepositVaultModal/VaultModalLockingBar";

const VaultManageGridDialogWrapper = styled(AppDialog)`
  & .MuiDialog-paper {
    border-radius: 16px;
    border: 1px solid #2c4066;
    background: #132340;

    & .MuiDialogContent-root {
      padding: 0 24px 24px;
    }
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    & .MuiDialog-paper {
      height: fit-content;
    }
  }
`;

const ModalNavWrapper = styled(AppNavWrapper)`
    margin-top: -10px;
    ${({ theme }) => theme.breakpoints.down("sm")} {
     width: fit-content;
      
      & button {
        font-size: 16px;
      }
  }
}`;

export type VaultManageProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  performanceFee: number;
  isTfVaultType: boolean;
  tfVaultDepositEndDate: string | null;
  tfVaultLockEndDate: string | null;
  activeTfPeriod: number;
  minimumDeposit: number;
  onClose: () => void;
};

const VaultListItemManageModal: FC<VaultManageProps> = ({
  vaultItemData,
  vaultPosition,
  performanceFee,
  isTfVaultType,
  tfVaultDepositEndDate,
  tfVaultLockEndDate,
  activeTfPeriod,
  minimumDeposit,
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
    balancePosition,
    openDepositLoading,
    errors,
    setFormType,
    approve,
    setMax,
    validateMaxValue,
    handleSubmit,
    onSubmit,
    depositLimitExceeded,
    withdrawLimitExceeded,
  } = useVaultManageDeposit(
    vaultItemData,
    vaultPosition,
    minimumDeposit,
    onClose
  );
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
          <ModalNavWrapper>
            <AppNavItem
              onClick={() => setFormType(FormType.DEPOSIT)}
              className={formType === FormType.DEPOSIT ? "active" : ""}
            >
              Deposit
            </AppNavItem>
            <AppNavItem
              onClick={() => setFormType(FormType.WITHDRAW)}
              className={formType === FormType.WITHDRAW ? "active" : ""}
            >
              Withdraw
            </AppNavItem>
          </ModalNavWrapper>
        )}
      </AppDialogTitle>

      <DialogContent>
        {isTfVaultType && (
          <VaultModalLockingBar
            tfVaultLockEndDate={tfVaultLockEndDate}
            tfVaultDepositEndDate={tfVaultDepositEndDate}
            activeTfPeriod={activeTfPeriod}
          />
        )}
        <FormProvider {...methods}>
          <ManageVaultForm
            balanceToken={balancePosition}
            vaultItemData={vaultItemData}
            vaultPosition={vaultPosition}
            walletBalance={walletBalance}
            control={control}
            formType={formType}
            setMax={setMax}
            validateMaxValue={validateMaxValue}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            depositLimitExceeded={depositLimitExceeded}
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
          {formType === FormType.WITHDRAW &&
            withdrawLimitExceeded(formToken) && (
              <ErrorBox sx={{ marginBottom: 0 }}>
                <InfoIcon />
                <Typography>{withdrawLimitExceeded(formToken)}</Typography>
              </ErrorBox>
            )}
          {activeTfPeriod === 1 && (
            <WarningBox>
              <InfoIcon
                sx={{ width: "20px", color: "#F5953D", height: "20px" }}
              />
              <Box flexDirection="column">
                <Typography width="100%">
                  Deposit period has been completed.
                </Typography>
              </Box>
            </WarningBox>
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
            ) : approveBtn &&
              formType === FormType.DEPOSIT &&
              walletBalance !== "0" ? (
              <ButtonPrimary
                onClick={approve}
                disabled={
                  !!Object.keys(errors).length ||
                  (isTfVaultType && activeTfPeriod > 0)
                }
              >
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
                  !!Object.keys(errors).length ||
                  (isTfVaultType && activeTfPeriod > 0) ||
                  (formType === FormType.WITHDRAW &&
                    !!withdrawLimitExceeded(formToken))
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
