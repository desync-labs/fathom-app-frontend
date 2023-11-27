import React from "react";
import { Box, Grid, ListItemText, Typography, styled } from "@mui/material";
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

const DepositVaultForm = ({ isMobile, onClose, token, walletBalance }: any) => {
  const { control } = useForm();

  return (
    <DepositVaultItemFormWrapper item>
      <ManageVaultForm onSubmit={() => {}} noValidate autoComplete="off">
        <Summary>Summary</Summary>
        <Controller
          control={control}
          name="collateral"
          rules={{
            required: false,
            min: 0,
            max: 100,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppFormInputWrapper>
              <AppFormLabel>Deposit USDT</AppFormLabel>
              <WalletBalance>
                Wallet Available:{" "}
                {BigNumber(walletBalance).dividedBy(10 ** 18) +
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
                          You don't have enough to repay that amount
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
                          Collateral amount should be positive.
                        </Box>
                      </>
                    )}
                  </>
                }
                value={value}
                type="number"
                onChange={onChange}
              />
              <AppFormInputLogo src={getTokenLogoURL("WXDC")} />
              <MaxButton onClick={() => {}}>Max</MaxButton>
            </AppFormInputWrapper>
          )}
        />
        <Controller
          //key={safeMax}
          control={control}
          name="fathomToken"
          /* rules={{
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
                        max: maxBorrowAmount
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
                />
                <AppFormInputLogo src={getTokenLogoURL("WXDC")} />
                <MaxButton onClick={() => {}}>Max</MaxButton>
              </AppFormInputWrapper>
            );
          }}
        />
        <AppList>
          <AppListItem alignItems="flex-start" secondaryAction={<>15 USDT</>}>
            <ListItemText primary="Depositing" />
          </AppListItem>
          <AppListItem alignItems="flex-start" secondaryAction={<>15 fmUSDT</>}>
            <ListItemText primary="Receiving" />
          </AppListItem>
        </AppList>
        <InfoBox sx={{ alignItems: "flex-start" }}>
          <InfoIcon />
          <Box flexDirection="column">
            <Typography width="100%">
              First-time connect? Please allow token approval in your MetaMask
            </Typography>
            <ButtonPrimary style={{ margin: "16px 0" }}>
              Approve Token
            </ButtonPrimary>
          </Box>
        </InfoBox>
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
