import { Controller } from "react-hook-form";
import BigNumber from "bignumber.js";
import { Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import useOpenPositionContext from "context/openPosition";
import usePricesContext from "context/prices";
import { FXD_MINIMUM_BORROW_AMOUNT } from "utils/Constants";
import { formatNumber, formatPercentage } from "utils/format";
import { getTokenLogoURL } from "utils/tokenLogo";

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

const OpenPositionForm = () => {
  const {
    collateral,
    balance,
    safeMinCollateral,
    setCollateralMax,
    setCollateralSafeMax,
    setBorrowMax,
    onSubmit,
    control,
    handleSubmit,
    availableFathomInPool,
    pool,
    dangerSafetyBuffer,
    maxBorrowAmount,
    minCollateralAmount,
    validateMaxBorrowAmount,
    priceOfCollateral,
    fathomToken,
  } = useOpenPositionContext();
  const { fxdPrice } = usePricesContext();

  return (
    <BaseDialogFormWrapper>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <Controller
          control={control}
          name="fathomToken"
          rules={{
            required: true,
            min: FXD_MINIMUM_BORROW_AMOUNT,
            validate: (value) => {
              if (BigNumber(value).isGreaterThan(availableFathomInPool)) {
                return "Not enough FXD in pool";
              }

              if (validateMaxBorrowAmount()) {
                return validateMaxBorrowAmount();
              }

              return true;
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <BaseFormInputWrapper>
                <BaseFormLabelRow>
                  <BaseFormInputLabel>Borrow Amount</BaseFormInputLabel>
                </BaseFormLabelRow>
                <BaseFormTextField
                  error={!!error || dangerSafetyBuffer}
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
                      {error && error.type === "required" && (
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
                    collateral
                      ? setBorrowMax(Number(collateral))
                      : setBorrowMax()
                  }
                >
                  {collateral ? "Safe Max" : "Max"}
                </BaseFormSetMaxButton>
              </BaseFormInputWrapper>
            );
          }}
        />
        <Controller
          control={control}
          name="collateral"
          rules={{
            required: true,
            min: minCollateralAmount,
            max: BigNumber(balance)
              .dividedBy(10 ** 18)
              .toString(),
            validate: (value) => {
              if (BigNumber(value).isLessThan(safeMinCollateral)) {
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
                    {error && error.type === "required" && (
                      <BaseFormInputErrorWrapper>
                        <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          Collateral amount is required
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
                          Minimum collateral amount is {minCollateralAmount}.
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
                alt={pool?.poolName}
              />
              <BaseFormSetMaxButton
                onClick={() =>
                  fathomToken
                    ? setCollateralSafeMax()
                    : setCollateralMax(balance)
                }
              >
                {fathomToken ? "Safe Max" : "Max"}
              </BaseFormSetMaxButton>
            </BaseFormInputWrapper>
          )}
        />
      </Box>
    </BaseDialogFormWrapper>
  );
};

export default OpenPositionForm;
