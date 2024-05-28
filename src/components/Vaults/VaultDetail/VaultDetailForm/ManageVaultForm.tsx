import { FC, memo, useMemo } from "react";
import { Box, CircularProgress, Typography, styled } from "@mui/material";
import BigNumber from "bignumber.js";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";

import { IVault, IVaultPosition } from "fathom-sdk";
import { FormType } from "hooks/useVaultManageDeposit";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";

import {
  ErrorBox,
  InfoBox,
  WalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonsWrapper,
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

const ManageVaultItemFormWrapper = styled(Box)`
  position: relative;
  border-radius: 12px;
  background: #1e2f4d;
  width: 50%;
  padding: 24px 16px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

const ManageVaultFormStyled = styled("form")`
  padding-bottom: 45px;
`;

type VaultManageFormProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  balanceToken: string;
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
  approveBtn: boolean;
  approvalPending: boolean;
  formType: FormType;
  openDepositLoading: boolean;
  errors: FieldErrors<{
    formToken: string;
    formSharedToken: string;
  }>;
  approve: () => Promise<void>;
  setMax: () => void;
  validateMaxValue: (value: string) => true | string;
  handleSubmit: UseFormHandleSubmit<
    {
      formToken: string;
      formSharedToken: string;
    },
    undefined
  >;
  onSubmit: (values: Record<string, any>) => Promise<void>;
};

const ManageVaultForm: FC<VaultManageFormProps> = ({
  vaultItemData,
  balanceToken,
  isMobile,
  onClose,
  walletBalance,
  isWalletFetching,
  control,
  formToken,
  approveBtn,
  approvalPending,
  formType,
  openDepositLoading,
  errors,
  approve,
  setMax,
  validateMaxValue,
  handleSubmit,
  onSubmit,
}) => {
  const { token, balanceTokens, depositLimit } = vaultItemData;
  const formattedBalanceToken = useMemo(
    () =>
      BigNumber(balanceToken)
        .dividedBy(10 ** 18)
        .toNumber(),
    [balanceToken]
  );

  return (
    <ManageVaultItemFormWrapper>
      <ManageVaultFormStyled
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <Controller
          control={control}
          name="formToken"
          rules={{
            required: true,
            min: 0.000000000000000000001,
            validate: validateMaxValue,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppFormInputWrapper>
              <AppFormLabel>
                {formType === FormType.DEPOSIT
                  ? `Deposit ${token.name}`
                  : `Withdraw ${token.name}`}
              </AppFormLabel>
              <WalletBalance sx={{ color: "#43FFF1" }}>
                {formType === FormType.DEPOSIT
                  ? "Balance: " +
                    formatNumber(
                      BigNumber(walletBalance)
                        .dividedBy(10 ** 18)
                        .toNumber()
                    ) +
                    " " +
                    token.name
                  : "Vault Available: " +
                    formatNumber(formattedBalanceToken) +
                    " " +
                    token.name}
              </WalletBalance>
              <AppTextField
                error={!!error}
                id="outlined-helperText"
                placeholder={"0"}
                helperText={
                  <>
                    {error && error.type === "required" && (
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
                          This field is required
                        </Box>
                      </AppFormInputErrorWrapper>
                    )}
                    {error && error.type === "validate" && (
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
                          {error.message}
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
                          This field should be positive.
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
              <MaxButton onClick={() => setMax()}>Max</MaxButton>
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
        {approveBtn &&
          formType === FormType.DEPOSIT &&
          walletBalance !== "0" && (
            <InfoBox sx={{ alignItems: "flex-start", padding: "16px" }}>
              <InfoIcon />
              <Box flexDirection="column">
                <Typography width="100%">
                  First-time connect? Please allow token approval in your
                  MetaMask
                </Typography>
                <ButtonPrimary onClick={approve} style={{ marginTop: "16px" }}>
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
          {isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
        </ButtonsWrapper>
      </ManageVaultFormStyled>
    </ManageVaultItemFormWrapper>
  );
};

export default memo(ManageVaultForm);
