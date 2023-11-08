import React, { useState } from "react";
import {
    Box,
    Grid,
    ListItemText,
    Typography,
    styled
} from "@mui/material";
import { ErrorBox, Summary, WalletBalance } from "components/AppComponents/AppBox/AppBox";
import { ButtonPrimary, ButtonSecondary, ButtonsWrapper, ManagePositionRepayTypeWrapper, ManageTypeButton, MaxButton } from "components/AppComponents/AppButton/AppButton";
import { Controller, useForm } from "react-hook-form";
import { AppFormInputLogo, AppFormInputWrapper, AppFormLabel, AppTextField } from "components/AppComponents/AppForm/AppForm";
import { InfoIcon } from "components/Governance/Propose";
import { getTokenLogoURL } from "utils/tokenLogo";
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

const ManageVaultForm = ({ isMobile, onClose }: any) => {
    const { control } = useForm();
    const [formType, setFormType] = useState<'deposite' | 'withdrow'>('deposite');

    return (
        <ManageVaultItemFormWrapper item>
            <ManageVaultFormStyled
                onSubmit={() => { }}
                noValidate
                autoComplete="off"
            >
                <Summary>Summary</Summary>
                <ManagePositionRepayTypeWrapper>
                    <ManageTypeButton
                        sx={{ marginRight: "5px" }}
                        className={`${formType === "deposite" ? "active" : null}`}
                        onClick={() => setFormType('deposite')}
                    >
                        Deposit
                    </ManageTypeButton>
                    <ManageTypeButton
                        className={`${formType === "withdrow" ? "active" : null}`}
                        onClick={() => setFormType('withdrow')}
                    >
                        Withdraw
                    </ManageTypeButton>
                </ManagePositionRepayTypeWrapper>
                <ManageVaultItemDepositedBox>
                    <Typography variant="subtitle2" color="#B7C8E5">USDT Deposited:</Typography>
                    <Typography component="span">14 USDT</Typography>
                </ManageVaultItemDepositedBox>
                <Controller
                    control={control}
                    name="collateral"
                    rules={{
                        required: false,
                        min: 0,
                        max: 100
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <AppFormInputWrapper>
                            <AppFormLabel>{formType === "deposite" ? 'Deposit USDT' : 'Withdraw USDT'}</AppFormLabel>
                            <WalletBalance>
                                Wallet Available: 5 FXD
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
                            <AppFormInputLogo
                                src={getTokenLogoURL("FXD")}
                            />
                            <MaxButton onClick={() => { }}>Max</MaxButton>
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
                                <AppFormLabel>{formType === "deposite" ? 'Receive shares token' : 'Burn Shares token'}</AppFormLabel>
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
                                <MaxButton onClick={() => { }}>Max</MaxButton>
                            </AppFormInputWrapper>
                        );
                    }}
                />
                <AppList>
                    <AppListItem
                        alignItems="flex-start"
                        secondaryAction={
                            <>
                                1 USDT
                            </>
                        }
                    >
                        <ListItemText primary={formType === "deposite" ? 'Depositing' : 'Withdrawing'} />
                    </AppListItem>
                    <AppListItem
                        alignItems="flex-start"
                        secondaryAction={
                            <>
                                1 fmUSDT
                            </>
                        }
                    >
                        <ListItemText primary={formType === "deposite" ? "Receiving" : "Burning"} />
                    </AppListItem>
                </AppList>
                <ErrorBox>
                    <InfoIcon />
                    <Typography>
                        Wallet balance is not enough to deposit.
                    </Typography>
                </ErrorBox>
                <ButtonsWrapper>
                    {!isMobile && (
                        <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
                    )}
                    <ButtonPrimary
                        type="submit"
                    >
                        {formType === "deposite" ? "Deposit" : "Withdraw"}
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
