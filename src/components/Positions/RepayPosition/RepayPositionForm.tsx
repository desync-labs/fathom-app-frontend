import { FC } from "react";
import BigNumber from "bignumber.js";
import { Box, Stack, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import usePricesContext from "context/prices";
import useSharedContext from "context/shared";
import useRepayPositionContext from "context/repayPosition";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber, formatPercentage } from "utils/format";

import { ClosePositionDialogPropsType } from "components/Positions/RepayPositionDialog";
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
import {
  BaseButtonsSwitcherGroup,
  BaseSwitcherButton,
} from "components/Base/Buttons/StyledButtons";

const RepayPositionForm: FC<ClosePositionDialogPropsType> = ({
  topUpPosition,
  closePosition,
  setClosePosition,
  setTopUpPosition,
}) => {
  const {
    pool,
    collateral,
    balance,
    balanceError,
    balanceErrorNotFilled,
    fathomTokenIsDirty,
    fathomToken,
    handleFathomTokenTextFieldChange,
    handleCollateralTextFieldChange,
    setMax,
    debtValue,
    switchPosition,
    priceOfCollateral,
  } = useRepayPositionContext();
  const { fxdPrice } = usePricesContext();
  const { isMobile } = useSharedContext();

  return (
    <BaseDialogFormWrapper>
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb="16px"
      >
        <Box
          sx={{
            fontWeight: 600,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#B7C8E5",
          }}
        >
          Total debt:
        </Box>
        <Box sx={{ fontWeight: 600, fontSize: isMobile ? "12px" : "14px" }}>
          {formatPercentage(Number(debtValue))} FXD
        </Box>
      </Stack>
      <BaseFormInputWrapper>
        <BaseFormLabelRow>
          <BaseFormInputLabel>Repaying</BaseFormInputLabel>
          {balance && (
            <BaseFormWalletBalance>
              Balance: {formatPercentage(Number(balance))} FXD
            </BaseFormWalletBalance>
          )}
        </BaseFormLabelRow>
        <BaseFormTextField
          error={balanceError || balanceErrorNotFilled}
          id="outlined-helperText"
          placeholder={"0"}
          helperText={
            <>
              {balanceError ? (
                <BaseFormInputErrorWrapper>
                  <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                  <Typography
                    component={"span"}
                    sx={{ fontSize: "12px", paddingLeft: "5px" }}
                  >
                    You don't have enough to repay that amount
                  </Typography>
                </BaseFormInputErrorWrapper>
              ) : balanceErrorNotFilled && fathomTokenIsDirty ? (
                <BaseFormInputErrorWrapper>
                  <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                  <Typography
                    component={"span"}
                    sx={{ fontSize: "12px", paddingLeft: "5px" }}
                  >
                    Please fill repaying amount
                  </Typography>
                </BaseFormInputErrorWrapper>
              ) : (
                <BaseFormInputErrorWrapper>
                  <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                  <Box
                    component={"span"}
                    sx={{ fontSize: "12px", paddingLeft: "6px" }}
                  >
                    Enter the Repaying.
                  </Box>
                </BaseFormInputErrorWrapper>
              )}
            </>
          }
          value={fathomToken}
          onChange={handleFathomTokenTextFieldChange}
        />
        <BaseFormInputUsdIndicator>{`$${formatNumber(
          BigNumber(fathomToken || 0)
            .multipliedBy(fxdPrice)
            .dividedBy(10 ** 18)
            .toNumber()
        )}`}</BaseFormInputUsdIndicator>
        <BaseFormInputLogo
          className={"extendedInput"}
          src={getTokenLogoURL("FXD")}
        />
        <BaseFormSetMaxButton onClick={() => setMax()}>
          Max
        </BaseFormSetMaxButton>
      </BaseFormInputWrapper>

      <BaseFormInputWrapper>
        <BaseFormLabelRow>
          <BaseFormInputLabel>Receive</BaseFormInputLabel>
        </BaseFormLabelRow>
        <BaseFormTextField
          id="outlined-helperText"
          value={collateral}
          onChange={handleCollateralTextFieldChange}
        />
        <BaseFormInputUsdIndicator>{`$${formatNumber(
          BigNumber(collateral || 0)
            .multipliedBy(priceOfCollateral)
            .dividedBy(10 ** 18)
            .toNumber()
        )}`}</BaseFormInputUsdIndicator>
        <BaseFormInputLogo
          className={"extendedInput"}
          src={getTokenLogoURL(
            pool?.poolName === "XDC" ? "WXDC" : pool?.poolName
          )}
        />
      </BaseFormInputWrapper>
    </BaseDialogFormWrapper>
  );
};

export default RepayPositionForm;
