import React, { useEffect } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import {
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
import { Controller, useForm } from "react-hook-form";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { InfoIcon } from "components/Governance/Propose";
import { getTokenLogoURL } from "utils/tokenLogo";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import { formatNumber } from "utils/format";
import BigNumber from "bignumber.js";

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

const DepositVaultForm = ({
  isMobile,
  onClose,
  vaultItemData,
  walletBalance,
  control,
  deposit,
  sharedToken,
  approveBtn,
  approvalPending,
  approve,
  setMax,
  handleSubmit,
  onSubmit,
}: any) => {
  const { token, shareToken } = vaultItemData;

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
            required: false,
            min: 1,
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
                    {error && error.type === "max" && (
                      <>
                        <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          You do not have enough money in your wallet
                        </Box>
                      </>
                    )}
                    {error && error.type === "min" && (
                      <>
                        <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          Deposit amount should be positive.
                        </Box>
                      </>
                    )}
                  </>
                }
                value={value}
                type="number"
                onChange={onChange}
              />
              <AppFormInputLogo src={getTokenLogoURL("FTHM")} />
              <MaxButton onClick={() => setMax(walletBalance)}>Max</MaxButton>
            </AppFormInputWrapper>
          )}
        />
        <Controller
          //key={safeMax}
          control={control}
          name="sharedToken"
          /*   rules={{
            validate: (value) => {
              if (BigNumber(value).isGreaterThan(availableFathomInPool)) {
                return "Not enough FXD in pool";
              }

              if (BigNumber(value).isGreaterThan(safeMax)) {
                return `You can't borrow more than ${safeMax}`;
              }

              return true;
            },
            min: FXD_MINIMUM_BORROW_AMOUNT,
            max: maxBorrowAmount,
          }} */
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <AppFormInputWrapper>
                <AppFormLabel>Receive shares token</AppFormLabel>
                <AppTextField
                  error={!!error}
                  id="outlined-helperText"
                  helperText={
                    <>
                      {/* {error && error.type === "validate" && (
                                                <>
                                                    <InfoIcon
                                                        sx={{
                                                            float: "left",
                                                            fontSize: "18px"
                                                        }}
                                                    />
                                                    <Box
                                                        sx={{ fontSize: "12px", paddingLeft: "6px" }}
                                                        component={"span"}
                                                    >
                                                        {error?.message}
                                                    </Box>
                                                </>
                                            )}
                                            {error && error.type === "min" && (
                                                <>
                                                    <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                                                    <Box
                                                        component={"span"}
                                                        sx={{ fontSize: "12px", paddingLeft: "6px" }}
                                                    >
                                                        Minimum borrow amount is {FXD_MINIMUM_BORROW_AMOUNT}.
                                                    </Box>
                                                </>
                                            )}
                                            {error && error.type === "max" && (
                                                <>
                                                    <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                                                    <Box
                                                        component={"span"}
                                                        sx={{ fontSize: "12px", paddingLeft: "6px" }}
                                                    >
                                                        Maximum borrow amount is {100}.
                                                    </Box>
                                                </>
                                            )} */}
                    </>
                  }
                  value={value}
                  type="number"
                  placeholder={"0"}
                  onChange={onChange}
                  disabled
                />
                <AppFormInputLogo src={getTokenLogoURL("FTHM")} />
              </AppFormInputWrapper>
            );
          }}
        />
        <AppList>
          <AppListItem
            alignItems="flex-start"
            secondaryAction={<>{deposit + " " + token.name}</>}
          >
            <ListItemText primary="Depositing" />
          </AppListItem>
          <AppListItem
            alignItems="flex-start"
            secondaryAction={<>{sharedToken + " " + shareToken.name}</>}
          >
            <ListItemText primary="Receiving" />
          </AppListItem>
        </AppList>
        {approveBtn && !!walletBalance && (
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
        <ButtonsWrapper>
          {!isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
          <ButtonPrimary type="submit">Deposit</ButtonPrimary>
          {isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
        </ButtonsWrapper>
      </ManageVaultForm>
    </DepositVaultItemFormWrapper>
  );
};

export default DepositVaultForm;
