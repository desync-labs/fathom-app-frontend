import { FC } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import BigNumber from "bignumber.js";

import { IVault } from "hooks/useVaultList";
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

const DepositVaultItemFormWrapper = styled(Grid)`
  padding-left: 20px;
  width: calc(50% - 1px);
  position: relative;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

const ManageVaultForm = styled("form")`
  padding-bottom: 45px;
`;

type VaultDepositFormProps = {
  isMobile: boolean;
  onClose: () => void;
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
  sharedToken: string;
  approveBtn: boolean;
  approvalPending: boolean;
  openDepositLoading: boolean;
  errors: FieldErrors<{
    deposit: string;
    sharedToken: string;
  }>;
  approve: () => Promise<void>;
  setMax: (walletBalance: string) => void;
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
  isMobile,
  onClose,
  vaultItemData,
  walletBalance,
  isWalletFetching,
  control,
  deposit,
  sharedToken,
  approveBtn,
  approvalPending,
  openDepositLoading,
  errors,
  approve,
  setMax,
  handleSubmit,
  onSubmit,
}) => {
  const { token, shareToken, depositLimit, balanceTokens } = vaultItemData;
  return (
    <DepositVaultItemFormWrapper item>
      <ManageVaultForm
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <Summary>Summary</Summary>
        <Controller
          control={control}
          name="deposit"
          rules={{
            required: true,
            min: 0.1,
            max: BigNumber(walletBalance)
              .dividedBy(10 ** 18)
              .toNumber(),
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
                          You do not have enough money in your wallet
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
              <MaxButton onClick={() => setMax(walletBalance)}>Max</MaxButton>
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
        <AppList>
          <AppListItem
            alignItems="flex-start"
            secondaryAction={<>{(deposit || "0") + " " + token.name}</>}
          >
            <ListItemText primary="Depositing" />
          </AppListItem>
          <AppListItem
            alignItems="flex-start"
            secondaryAction={
              <>
                {BigNumber(sharedToken || "0").toFormat(6) +
                  " " +
                  shareToken.name}
              </>
            }
          >
            <ListItemText primary="Receiving" />
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
          (BigNumber(walletBalance)
            .dividedBy(10 ** 18)
            .isLessThan(BigNumber(deposit)) ||
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
            ) : (
              "Deposit"
            )}
          </ButtonPrimary>
          {isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
        </ButtonsWrapper>
      </ManageVaultForm>
    </DepositVaultItemFormWrapper>
  );
};

export default DepositVaultForm;
