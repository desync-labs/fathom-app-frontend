import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import {
  Box,
  CircularProgress,
  Divider,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import { IVault, IVaultPosition } from "fathom-sdk";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { FormType } from "hooks/Vaults/useVaultManageDeposit";
import { formatNumber, formatPercentage } from "utils/format";
import useConnector from "context/connector";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import {
  ErrorBox,
  InfoBoxV2,
  SummaryVaultFormInfo,
} from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ButtonSecondary,
  VaultDetailFormButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";
import { InfoIcon } from "components/Governance/Propose";
import WalletConnectBtn from "components/Common/WalletConnectBtn";

const ManageVaultInfoWrapper = styled(Box)`
  position: relative;
  width: 50%;
  padding: 0;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

const VaultList = styled(AppList)`
  & li {
    color: #fff;
    align-items: flex-start;
    padding: 4px 0;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    & li {
      font-size: 12px;
      font-weight: 400;
      padding: 2px 0;

      & .MuiListItemSecondaryAction-root span {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
`;

type VaultManageInfoProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  formToken: string;
  formSharedToken: string;
  formType: FormType;
  isWalletFetching: boolean;
  walletBalance: string;
  onClose: () => void;
  openDepositLoading: boolean;
  errors: FieldErrors<{
    formToken: string;
    formSharedToken: string;
  }>;
  approveBtn: boolean;
  approve: () => void;
  approvalPending: boolean;
  handleSubmit: UseFormHandleSubmit<
    {
      formToken: string;
      formSharedToken: string;
    },
    undefined
  >;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  withdrawLimitExceeded: (value: string) => string | boolean;
};

const ManageVaultInfo: FC<VaultManageInfoProps> = ({
  formType,
  vaultItemData,
  vaultPosition,
  formToken,
  formSharedToken,
  approve,
  approvalPending,
  isWalletFetching,
  walletBalance,
  onClose,
  openDepositLoading,
  errors,
  approveBtn,
  handleSubmit,
  onSubmit,
  withdrawLimitExceeded,
}) => {
  const { token, shareToken, sharesSupply } = vaultItemData;
  const { balancePosition, balanceShares } = vaultPosition;
  const { account } = useConnector();

  return (
    <ManageVaultInfoWrapper>
      <SummaryVaultFormInfo>Summary</SummaryVaultFormInfo>
      <Divider sx={{ borderColor: "#3D5580" }} />
      <VaultList>
        <AppListItem
          secondaryAction={
            <>
              {formatPercentage(
                BigNumber(balancePosition)
                  .dividedBy(10 ** 18)
                  .toNumber()
              ) +
                " " +
                token?.name +
                " "}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatPercentage(
                      BigNumber(balancePosition)
                        .dividedBy(10 ** 18)
                        .plus(BigNumber(formToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    token?.name +
                    " "
                  : formatPercentage(
                      Math.max(
                        BigNumber(balancePosition)
                          .dividedBy(10 ** 18)
                          .minus(BigNumber(formToken || "0"))
                          .toNumber(),
                        0
                      )
                    ) +
                    " " +
                    token?.name +
                    " "}
              </Box>
            </>
          }
        >
          <ListItemText primary={token?.name + " Deposited"} />
        </AppListItem>
        <AppListItem
          secondaryAction={
            <>
              {`${formatNumber(
                BigNumber(balanceShares)
                  .dividedBy(BigNumber(sharesSupply))
                  .multipliedBy(100)
                  .toNumber()
              )} %`}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatNumber(
                      BigNumber(balanceShares)
                        .plus(
                          BigNumber(formSharedToken || "0").multipliedBy(
                            10 ** 18
                          )
                        )
                        .dividedBy(
                          BigNumber(sharesSupply).plus(
                            BigNumber(formSharedToken || "0").multipliedBy(
                              10 ** 18
                            )
                          )
                        )
                        .multipliedBy(100)
                        .toNumber()
                    )
                  : BigNumber(formSharedToken)
                      .multipliedBy(10 ** 18)
                      .isEqualTo(BigNumber(sharesSupply))
                  ? "0"
                  : formatNumber(
                      Math.max(
                        BigNumber(balanceShares)
                          .minus(
                            BigNumber(formSharedToken || "0").multipliedBy(
                              10 ** 18
                            )
                          )
                          .dividedBy(
                            BigNumber(sharesSupply).minus(
                              BigNumber(formSharedToken || "0").multipliedBy(
                                10 ** 18
                              )
                            )
                          )
                          .multipliedBy(100)
                          .toNumber(),
                        0
                      )
                    )}{" "}
                %
              </Box>
            </>
          }
        >
          <ListItemText primary="Pool share" />
        </AppListItem>
        <AppListItem
          secondaryAction={
            <>
              {formatPercentage(
                BigNumber(balanceShares)
                  .dividedBy(10 ** 18)
                  .toNumber()
              ) +
                " " +
                shareToken?.symbol +
                " "}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatPercentage(
                      BigNumber(balanceShares)
                        .dividedBy(10 ** 18)
                        .plus(BigNumber(formSharedToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    shareToken?.symbol
                  : formatPercentage(
                      Math.max(
                        BigNumber(balanceShares)
                          .dividedBy(10 ** 18)
                          .minus(BigNumber(formSharedToken || "0"))
                          .toNumber(),
                        0
                      )
                    ) +
                    " " +
                    shareToken?.symbol}{" "}
              </Box>
            </>
          }
        >
          <ListItemText primary="Share tokens" />
        </AppListItem>
      </VaultList>
      {isWalletFetching &&
        formType === FormType.DEPOSIT &&
        (BigNumber(walletBalance)
          .dividedBy(10 ** 18)
          .isLessThan(formToken) ||
          walletBalance == "0") && (
          <ErrorBox sx={{ marginBottom: 0 }}>
            <InfoIcon />
            <Typography>Wallet balance is not enough to deposit.</Typography>
          </ErrorBox>
        )}
      {formType === FormType.WITHDRAW && withdrawLimitExceeded(formToken) && (
        <ErrorBox sx={{ marginBottom: 0 }}>
          <InfoIcon />
          <Typography>{withdrawLimitExceeded(formToken)}</Typography>
        </ErrorBox>
      )}
      {approveBtn && formType === FormType.DEPOSIT && walletBalance !== "0" && (
        <InfoBoxV2>
          <InfoIcon />
          <Box flexDirection="column">
            <Typography width="100%">
              First-time connect? Please allow token approval in your MetaMask
            </Typography>
          </Box>
        </InfoBoxV2>
      )}
      <VaultDetailFormButtonWrapper>
        <ButtonSecondary
          className={"reset"}
          onClick={onClose}
          disabled={approvalPending || openDepositLoading}
          data-testid="vault-detailManageModal-resetButton"
        >
          Reset
        </ButtonSecondary>
        {!account ? (
          <WalletConnectBtn />
        ) : approveBtn &&
          formType === FormType.DEPOSIT &&
          walletBalance !== "0" ? (
          <ButtonPrimary
            onClick={approve}
            disabled={!!Object.keys(errors).length || approvalPending}
            data-testid="vault-detailManageModal-approveButton"
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
              (formType === FormType.WITHDRAW &&
                !!withdrawLimitExceeded(formToken))
            }
            isLoading={openDepositLoading}
            data-testid={`vault-detailManageModal-${
              formType === FormType.DEPOSIT ? "depositButton" : "withdrawButton"
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
      </VaultDetailFormButtonWrapper>
    </ManageVaultInfoWrapper>
  );
};

export default memo(ManageVaultInfo);
