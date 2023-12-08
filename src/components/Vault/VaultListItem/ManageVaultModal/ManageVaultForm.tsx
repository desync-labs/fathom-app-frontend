import { FC } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import BigNumber from "bignumber.js";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";

import { IVault } from "hooks/useVaultList";
import { FormType } from "hooks/useVaultManageDeposit";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";

import {
  ErrorBox,
  InfoBox,
  Summary,
  WalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonsWrapper,
  ManagePositionRepayTypeWrapper,
  ManageTypeButton,
  MaxButton,
} from "components/AppComponents/AppButton/AppButton";
import {
  AppFormInputErrorWrapper,
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { InfoIcon } from "components/Governance/Propose";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";

const ManageVaultItemFormWrapper = styled(Grid)`
  padding-left: 20px;
  width: calc(50% - 1px);
  position: relative;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

const ManageVaultItemDepositedBox = styled(Box)`
  padding: 20px 0;
`;

const ManageVaultFormStyled = styled("form")`
  padding-bottom: 45px;
`;

type VaultManageFormProps = {
  vaultItemData: IVault;
  vaultPosition: any;
  isMobile: boolean;
  onClose: () => void;
  walletBalance: string;
  isWalletFetching: boolean;
  control: Control<
    {
      formToken: string;
      formSharedToken: string;
    },
    any
  >;
  formToken: string;
  formSharedToken: string;
  approveBtn: boolean;
  approvalPending: boolean;
  formType: FormType;
  openDepositLoading: boolean;
  errors: FieldErrors<{
    formToken: string;
    formSharedToken: string;
  }>;
  setFormType: React.Dispatch<React.SetStateAction<FormType>>;
  approve: () => Promise<void>;
  setMax: (walletBalance: string, balancePosition: string) => void;
  handleSubmit: UseFormHandleSubmit<
    {
      formToken: string;
      formSharedToken: string;
    },
    undefined
  >;
  onSubmit: () => Promise<void>;
};

const ManageVaultForm: FC<VaultManageFormProps> = ({
  vaultItemData,
  vaultPosition,
  isMobile,
  onClose,
  walletBalance,
  isWalletFetching,
  control,
  formToken,
  formSharedToken,
  approveBtn,
  approvalPending,
  formType,
  openDepositLoading,
  errors,
  setFormType,
  approve,
  setMax,
  handleSubmit,
  onSubmit,
}) => {
  const { token, shareToken, balanceTokens, depositLimit } = vaultItemData;
  const { balancePosition } = vaultPosition;

  return (
    <ManageVaultItemFormWrapper item>
      <ManageVaultFormStyled
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <Summary>Summary</Summary>
        <ManagePositionRepayTypeWrapper>
          <ManageTypeButton
            sx={{ marginRight: "5px" }}
            className={`${formType === FormType.DEPOSIT ? "active" : null}`}
            onClick={() => setFormType(FormType.DEPOSIT)}
          >
            Deposit
          </ManageTypeButton>
          <ManageTypeButton
            className={`${formType === FormType.WITHDRAW ? "active" : null}`}
            onClick={() => setFormType(FormType.WITHDRAW)}
          >
            Withdraw
          </ManageTypeButton>
        </ManagePositionRepayTypeWrapper>
        <ManageVaultItemDepositedBox>
          <Typography variant="subtitle2" color="#B7C8E5">
            {token.name} Deposited:
          </Typography>
          <Typography component="span">
            {BigNumber(balancePosition)
              .dividedBy(10 ** 18)
              .toFormat(0) +
              " " +
              token.name}
          </Typography>
        </ManageVaultItemDepositedBox>
        <Controller
          control={control}
          name="formToken"
          rules={{
            required: false,
            min: 0.00000000000000001,
            max:
              formType === FormType.DEPOSIT
                ? BigNumber(walletBalance)
                    .dividedBy(10 ** 18)
                    .toNumber()
                : BigNumber(balancePosition)
                    .dividedBy(10 ** 18)
                    .toNumber(),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppFormInputWrapper>
              <AppFormLabel>
                {formType === FormType.DEPOSIT
                  ? `Deposit ${token.name}`
                  : `Withdraw ${token.name}`}
              </AppFormLabel>
              <WalletBalance>
                {formType === FormType.DEPOSIT
                  ? "Wallet Available: " +
                    formatNumber(
                      BigNumber(walletBalance)
                        .dividedBy(10 ** 18)
                        .toNumber()
                    ) +
                    " " +
                    token.name
                  : "Vault Available: " +
                    formatNumber(
                      BigNumber(balancePosition)
                        .dividedBy(10 ** 18)
                        .toNumber()
                    ) +
                    " " +
                    token.name}
              </WalletBalance>
              <AppTextField
                error={!!error}
                id="outlined-helperText"
                placeholder={"0"}
                helperText={
                  <>
                    {error && error.type === "max" && (
                      <AppFormInputErrorWrapper>
                        <InfoIcon
                          sx={{
                            float: "left",
                            width: "14px",
                            height: "14px",
                            marginRight: "0",
                          }}
                        />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          You don't have enough to repay that amount
                        </Box>
                      </AppFormInputErrorWrapper>
                    )}
                    {error && error.type === "min" && (
                      <AppFormInputErrorWrapper>
                        <InfoIcon
                          sx={{
                            float: "left",
                            width: "14px",
                            height: "14px",
                            marginRight: "0",
                          }}
                        />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          Deposit amount should be positive.
                        </Box>
                      </AppFormInputErrorWrapper>
                    )}
                  </>
                }
                value={value}
                type="number"
                onChange={onChange}
              />
              <AppFormInputLogo src={getTokenLogoURL(token.symbol)} />
              <MaxButton onClick={() => setMax(walletBalance, balancePosition)}>
                Max
              </MaxButton>
            </AppFormInputWrapper>
          )}
        />
        <Controller
          control={control}
          name="formSharedToken"
          rules={{
            max:
              formType === FormType.DEPOSIT
                ? BigNumber(depositLimit)
                    .minus(BigNumber(balanceTokens))
                    .dividedBy(10 ** 18)
                    .toNumber()
                : undefined,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <AppFormInputWrapper>
                <AppFormLabel>
                  {formType === FormType.DEPOSIT
                    ? "Receive shares token"
                    : "Burn Shares token"}
                </AppFormLabel>
                <AppTextField
                  error={!!error}
                  id="outlined-helperText"
                  helperText={
                    <>
                      {error && error.type === "max" && (
                        <AppFormInputErrorWrapper>
                          <InfoIcon
                            sx={{
                              float: "left",
                              width: "14px",
                              height: "14px",
                              marginRight: "0",
                            }}
                          />
                          <Box
                            component={"span"}
                            sx={{ fontSize: "12px", paddingLeft: "6px" }}
                          >
                            Maximum available share token is{" "}
                            {formatNumber(
                              BigNumber(depositLimit)
                                .minus(BigNumber(balanceTokens))
                                .dividedBy(10 ** 18)
                                .toNumber()
                            )}
                            .
                          </Box>
                        </AppFormInputErrorWrapper>
                      )}
                    </>
                  }
                  value={value}
                  type="number"
                  placeholder={"0"}
                  onChange={onChange}
                  disabled
                />
                <AppFormInputLogo src={getTokenLogoURL("FXD")} />
              </AppFormInputWrapper>
            );
          }}
        />
        <AppList>
          <AppListItem
            alignItems="flex-start"
            secondaryAction={
              <>{BigNumber(formToken || "0").toFormat(2) + " " + token.name}</>
            }
          >
            <ListItemText
              primary={
                formType === FormType.DEPOSIT ? "Depositing" : "Withdrawing"
              }
            />
          </AppListItem>
          <AppListItem
            alignItems="flex-start"
            secondaryAction={
              <>
                {BigNumber(formSharedToken || "0").toFormat(6) +
                  " " +
                  shareToken.name}
              </>
            }
          >
            <ListItemText
              primary={formType === FormType.DEPOSIT ? "Receiving" : "Burning"}
            />
          </AppListItem>
        </AppList>
        {approveBtn && walletBalance !== "0" && (
          <InfoBox sx={{ alignItems: "flex-start" }}>
            <InfoIcon />
            <Box flexDirection="column">
              <Typography width="100%">
                First-time connect? Please allow token approval in your MetaMask
              </Typography>
              <ButtonPrimary onClick={approve} style={{ margin: "16px 0" }}>
                {" "}
                {approvalPending ? (
                  <CircularProgress size={20} sx={{ color: "#0D1526" }} />
                ) : (
                  "Approve token"
                )}{" "}
              </ButtonPrimary>
            </Box>
          </InfoBox>
        )}
        {isWalletFetching &&
          formType === FormType.DEPOSIT &&
          (BigNumber(walletBalance)
            .dividedBy(10 ** 18)
            .isLessThan(BigNumber(formToken)) ||
            walletBalance == "0") && (
            <ErrorBox>
              <InfoIcon />
              <Typography>Wallet balance is not enough to deposit.</Typography>
            </ErrorBox>
          )}
        <ButtonsWrapper>
          {!isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
          <ButtonPrimary
            type="submit"
            disabled={
              openDepositLoading || approveBtn || !!Object.keys(errors).length
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
          {isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
        </ButtonsWrapper>
      </ManageVaultFormStyled>
    </ManageVaultItemFormWrapper>
  );
};

export default ManageVaultForm;
