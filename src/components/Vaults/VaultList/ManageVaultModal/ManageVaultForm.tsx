import { FC, memo, useMemo } from "react";
import { Box, styled } from "@mui/material";
import BigNumber from "bignumber.js";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";

import { IVault, IVaultPosition } from "fathom-sdk";
import { FormType } from "hooks/Vaults/useVaultManageDeposit";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";
import usePricesContext from "context/prices";

import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import { InfoIcon } from "components/Governance/Propose";
import {
  BaseDialogFormWrapper,
  BaseFormInputErrorWrapper,
  BaseFormInputLabel,
  BaseFormInputLogo,
  BaseFormInputUsdIndicator,
  BaseFormInputWrapper,
  BaseFormLabelRow,
  BaseFormSetMaxButton,
  BaseFormTextField,
  BaseFormWalletBalance,
} from "components/Base/Form/StyledForm";

const ManageVaultFormStyled = styled("form")`
  padding-bottom: 0;
`;

type VaultManageFormProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  balanceToken: string;
  walletBalance: string;
  control: Control<
    {
      formToken: string;
      formSharedToken: string;
    },
    any
  >;
  formType: FormType;
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
  depositLimitExceeded: (value: string) => string | boolean;
  dataTestIdPrefix?: string;
};

const ManageVaultForm: FC<VaultManageFormProps> = ({
  vaultItemData,
  balanceToken,
  walletBalance,
  control,
  formType,
  setMax,
  validateMaxValue,
  handleSubmit,
  onSubmit,
  depositLimitExceeded,
  dataTestIdPrefix,
}) => {
  const { token, balanceTokens, depositLimit, shutdown } = vaultItemData;
  const { fxdPrice } = usePricesContext();
  const formattedBalanceToken = useMemo(
    () =>
      BigNumber(balanceToken)
        .dividedBy(10 ** 18)
        .toNumber(),
    [balanceToken]
  );

  return (
    <BaseDialogFormWrapper>
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
            <BaseFormInputWrapper>
              <BaseFormLabelRow>
                <BaseFormInputLabel>
                  {formType === FormType.DEPOSIT
                    ? `Deposit ${token?.name}`
                    : `Withdraw ${token?.name}`}
                </BaseFormInputLabel>
                <AppFlexBox sx={{ width: "auto", justifyContent: "flex-end" }}>
                  <BaseFormWalletBalance>
                    {formType === FormType.DEPOSIT
                      ? "Balance: " +
                        formatNumber(
                          BigNumber(walletBalance)
                            .dividedBy(10 ** 18)
                            .toNumber()
                        ) +
                        " " +
                        token?.name
                      : "Vault Available: " +
                        formatNumber(formattedBalanceToken) +
                        " " +
                        token?.name}
                  </BaseFormWalletBalance>
                </AppFlexBox>
              </BaseFormLabelRow>
              <BaseFormTextField
                error={!!error}
                id="outlined-helperText"
                placeholder={"0"}
                helperText={
                  <>
                    {!shutdown && depositLimitExceeded(value) && (
                      <BaseFormInputErrorWrapper>
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
                          {depositLimitExceeded(value)}
                        </Box>
                      </BaseFormInputErrorWrapper>
                    )}
                    {error && error.type === "required" && (
                      <BaseFormInputErrorWrapper>
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
                      </BaseFormInputErrorWrapper>
                    )}
                    {error && error.type === "validate" && (
                      <BaseFormInputErrorWrapper>
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
                      </BaseFormInputErrorWrapper>
                    )}
                    {error && error.type === "min" && (
                      <BaseFormInputErrorWrapper>
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
                      </BaseFormInputErrorWrapper>
                    )}
                  </>
                }
                value={value}
                type="number"
                onChange={onChange}
                data-testid={
                  dataTestIdPrefix !== undefined
                    ? `${dataTestIdPrefix}-${
                        formType === FormType.DEPOSIT
                          ? "depositInputWrapper"
                          : "withdrawInputWrapper"
                      }`
                    : null
                }
              />
              <BaseFormInputUsdIndicator>{`$${formatNumber(
                BigNumber(value || 0)
                  .multipliedBy(fxdPrice)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )}`}</BaseFormInputUsdIndicator>
              <BaseFormInputLogo
                className={"extendedInput"}
                src={getTokenLogoURL(token?.symbol)}
                alt={token?.name}
              />
              <BaseFormSetMaxButton
                onClick={() => setMax()}
                data-testid={
                  dataTestIdPrefix !== undefined
                    ? `${dataTestIdPrefix}-${
                        formType === FormType.DEPOSIT
                          ? "depositInput-maxButton"
                          : "withdrawInput-maxButton"
                      }`
                    : null
                }
              >
                Max
              </BaseFormSetMaxButton>
            </BaseFormInputWrapper>
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
              <BaseFormInputWrapper>
                <BaseFormLabelRow>
                  <BaseFormInputLabel>
                    {formType === FormType.DEPOSIT
                      ? "Receive shares token"
                      : "Burn Shares token"}
                  </BaseFormInputLabel>
                </BaseFormLabelRow>
                <BaseFormTextField
                  error={!!error}
                  id="outlined-helperText"
                  helperText={
                    <>
                      {error && error.type === "max" && (
                        <BaseFormInputErrorWrapper>
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
                        </BaseFormInputErrorWrapper>
                      )}
                    </>
                  }
                  value={value}
                  type="number"
                  placeholder={"0"}
                  onChange={onChange}
                  disabled
                  data-testid={
                    dataTestIdPrefix !== undefined
                      ? `${dataTestIdPrefix}-${
                          formType === FormType.DEPOSIT
                            ? "receiveSharesInputWrapper"
                            : "burnSharesInputWrapper"
                        }`
                      : null
                  }
                />
                <BaseFormInputLogo src={getTokenLogoURL("FXD")} />
              </BaseFormInputWrapper>
            );
          }}
        />
      </ManageVaultFormStyled>
    </BaseDialogFormWrapper>
  );
};

export default memo(ManageVaultForm);
