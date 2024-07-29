import { FC } from "react";
import BigNumber from "bignumber.js";
import { Controller } from "react-hook-form";
import { Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";

import usePricesContext from "context/prices";
import { getTokenLogoURL } from "utils/tokenLogo";
import useTopUpPositionContext from "context/topUpPosition";
import { FXD_MINIMUM_BORROW_AMOUNT } from "utils/Constants";
import { formatNumber, formatPercentage } from "utils/format";

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
import { ClosePositionDialogPropsType } from "components/Positions/RepayPositionDialog";
import {
  BaseButtonsSwitcherGroup,
  BaseSwitcherButton,
} from "components/Base/Buttons/StyledButtons";

const TopUpForm = styled("form")``;

const TopUpPositionForm: FC<ClosePositionDialogPropsType> = ({
  topUpPosition,
  closePosition,
  setClosePosition,
  setTopUpPosition,
}) => {
  const {
    totalCollateral,
    totalFathomToken,
    pool,
    balance,
    safeMinCollateral,
    onSubmit,
    control,
    handleSubmit,
    switchPosition,
    maxBorrowAmount,
    availableFathomInPool,
    validateMaxBorrowAmount,
    priceOfCollateral,
    setCollateralMax,
    setCollateralSafeMax,
    setBorrowMax,
  } = useTopUpPositionContext();
  const { fxdPrice } = usePricesContext();

  return (
    <BaseDialogFormWrapper>
      <TopUpForm
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <BaseButtonsSwitcherGroup>
          <BaseSwitcherButton
            className={`${topUpPosition ? "active" : null}`}
            onClick={() => !topUpPosition && switchPosition(setTopUpPosition)}
          >
            Top Up Position
          </BaseSwitcherButton>
          <BaseSwitcherButton
            className={`${closePosition ? "active" : null}`}
            onClick={() => !closePosition && switchPosition(setClosePosition)}
          >
            Repay Position
          </BaseSwitcherButton>
        </BaseButtonsSwitcherGroup>
        <Controller
          control={control}
          name="fathomToken"
          rules={{
            validate: (value) => {
              if (BigNumber(value).isGreaterThan(availableFathomInPool)) {
                return "Not enough FXD in pool";
              }

              if (validateMaxBorrowAmount()) {
                return validateMaxBorrowAmount();
              }

              return true;
            },
            min: FXD_MINIMUM_BORROW_AMOUNT,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <BaseFormInputWrapper>
                <BaseFormLabelRow>
                  <BaseFormInputLabel>Borrow Amount</BaseFormInputLabel>
                </BaseFormLabelRow>
                <BaseFormTextField
                  error={!!error}
                  id="outlined-helperText"
                  helperText={
                    <>
                      {error && error.type === "validate" && (
                        <BaseFormInputErrorWrapper>
                          <InfoIcon
                            sx={{
                              float: "left",
                              fontSize: "14px",
                            }}
                          />
                          <Box
                            sx={{ fontSize: "12px", paddingLeft: "6px" }}
                            component={"span"}
                          >
                            {error?.message}
                          </Box>
                        </BaseFormInputErrorWrapper>
                      )}
                      {error && error.type === "min" && (
                        <BaseFormInputErrorWrapper>
                          <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                          <Box
                            component={"span"}
                            sx={{ fontSize: "12px", paddingLeft: "6px" }}
                          >
                            Minimum borrow amount is {FXD_MINIMUM_BORROW_AMOUNT}
                            .
                          </Box>
                        </BaseFormInputErrorWrapper>
                      )}
                      {error && error.type === "max" && (
                        <BaseFormInputErrorWrapper>
                          <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                          <Box
                            component={"span"}
                            sx={{ fontSize: "12px", paddingLeft: "6px" }}
                          >
                            Maximum borrow amount is {maxBorrowAmount}.
                          </Box>
                        </BaseFormInputErrorWrapper>
                      )}
                      {(!error || error.type === "required") && (
                        <BaseFormInputErrorWrapper>
                          <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                          <Box
                            component={"span"}
                            sx={{ fontSize: "12px", paddingLeft: "6px" }}
                          >
                            Enter the desired FXD.
                          </Box>
                        </BaseFormInputErrorWrapper>
                      )}
                    </>
                  }
                  value={value}
                  type="number"
                  placeholder={"0"}
                  onChange={onChange}
                />
                <BaseFormInputUsdIndicator>{`$${formatNumber(
                  BigNumber(value || 0)
                    .multipliedBy(fxdPrice)
                    .dividedBy(10 ** 18)
                    .toNumber()
                )}`}</BaseFormInputUsdIndicator>
                <BaseFormInputLogo
                  className={"extendedInput"}
                  src={getTokenLogoURL("FXD")}
                />
                <BaseFormSetMaxButton
                  onClick={() =>
                    totalCollateral
                      ? setBorrowMax(Number(totalCollateral))
                      : setBorrowMax()
                  }
                >
                  {totalCollateral ? "Safe Max" : "Max"}
                </BaseFormSetMaxButton>
              </BaseFormInputWrapper>
            );
          }}
        />
        <Controller
          control={control}
          name="collateral"
          rules={{
            required: false,
            min: 0,
            max: BigNumber(balance)
              .dividedBy(10 ** 18)
              .toNumber(),
            validate: (value) => {
              if (BigNumber(value || "0").isLessThan(safeMinCollateral)) {
                return `You need at least ${safeMinCollateral} collateral for the desired amount of borrowing`;
              }

              return true;
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <BaseFormInputWrapper>
              <BaseFormLabelRow>
                <BaseFormInputLabel>Collateral</BaseFormInputLabel>
                {balance ? (
                  <BaseFormWalletBalance>
                    Balance:{" "}
                    {formatPercentage(
                      BigNumber(balance)
                        .dividedBy(10 ** 18)
                        .toNumber()
                    )}{" "}
                    {pool?.poolName}
                  </BaseFormWalletBalance>
                ) : null}
              </BaseFormLabelRow>
              <BaseFormTextField
                error={!!error}
                id="outlined-helperText"
                placeholder={"0"}
                helperText={
                  <>
                    {error && error.type === "validate" && (
                      <BaseFormInputErrorWrapper>
                        <InfoIcon
                          sx={{
                            float: "left",
                            fontSize: "14px",
                          }}
                        />
                        <Box
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                          component={"span"}
                        >
                          {error?.message}
                        </Box>
                      </BaseFormInputErrorWrapper>
                    )}
                    {error && error.type === "max" && (
                      <BaseFormInputErrorWrapper>
                        <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          You do not have enough {pool?.poolName}
                        </Box>
                      </BaseFormInputErrorWrapper>
                    )}
                    {error && error.type === "min" && (
                      <BaseFormInputErrorWrapper>
                        <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          Collateral amount should be positive.
                        </Box>
                      </BaseFormInputErrorWrapper>
                    )}
                  </>
                }
                value={value}
                type="number"
                onChange={onChange}
              />
              <BaseFormInputUsdIndicator>{`$${formatNumber(
                BigNumber(value || 0)
                  .multipliedBy(priceOfCollateral)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )}`}</BaseFormInputUsdIndicator>
              <BaseFormInputLogo
                className={"extendedInput"}
                src={getTokenLogoURL(
                  pool?.poolName?.toUpperCase() === "XDC"
                    ? "WXDC"
                    : pool?.poolName
                )}
              />
              <BaseFormSetMaxButton
                onClick={() =>
                  totalFathomToken
                    ? setCollateralSafeMax()
                    : setCollateralMax(balance)
                }
              >
                {totalFathomToken ? "Safe Max" : "Max"}
              </BaseFormSetMaxButton>
            </BaseFormInputWrapper>
          )}
        />
      </TopUpForm>
    </BaseDialogFormWrapper>
  );
};

export default TopUpPositionForm;
