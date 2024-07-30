import { FC } from "react";
import { Box, styled } from "@mui/material";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import BigNumber from "bignumber.js";

import { IVault } from "fathom-sdk";
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

const ManageVaultForm = styled("form")`
  padding-bottom: 0;
`;

type VaultDepositFormProps = {
  vaultItemData: IVault;
  walletBalance: string;
  control: Control<
    {
      deposit: string;
      sharedToken: string;
    },
    any
  >;
  setMax: () => void;
  validateMaxDepositValue: (value: string) => true | string;
  handleSubmit: UseFormHandleSubmit<
    {
      deposit: string;
      sharedToken: string;
    },
    undefined
  >;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  minimumDeposit: number;
  depositLimitExceeded: (value: string) => string | boolean;
  dataTestIdPrefix?: string;
};

const DepositVaultForm: FC<VaultDepositFormProps> = ({
  vaultItemData,
  walletBalance,
  control,
  setMax,
  validateMaxDepositValue,
  handleSubmit,
  onSubmit,
  minimumDeposit,
  depositLimitExceeded,
  dataTestIdPrefix,
}) => {
  const { token, depositLimit, balanceTokens, shutdown } = vaultItemData;
  const { fxdPrice } = usePricesContext();

  return (
    <BaseDialogFormWrapper>
      <ManageVaultForm
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <Controller
          control={control}
          name="deposit"
          rules={{
            required: true,
            min: minimumDeposit,
            validate: validateMaxDepositValue,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <BaseFormInputWrapper>
              <BaseFormLabelRow>
                <BaseFormInputLabel>Deposit {token?.name}</BaseFormInputLabel>
                <AppFlexBox sx={{ width: "auto", justifyContent: "flex-end" }}>
                  <BaseFormWalletBalance>
                    Balance:{" "}
                    {formatNumber(
                      BigNumber(walletBalance)
                        .dividedBy(10 ** 18)
                        .toNumber()
                    ) +
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
                          Minimum deposit is {formatNumber(minimumDeposit)}{" "}
                          {token?.name}
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
                    ? `${dataTestIdPrefix}-depositInputWrapper`
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
                    ? `${dataTestIdPrefix}-depositInput-maxButton`
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
          name="sharedToken"
          rules={{
            max: BigNumber(depositLimit)
              .minus(BigNumber(balanceTokens))
              .dividedBy(10 ** 18)
              .toNumber(),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <BaseFormInputWrapper>
                <BaseFormLabelRow>
                  <BaseFormInputLabel>Receive shares token</BaseFormInputLabel>
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
                      ? `${dataTestIdPrefix}-receiveSharesInputWrapper`
                      : null
                  }
                />
                <BaseFormInputLogo src={getTokenLogoURL("FXD")} />
              </BaseFormInputWrapper>
            );
          }}
        />
      </ManageVaultForm>
    </BaseDialogFormWrapper>
  );
};

export default DepositVaultForm;
