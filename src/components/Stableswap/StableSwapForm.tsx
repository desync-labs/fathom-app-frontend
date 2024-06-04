import { FC, useMemo, memo, ChangeEvent } from "react";
import BigNumber from "bignumber.js";
import { SelectChangeEvent } from "@mui/material/Select";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { getTokenLogoURL } from "utils/tokenLogo";
import InfoIcon from "@mui/icons-material/Info";
import { FathomSwapChangeCurrencyButton } from "components/AppComponents/AppButton/AppButton";
import ComboShareSrc from "assets/svg/combo-shape.svg";
import {
  StableSwapFormLabel,
  StableSwapInputWrapper,
  StableSwapMaxButton,
  StableSwapTextField,
  StableSwapWalletBalance,
} from "components/Stableswap/StableSwap";
import { styled } from "@mui/material/styles";

import {
  SuccessBox,
  ErrorBox,
  ErrorMessage,
} from "components/AppComponents/AppBox/AppBox";
import { formatPercentage } from "utils/format";

const StableSwapErrorBox = styled(ErrorBox)`
  width: 100%;
  margin: 0;
  margin: 20px 0 0;
`;

const ErrorInfoIcon = styled(InfoIcon)`
  width: 16px;
  color: #f5953d;
  height: 16px;
`;

const StableSwapCurrencySelect = styled(Select)`
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

  & .MuiSelect-select {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    border-radius: 6px;
    padding: 4px 12px !important;
  }
`;

const TokenLogoBox = styled(Box)`
  display: flex;
  height: fit-content;
  padding-right: 10px;
`;

const StableSwapSuccessBox = styled(SuccessBox)`
  width: 100%;
  margin: 20px 0 0;
`;

export type StableSwapFormProps = {
  isDecentralizedState: boolean;
  isUserWhiteListed: boolean;
  isUserWrapperWhiteListed: boolean;
  inputValue: string;
  outputValue: string;
  inputDecimals: number;
  outputDecimals: number;
  handleInputValueTextFieldChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  handleOutputValueTextFieldChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  inputCurrency: string;
  outputCurrency: string;
  setInputCurrencyHandler: (value: string) => void;
  setOutputCurrencyHandler: (value: string) => void;
  inputBalance: string;
  outputBalance: string;
  changeCurrenciesPosition: (inputValue: string, outputValue: string) => void;
  setMax: () => void;
  inputError: string;
  options: string[];
  fxdAvailable: string;
  usStableAvailable: string;
};

const StableSwapForm: FC<StableSwapFormProps> = ({
  isDecentralizedState,
  isUserWhiteListed,
  isUserWrapperWhiteListed,
  inputValue,
  outputValue,
  inputDecimals,
  outputDecimals,
  handleInputValueTextFieldChange,
  handleOutputValueTextFieldChange,
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
  fxdAvailable,
  usStableAvailable,
}) => {
  const outputError = useMemo(() => {
    return BigNumber(
      outputCurrency === options[0] ? usStableAvailable : fxdAvailable
    ).isLessThan(outputValue);
  }, [outputCurrency, usStableAvailable, fxdAvailable, outputValue]);

  return (
    <>
      <StableSwapInputWrapper>
        <StableSwapFormLabel>From</StableSwapFormLabel>
        {useMemo(
          () => (
            <StableSwapWalletBalance>
              Balance:{" "}
              {formatPercentage(
                BigNumber(inputBalance)
                  .dividedBy(10 ** inputDecimals)
                  .toNumber()
              )}{" "}
              {inputCurrency}
            </StableSwapWalletBalance>
          ),
          [inputBalance, inputCurrency, inputDecimals]
        )}
        <StableSwapCurrencySelect
          value={inputCurrency}
          onChange={(event: SelectChangeEvent<unknown>) => {
            setInputCurrencyHandler(event.target.value as string);
          }}
        >
          {useMemo(
            () =>
              options.map((option: string) => (
                <MenuItem key={option} value={option}>
                  <TokenLogoBox>
                    <img width={16} src={getTokenLogoURL(option)} alt={""} />
                  </TokenLogoBox>
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

        <FathomSwapChangeCurrencyButton
          onClick={() => changeCurrenciesPosition(inputValue, outputValue)}
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
              {formatPercentage(
                BigNumber(outputBalance)
                  .dividedBy(10 ** outputDecimals)
                  .toNumber()
              )}{" "}
              {outputCurrency}
            </StableSwapWalletBalance>
          ),
          [outputBalance, outputCurrency, outputDecimals]
        )}
        <StableSwapCurrencySelect
          value={outputCurrency}
          onChange={(event: SelectChangeEvent<unknown>) => {
            setOutputCurrencyHandler(event.target.value as string);
          }}
          disabled={true}
        >
          {useMemo(
            () =>
              options.map((option: string) => (
                <MenuItem key={option} value={option}>
                  <TokenLogoBox>
                    <img width={16} src={getTokenLogoURL(option)} alt={""} />
                  </TokenLogoBox>
                  {option}
                </MenuItem>
              )),
            [options]
          )}
        </StableSwapCurrencySelect>

        <StableSwapTextField
          error={outputError}
          disabled={true}
          size="small"
          type="number"
          placeholder="0.00"
          className={outputError ? "error" : ""}
          value={outputValue}
          onChange={handleOutputValueTextFieldChange}
          helperText={outputError ? "Not enough liquidity in pool" : ""}
        />
      </StableSwapInputWrapper>

      {isDecentralizedState === false && (
        <StableSwapSuccessBox>
          <InfoIcon />
          <Typography>Whitelist Activated.</Typography>
        </StableSwapSuccessBox>
      )}

      {isUserWhiteListed === false && isUserWrapperWhiteListed === false && (
        <StableSwapErrorBox>
          <ErrorInfoIcon />
          <ErrorMessage>Wallet Address is not whitelisted.</ErrorMessage>
        </StableSwapErrorBox>
      )}
    </>
  );
};

export default memo(StableSwapForm);
