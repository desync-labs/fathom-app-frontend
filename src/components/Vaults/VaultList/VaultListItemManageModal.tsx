import { FC, memo } from "react";
import { FormProvider } from "react-hook-form";
import {
  Box,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";
import BigNumber from "bignumber.js";

import { IVault, IVaultPosition } from "fathom-sdk";
import useVaultManageDeposit, {
  FormType,
} from "hooks/Vaults/useVaultManageDeposit";
import useConnector from "context/connector";

import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import ManageVaultForm from "components/Vaults/VaultList/ManageVaultModal/ManageVaultForm";
import ManageVaultInfo from "components/Vaults/VaultList/ManageVaultModal/ManageVaultInfo";
import { AppNavItem } from "components/AppComponents/AppTabs/AppTabs";
import {
  ButtonPrimary,
  ButtonSecondary,
  ModalButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";
import WalletConnectBtn from "components/Common/WalletConnectBtn";
import { InfoIcon } from "components/Governance/Propose";
import VaultModalLockingBar from "components/Vaults/VaultList/DepositVaultModal/VaultModalLockingBar";
import {
  BaseDialogNavWrapper,
  BaseDialogWrapper,
} from "components/Base/Dialog/StyledDialog";
import {
  BaseErrorBox,
  BaseInfoBox,
  BaseWarningBox,
} from "components/Base/Boxes/StyledBoxes";

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
    <BaseDialogWrapper
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
      data-testid="vault-listItemManageModal"
    >
      <AppDialogTitle
        id="customized-dialog-title"
        onClose={onClose}
        sx={{ padding: "24px" }}
        sxCloseIcon={{ right: "16px", top: "16px" }}
        data-testid="vault-listItemManageModal-dialogTitle"
      >
        {shutdown ? (
          "Withdrawing"
        ) : (
          <BaseDialogNavWrapper>
            <AppNavItem
              onClick={() => setFormType(FormType.DEPOSIT)}
              className={formType === FormType.DEPOSIT ? "active" : ""}
              data-testid="vault-listItemManageModal-depositNavItem"
            >
              Deposit
            </AppNavItem>
            <AppNavItem
              onClick={() => setFormType(FormType.WITHDRAW)}
              className={formType === FormType.WITHDRAW ? "active" : ""}
              data-testid="vault-listItemManageModal-withdrawNavItem"
            >
              Withdraw
            </AppNavItem>
          </BaseDialogNavWrapper>
        )}
      </AppDialogTitle>

      <DialogContent>
        <FormProvider {...methods}>
          <Box>
            {isTfVaultType && (
              <VaultModalLockingBar
                tfVaultLockEndDate={tfVaultLockEndDate}
                tfVaultDepositEndDate={tfVaultDepositEndDate}
                activeTfPeriod={activeTfPeriod}
              />
            )}

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
              dataTestIdPrefix="vault-listItemManageModal"
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
                <BaseErrorBox sx={{ marginBottom: 0 }}>
                  <InfoIcon />
                  <Typography>
                    Wallet balance is not enough to deposit.
                  </Typography>
                </BaseErrorBox>
              )}
            {formType === FormType.WITHDRAW &&
              withdrawLimitExceeded(formToken) && (
                <BaseErrorBox sx={{ marginBottom: 0 }}>
                  <InfoIcon />
                  <Typography>{withdrawLimitExceeded(formToken)}</Typography>
                </BaseErrorBox>
              )}
            {activeTfPeriod === 1 && (
              <BaseWarningBox>
                <InfoIcon
                  sx={{ width: "20px", color: "#F5953D", height: "20px" }}
                />
                <Box flexDirection="column">
                  <Typography width="100%">
                    Deposit period has been completed.
                  </Typography>
                </Box>
              </BaseWarningBox>
            )}
            {approveBtn &&
              formType === FormType.DEPOSIT &&
              walletBalance !== "0" && (
                <BaseInfoBox>
                  <InfoIcon />
                  <Box flexDirection="column">
                    <Typography width="100%">
                      First-time connect? Please allow token approval in your
                      MetaMask
                    </Typography>
                  </Box>
                </BaseInfoBox>
              )}
          </Box>
          <ModalButtonWrapper>
            <ButtonSecondary
              onClick={onClose}
              disabled={approvalPending || openDepositLoading}
              data-testid="vault-listItemManageModal-closeButton"
            >
              Close
            </ButtonSecondary>
            {!account ? (
              <WalletConnectBtn />
            ) : approveBtn &&
              formType === FormType.DEPOSIT &&
              walletBalance !== "0" ? (
              <ButtonPrimary
                onClick={approve}
                disabled={
                  !!Object.keys(errors).length ||
                  (isTfVaultType && activeTfPeriod > 0) ||
                  approvalPending
                }
                data-testid="vault-listItemManageModal-approveTokenButton"
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
                data-testid={`vault-listItemManageModal-${
                  formType === FormType.DEPOSIT
                    ? "depositButton"
                    : "withdrawButton"
                }`}
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
    </BaseDialogWrapper>
  );
};

export default memo(VaultListItemManageModal);
