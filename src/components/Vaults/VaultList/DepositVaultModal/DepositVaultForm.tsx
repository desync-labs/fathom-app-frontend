import { FC } from "react";
import { Box, styled } from "@mui/material";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import BigNumber from "bignumber.js";

import { IVault } from "fathom-sdk";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";
import usePricesContext from "context/prices";

import {
  AppFlexBox,
  VaultWalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import { MaxButtonV2 } from "components/AppComponents/AppButton/AppButton";
import {
  AppFormInputErrorWrapper,
  AppFormInputLogoV2,
  AppFormInputUsdIndicator,
  AppFormInputWrapperV2,
  AppFormLabelRow,
  AppFormLabelV2,
  AppTextFieldV2,
} from "components/AppComponents/AppForm/AppForm";
import { InfoIcon } from "components/Governance/Propose";

const DepositVaultItemFormWrapper = styled(Box)`
  position: relative;
  width: 100%;
  border-radius: 12px;
  background: #1e2f4d;
  padding: 24px 16px;
`;

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
  onSubmit: () => Promise<void>;
  minimumDeposit: number;
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
}) => {
  const { token, depositLimit, balanceTokens } = vaultItemData;
  const { fxdPrice } = usePricesContext();

  return (
    <DepositVaultItemFormWrapper>
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
            <AppFormInputWrapperV2>
              <AppFormLabelRow>
                <AppFormLabelV2>Deposit {token.name}</AppFormLabelV2>
                <AppFlexBox sx={{ width: "auto", justifyContent: "flex-end" }}>
                  <VaultWalletBalance>
                    Balance:{" "}
                    {formatNumber(
                      BigNumber(walletBalance)
                        .dividedBy(10 ** 18)
                        .toNumber()
                    ) +
                      " " +
                      token.name}
                  </VaultWalletBalance>
                </AppFlexBox>
              </AppFormLabelRow>
              <AppTextFieldV2
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
                          Minimum deposit is {formatNumber(minimumDeposit)}
                        </Box>
                      </AppFormInputErrorWrapper>
                    )}
                  </>
                }
                value={value}
                type="number"
                onChange={onChange}
              />
              <AppFormInputUsdIndicator>{`$${formatNumber(
                BigNumber(value || 0)
                  .multipliedBy(fxdPrice)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )}`}</AppFormInputUsdIndicator>
              <AppFormInputLogoV2
                className={"extendedInput"}
                src={getTokenLogoURL(token.symbol)}
                alt={token.name}
              />
              <MaxButtonV2 onClick={() => setMax()}>Max</MaxButtonV2>
            </AppFormInputWrapperV2>
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
              <AppFormInputWrapperV2>
                <AppFormLabelRow>
                  <AppFormLabelV2>Receive shares token</AppFormLabelV2>
                </AppFormLabelRow>
                <AppTextFieldV2
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
                <AppFormInputLogoV2 src={getTokenLogoURL("FXD")} />
              </AppFormInputWrapperV2>
            );
          }}
        />
      </ManageVaultForm>
    </DepositVaultItemFormWrapper>
  );
};

export default DepositVaultForm;
