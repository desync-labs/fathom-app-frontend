import React, {
  FC,
  useMemo
} from "react";
import BigNumber from "bignumber.js";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import { getTokenLogoURL } from "utils/tokenLogo";
import InfoIcon from "@mui/icons-material/Info";
import {
  ButtonSecondary,
  FathomSwapChangeCurrencyButton
} from "components/AppComponents/AppButton/AppButton";
import ComboShareSrc from "assets/svg/combo-shape.svg";
import {
  StableSwapFormLabel,
  StableSwapInputWrapper,
  StableSwapMaxButton,
  StableSwapTextField,
  StableSwapWalletBalance
} from "components/Stableswap/StableSwap";
import { styled } from "@mui/material/styles";

import {
  SuccessBox,
  ErrorBox,
  ErrorMessage,
} from "components/AppComponents/AppBox/AppBox";
import { formatPercentage } from "../../utils/format";


const StableSwapErrorBox = styled(ErrorBox)`
  width: 100%;
  margin: 0;
`;

const ErrorInfoIcon = styled(InfoIcon)`
  width: 16px;
  color: #f5953d;
  height: 16px;
`;

const StableSwapCurrencySelect = styled(Select)`
  background: #253656;
  border: 1px solid #324567;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  font-size: 13px;
  line-height: 16px;
  height: 32px;
  width: 118px;
  position: absolute;
  left: 32px;
  top: 41px;
  z-index: 1;
  padding-top: 4px;

  .MuiSelect-select {
    padding-left: 12px;
  }
`;


const StableSwapSuccessBox = styled(SuccessBox)`
  width: 100%;
  margin: 0;
`;

const StableSwapForm: FC<any> = ({
  isDecentralizedState,
  isUserWhiteListed,
  inputValue,
  outputValue,
  inputDecimals,
  outputDecimals,
  handleInputValueTextFieldChange,
  handleOutputValueTextFieldChange,
  approvalPending,
  approveInputBtn,
  approveOutputBtn,
  approveInput,
  approveOutput,
  inputCurrency,
  outputCurrency,
  setInputCurrencyHandler,
  setOutputCurrencyHandler,
  inputBalance,
  outputBalance,
  changeCurrenciesPosition,
  setMax,
  inputError,
  options,
}) => {
  return (
    <>
      <StableSwapInputWrapper>
        <StableSwapFormLabel>From</StableSwapFormLabel>
        {useMemo(
          () => (
            <StableSwapWalletBalance>
              Balance:{" "}
              {formatPercentage(BigNumber(inputBalance).dividedBy(10 ** inputDecimals).toNumber())}
              {" "}
              {inputCurrency}
            </StableSwapWalletBalance>
          ),
          [inputBalance, inputCurrency, inputDecimals]
        )}
        <StableSwapCurrencySelect
          value={inputCurrency}
          // @ts-ignore
          onChange={(event: SelectChangeEvent) => {
            setInputCurrencyHandler(event.target.value);
          }}
        >
          {useMemo(
            () =>
              options.map((option: string) => (
                <MenuItem key={option} value={option}>
                  <Box sx={{ float: "left", paddingRight: "10px" }}>
                    <img
                      width={16}
                      src={getTokenLogoURL(option)}
                      alt={""}
                    />
                  </Box>
                  {option}
                </MenuItem>
              )),
            [options]
          )}
        </StableSwapCurrencySelect>

        <StableSwapTextField
          error={!!inputError}
          size="small"
          type="number"
          placeholder="0.00"
          value={inputValue}
          onChange={handleInputValueTextFieldChange}
          helperText={
            inputError ? (
              <>
                <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                <Typography>{inputError}</Typography>
              </>
            ) : null
          }
        />
        <StableSwapMaxButton onClick={setMax}>Max</StableSwapMaxButton>
        {approveInputBtn ? (
          <ButtonSecondary
            onClick={approveInput}
            sx={{ float: "right", mt: "10px" }}
          >
            {approvalPending === "input" ? (
              <CircularProgress size={30} />
            ) : (
              `Approve ${inputCurrency}`
            )}
          </ButtonSecondary>
        ) : null}

        <FathomSwapChangeCurrencyButton
          onClick={() =>
            changeCurrenciesPosition(
              inputValue,
              outputValue
            )
          }
        >
          <img src={ComboShareSrc} alt="combo-share" />
        </FathomSwapChangeCurrencyButton>
      </StableSwapInputWrapper>

      <StableSwapInputWrapper>
        <StableSwapFormLabel>To</StableSwapFormLabel>
        {useMemo(
          () => (
            <StableSwapWalletBalance>
              Balance:{" "}
              {formatPercentage(BigNumber(outputBalance).dividedBy(10 ** outputDecimals).toNumber())}
              {" "}
              {outputCurrency}
            </StableSwapWalletBalance>
          ),
          [outputBalance, outputCurrency, outputDecimals]
        )}
        <StableSwapCurrencySelect
          value={outputCurrency}
          // @ts-ignore
          onChange={(event: SelectChangeEvent) => {
            setOutputCurrencyHandler(event.target.value);
          }}
          disabled={true}
        >
          {useMemo(
            () =>
              options.map((option: string) => (
                <MenuItem key={option} value={option}>
                  <Box sx={{ float: "left", paddingRight: "10px" }}>
                    <img
                      width={16}
                      src={getTokenLogoURL(option)}
                      alt={""}
                    />
                  </Box>
                  {option}
                </MenuItem>
              )),
            [options]
          )}
        </StableSwapCurrencySelect>

        <StableSwapTextField
          disabled={true}
          size="small"
          type="number"
          placeholder="0.00"
          value={outputValue}
          onChange={handleOutputValueTextFieldChange}
        />

        {approveOutputBtn ? (
          <ButtonSecondary
            onClick={approveOutput}
            sx={{ float: "right", marginTop: "10px" }}
          >
            {approvalPending === "output" ? (
              <CircularProgress size={30} />
            ) : (
              `Approve ${outputCurrency}`
            )}
          </ButtonSecondary>
        ) : null}
      </StableSwapInputWrapper>

      {isDecentralizedState === false && (
        <StableSwapSuccessBox>
          <InfoIcon />
          <Typography>Whitelist Activated.</Typography>
        </StableSwapSuccessBox>
      )}

      {isUserWhiteListed === false && (
        <StableSwapErrorBox>
          <ErrorInfoIcon />
          <ErrorMessage>Wallet Address Not Whitelisted.</ErrorMessage>
        </StableSwapErrorBox>
      )}
    </>
  );
};

export default StableSwapForm;