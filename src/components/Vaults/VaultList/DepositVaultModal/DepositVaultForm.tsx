import { FC } from "react";
import { Box, CircularProgress, Typography, styled } from "@mui/material";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import BigNumber from "bignumber.js";

import { IVault } from "fathom-sdk";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";

import {
  ErrorBox,
  InfoBox,
  WalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
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

const DepositVaultItemFormWrapper = styled(Box)`
  position: relative;
  width: 100%;
  border-radius: 12px;
  background: #1e2f4d;
  padding: 24px 16px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0;
  }
`;

const ManageVaultForm = styled("form")`
  padding-bottom: 45px;
`;

type VaultDepositFormProps = {
  vaultItemData: IVault;
  walletBalance: string;
  isWalletFetching: boolean;
  control: Control<
    {
      deposit: string;
      sharedToken: string;
    },
    any
  >;
  deposit: string;
  approveBtn: boolean;
  approvalPending: boolean;
  approve: () => Promise<void>;
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
};

const DepositVaultForm: FC<VaultDepositFormProps> = ({
  vaultItemData,
  walletBalance,
  isWalletFetching,
  control,
  deposit,
  approveBtn,
  approvalPending,
  approve,
  setMax,
  validateMaxDepositValue,
  handleSubmit,
  onSubmit,
}) => {
  const { token, depositLimit, balanceTokens } = vaultItemData;
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
            min: 0.0000000001,
            validate: validateMaxDepositValue,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppFormInputWrapper>
              <AppFormLabel>Deposit {token.name}</AppFormLabel>
              <WalletBalance>
                Wallet Available:{" "}
                {formatNumber(
                  BigNumber(walletBalance)
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
              <AppFormInputLogo
                src={getTokenLogoURL(token.symbol)}
                alt={token.name}
              />
              <MaxButton onClick={() => setMax()}>Max</MaxButton>
            </AppFormInputWrapper>
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
              <AppFormInputWrapper>
                <AppFormLabel>Receive shares token</AppFormLabel>
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
        {approveBtn && walletBalance !== "0" && (
          <InfoBox sx={{ alignItems: "flex-start", padding: "16px" }}>
            <InfoIcon />
            <Box flexDirection="column">
              <Typography width="100%">
                First-time connect? Please allow token approval in your MetaMask
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
          (BigNumber(walletBalance)
            .dividedBy(10 ** 18)
            .isLessThan(BigNumber(deposit)) ||
            walletBalance == "0") && (
            <ErrorBox>
              <InfoIcon />
              <Typography>Wallet balance is not enough to deposit.</Typography>
            </ErrorBox>
          )}
      </ManageVaultForm>
    </DepositVaultItemFormWrapper>
  );
};

export default DepositVaultForm;
