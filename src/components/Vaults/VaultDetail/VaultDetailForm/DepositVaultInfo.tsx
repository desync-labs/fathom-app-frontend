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
import { IVault } from "fathom-sdk";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { formatNumber, formatPercentage } from "utils/format";
import useConnector from "context/connector";
import useVaultContext from "context/vault";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import {
  ErrorBox,
  InfoBoxV2,
  SummaryVaultFormInfo,
  WarningBox,
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

type DepositVaultInfoProps = {
  vaultItemData: IVault;
  deposit: string;
  sharedToken: string;
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
      deposit: string;
      sharedToken: string;
    },
    undefined
  >;
  onSubmit: (values: Record<string, any>) => Promise<void>;
};

const DepositVaultInfo: FC<DepositVaultInfoProps> = ({
  vaultItemData,
  deposit,
  sharedToken,
  isWalletFetching,
  walletBalance,
  onClose,
  approve,
  approvalPending,
  openDepositLoading,
  errors,
  approveBtn,
  handleSubmit,
  onSubmit,
}) => {
  const { isTfVaultType, isUserKycPassed } = useVaultContext();
  const { token, shareToken, sharesSupply } = vaultItemData;
  const { account } = useConnector();

  return (
    <ManageVaultInfoWrapper>
      <SummaryVaultFormInfo>Summary</SummaryVaultFormInfo>
      <Divider sx={{ borderColor: "#3D5580" }} />
      <VaultList>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 {token?.name + " "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                → {formatPercentage(Number(deposit || "0")) + " " + token?.name}
              </Box>
            </>
          }
        >
          <ListItemText primary={token?.name + " Deposited"} />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 %{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                →{" "}
                {BigNumber(sharedToken).isGreaterThan(0) ||
                BigNumber(sharesSupply).isGreaterThan(0)
                  ? formatNumber(
                      BigNumber(sharedToken || "0")
                        .multipliedBy(10 ** 18)
                        .dividedBy(
                          BigNumber(sharesSupply).plus(
                            BigNumber(sharedToken || "0").multipliedBy(10 ** 18)
                          )
                        )
                        .times(100)
                        .toNumber()
                    )
                  : "0"}{" "}
                %
              </Box>
            </>
          }
        >
          <ListItemText primary="Pool share" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {`0 ${shareToken?.symbol} `}
              <Box component="span" sx={{ color: "#29C20A" }}>
                →{" "}
                {formatPercentage(Number(sharedToken || "0")) +
                  " " +
                  shareToken?.symbol}
              </Box>
            </>
          }
        >
          <ListItemText primary="Share tokens" />
        </AppListItem>
      </VaultList>
      {isWalletFetching &&
        (BigNumber(walletBalance)
          .dividedBy(10 ** 18)
          .isLessThan(BigNumber(deposit)) ||
          walletBalance == "0") && (
          <ErrorBox sx={{ marginBottom: 0 }}>
            <InfoIcon />
            <Typography>Wallet balance is not enough to deposit.</Typography>
          </ErrorBox>
        )}
      {approveBtn && BigNumber(walletBalance).isGreaterThan(0) && (
        <InfoBoxV2>
          <InfoIcon />
          <Box flexDirection="column">
            <Typography width="100%">
              First-time connect? Please allow token approval in your MetaMask
            </Typography>
          </Box>
        </InfoBoxV2>
      )}
      {isTfVaultType && !isUserKycPassed && (
        <WarningBox>
          <InfoIcon sx={{ width: "20px", color: "#F5953D", height: "20px" }} />
          <Box flexDirection="column">
            <Typography width="100%">
              Only KYC-verified users can deposit. Please completing KYC at{" "}
              <a
                href={"https://kyc.tradeflow.network/"}
                target={"_blank"}
                rel={"noreferrer"}
              >
                https://kyc.tradeflow.network/
              </a>
            </Typography>
          </Box>
        </WarningBox>
      )}
      <VaultDetailFormButtonWrapper>
        <ButtonSecondary
          className={"reset"}
          onClick={onClose}
          disabled={approvalPending || openDepositLoading}
          data-testid="vault-detailDepositModal-resetButton"
        >
          Reset
        </ButtonSecondary>
        {!account ? (
          <WalletConnectBtn />
        ) : approveBtn && walletBalance !== "0" ? (
          <ButtonPrimary
            onClick={approve}
            disabled={
              !!Object.keys(errors).length ||
              (isTfVaultType && !isUserKycPassed) ||
              approvalPending
            }
            data-testid="vault-detailDepositModal-approveButton"
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
              approveBtn ||
              !!Object.keys(errors).length ||
              (isTfVaultType && !isUserKycPassed)
            }
            isLoading={openDepositLoading}
            data-testid="vault-detailDepositModal-depositButton"
          >
            {openDepositLoading ? (
              <CircularProgress sx={{ color: "#0D1526" }} size={20} />
            ) : (
              "Deposit"
            )}
          </ButtonPrimary>
        )}
      </VaultDetailFormButtonWrapper>
    </ManageVaultInfoWrapper>
  );
};

export default memo(DepositVaultInfo);
