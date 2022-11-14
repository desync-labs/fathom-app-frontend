import {
  Select,
  MenuItem,
  Grid,
  Box as MuiBox,
  Box,
  CircularProgress,
  Typography,
  Container,
} from "@mui/material";
import { observer } from "mobx-react";
import { StableSwapPaper } from "components/AppComponents/AppPaper/AppPaper";
import { PageHeader } from "components/Dashboard/PageHeader";
import useStableSwap from "hooks/useStableSwap";
import { styled } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useMemo, useState } from "react";
import {
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  InfoLabel,
  InfoValue,
  InfoWrapper,
  WalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ButtonSecondary,
  FathomSwapChangeCurrencyButton,
  MaxButton,
  QuestionMarkButton,
  StableSwapRateSettingsButton,
} from "components/AppComponents/AppButton/AppButton";

import ComboShareSrc from "assets/svg/combo-shape.svg";
import QuestionMarkSrc from "assets/svg/question-mark.svg";
import PriceSettingsSrc from "assets/svg/price-settings.svg";
import InfoIcon from "@mui/icons-material/Info";

const StableSwapInputWrapper = styled(MuiBox)`
  position: relative;
  padding: 20px 24px 44px;
  background: #1d2d49;
  borderradius: 12px;
  width: 100%;
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
  width: 108px;
  position: absolute;
  left: 32px;
  top: 46px;
  z-index: 1;
  padding-top: 4px;
  .MuiSelect-select {
    padding-left: 12px;
  }
`;

const StableSwapTextField = styled(AppTextField)`
  input {
    font-size: 20px;
    color: #4F658C;
    padding: 0 50px 0 122px;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
    
    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
`;

const StableSwapFormLabel = styled(AppFormLabel)(({ theme }) => ({
  color: "#9FADC6",
}));

const StableSwapWalletBalance = styled(WalletBalance)(({ theme }) => ({
  color: "#5A81FF",
}));

const StableSwapMaxButton = styled(MaxButton)(({ theme }) => ({
  top: "48px",
  right: "32px",
  color: "#A5BAFF",
}));

const StableSwapPriceInfoWrapper = styled(InfoWrapper)(({ theme }) => ({
  width: "100%",
  padding: "0 0 10px",
  borderBottom: "1px solid #253656",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const StableSwapInfoWrapper = styled(InfoWrapper)(({ theme }) => ({
  width: "100%",
}));

const StableSwapInfoContainer = styled(Box)(({ theme }) => ({
  paddingTop: "15px",
  width: "100%",
}));

const StableSwapPriceInfo = styled(InfoLabel)(({ theme }) => ({
  fontSize: "16px",
  lineHeight: "24px",
  color: "#fff",
  textTransform: "uppercase",
  display: "flex",
  gap: "7px",
  justifyContent: "flex-start",
  alignItems: "center",
}));

const SwapButton = styled(ButtonPrimary)(({ theme }) => ({
  height: "48px",
  width: "100%",
  fontSize: "17px",
  lineHeight: "24px",
  margin: "20px 0 5px 0",
}));

const StableSwap = observer(() => {
  const [options /*setOptions*/] = useState<string[]>(["USDT", "FXD"]);

  const {
    fxdPrice,

    inputValue,
    outputValue,

    handleInputValueTextFieldChange,
    handleOutputValueTextFieldChange,

    approvalPending,

    approveInputBtn,
    approveOutputBtn,
    approveInput,
    approveOutput,

    handleSwap,
    swapPending,

    inputCurrency,
    outputCurrency,

    setInputCurrencyHandler,
    setOutputCurrencyHandler,

    inputBalance,
    outputBalance,

    changeCurrenciesPosition,
    setMax,
  } = useStableSwap(options);

  const inputError = useMemo(() => {
    const formattedBalance = inputBalance / 10 ** 18;

    console.log(inputValue);
    console.log(formattedBalance);

    return inputValue > formattedBalance;
  }, [inputValue, inputBalance]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <PageHeader
          title={"Stable Swap"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget tristique malesuada pulvinar commodo. Euismod massa, dis metus mattis porttitor ac est quis. Ut quis cursus ac nunc, aliquam curabitur nisl amet. Elit etiam dignissim orci. If this is the first-time you’re here, please visit our Whitepaper."
          }
        />
        <Grid item xs={6} sx={{ margin: "0 auto" }}>
          <StableSwapPaper>
            <StableSwapInputWrapper>
              <StableSwapFormLabel>From</StableSwapFormLabel>
              {useMemo(
                () =>
                  inputBalance ? (
                    <StableSwapWalletBalance>
                      Balance: {(+inputBalance / 10 ** 18).toFixed(2)}{" "}
                      {inputCurrency}
                    </StableSwapWalletBalance>
                  ) : null,
                [inputBalance, inputCurrency]
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
                    options.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Box sx={{ float: "left", paddingRight: "10px" }}>
                          <img
                            width={16}
                            src={getTokenLogoURL(option)}
                            alt={option}
                          />
                        </Box>
                        {option}
                      </MenuItem>
                    )),
                  [options]
                )}
              </StableSwapCurrencySelect>

              <StableSwapTextField
                error={inputError}
                size="small"
                type="number"
                placeholder="0.00"
                value={inputValue}
                onChange={handleInputValueTextFieldChange}
                helperText={
                  inputError ? (
                    <>
                      <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                      <Typography
                        sx={{ fontSize: "12px", paddingLeft: "22px" }}
                      >
                        You do not have enough {inputCurrency}
                      </Typography>
                    </>
                  ) : null
                }
              />
              <StableSwapMaxButton onClick={setMax}>Max</StableSwapMaxButton>
              {approveInputBtn ? (
                <ButtonSecondary onClick={approveInput} sx={{ float: "right" }}>
                  {approvalPending === "input" ? (
                    <CircularProgress size={30} />
                  ) : (
                    `Approve ${inputCurrency}`
                  )}
                </ButtonSecondary>
              ) : null}

              <FathomSwapChangeCurrencyButton
                onClick={() => changeCurrenciesPosition(inputValue)}
              >
                <img src={ComboShareSrc} alt="combo-share" />
              </FathomSwapChangeCurrencyButton>
            </StableSwapInputWrapper>

            <StableSwapInputWrapper>
              <StableSwapFormLabel>To</StableSwapFormLabel>
              {useMemo(
                () =>
                  outputBalance ? (
                    <StableSwapWalletBalance>
                      Balance: {(+outputBalance / 10 ** 18).toFixed(2)}{" "}
                      {outputCurrency}
                    </StableSwapWalletBalance>
                  ) : null,
                [outputBalance, outputCurrency]
              )}
              <StableSwapCurrencySelect
                value={outputCurrency}
                // @ts-ignore
                onChange={(event: SelectChangeEvent) => {
                  setOutputCurrencyHandler(event.target.value);
                }}
              >
                {useMemo(
                  () =>
                    options.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Box sx={{ float: "left", paddingRight: "10px" }}>
                          <img
                            width={16}
                            src={getTokenLogoURL(option)}
                            alt={option}
                          />
                        </Box>
                        {option}
                      </MenuItem>
                    )),
                  [options]
                )}
              </StableSwapCurrencySelect>

              <StableSwapTextField
                size="small"
                type="number"
                placeholder="0.00"
                value={outputValue}
                onChange={handleOutputValueTextFieldChange}
              />

              {approveOutputBtn ? (
                <ButtonSecondary
                  onClick={approveOutput}
                  sx={{ float: "right" }}
                >
                  {approvalPending === "output" ? (
                    <CircularProgress size={30} />
                  ) : (
                    `Approve ${outputCurrency}`
                  )}
                </ButtonSecondary>
              ) : null}
            </StableSwapInputWrapper>

            {useMemo(() => {
              return (
                <StableSwapPriceInfoWrapper>
                  <StableSwapPriceInfo>
                    <Box component="span">
                      {inputCurrency === "USDT"
                        ? "1"
                        : fxdPrice && inputCurrency === "USDT"
                        ? 1 / fxdPrice
                        : fxdPrice}{" "}
                      {inputCurrency} ={" "}
                      {outputCurrency === "USDT"
                        ? "1"
                        : fxdPrice
                        ? 1 / fxdPrice
                        : null}{" "}
                      {outputCurrency}
                    </Box>
                    <QuestionMarkButton>
                      <img src={QuestionMarkSrc} alt="question" width={20} />
                    </QuestionMarkButton>
                  </StableSwapPriceInfo>
                  <StableSwapRateSettingsButton>
                    <img
                      src={PriceSettingsSrc}
                      alt="price-settings"
                      width={32}
                    />
                  </StableSwapRateSettingsButton>
                </StableSwapPriceInfoWrapper>
              );
            }, [inputCurrency, outputCurrency, fxdPrice])}

            <StableSwapInfoContainer>
              <StableSwapInfoWrapper>
                <InfoLabel>Fee</InfoLabel>
                <InfoValue>0.00 FTHM</InfoValue>
              </StableSwapInfoWrapper>

              <StableSwapInfoWrapper>
                <InfoLabel>Price impact</InfoLabel>
                <InfoValue>0%</InfoValue>
              </StableSwapInfoWrapper>

              <StableSwapInfoWrapper>
                <InfoLabel>Minimum received</InfoLabel>
                <InfoValue>0.00 FXD</InfoValue>
              </StableSwapInfoWrapper>

              <StableSwapInfoWrapper>
                <InfoLabel>Slippage tolerance</InfoLabel>
                <InfoValue>0.5%</InfoValue>
              </StableSwapInfoWrapper>
            </StableSwapInfoContainer>

            <SwapButton
              isLoading={swapPending}
              disabled={!inputValue || !outputValue || swapPending}
              onClick={handleSwap}
            >
              {swapPending ? <CircularProgress size={30} /> : "Swap"}
            </SwapButton>
          </StableSwapPaper>
        </Grid>
      </Grid>
    </Container>
  );
});

export default StableSwap;
