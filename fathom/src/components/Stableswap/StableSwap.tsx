import React, { useMemo, useState } from "react";
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
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import { SelectChangeEvent } from "@mui/material/Select";
import { StableSwapPaper } from "components/AppComponents/AppPaper/AppPaper";
import { PageHeader } from "components/Dashboard/PageHeader";
import {
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import useStableSwap from "hooks/useStableSwap";

import { formatNumber, formatPercentage } from "utils/format";
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
} from "components/AppComponents/AppButton/AppButton";

import ComboShareSrc from "assets/svg/combo-shape.svg";
import QuestionMarkSrc from "assets/svg/question-mark.svg";

const StableSwapInputWrapper = styled(MuiBox)`
  position: relative;
  padding: 20px 24px 44px;
  background: #1d2d49;
  border-radius: 12px;
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
  top: 41px;
  z-index: 1;
  padding-top: 4px;
  .MuiSelect-select {
    padding-left: 12px;
  }
`;

const StableSwapTextField = styled(AppTextField)`
  input {
    font-size: 20px;
    color: #4f658c;
    padding: 0 50px 0 122px;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }

    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
  .MuiFormHelperText-root {
    &.Mui-error {
      padding-top: 5px;
      p {
        font-size: 12px;
        padding-left: 22px;
      }
    }  
  }
`;

const StableSwapFormLabel = styled(AppFormLabel)`
  color: #9fadc6;
`;

const StableSwapWalletBalance = styled(WalletBalance)`
  color: #5a81ff;
`;

const StableSwapMaxButton = styled(MaxButton)`
  top: 43px;
  right: 32px;
  color: #a5baff;
`;

const StableSwapPriceInfoWrapper = styled(InfoWrapper)`
  width: 100%;
  padding: 0 0 10px;
  border-bottom: 1px solid #253656;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StableSwapInfoWrapper = styled(InfoWrapper)`
  width: 100%;
`;

const StableSwapInfoContainer = styled(Box)`
  padding-top: 15px;
  width: 100%;
`;

const StableSwapPriceInfo = styled(InfoLabel)`
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  text-transform: uppercase;
  display: flex;
  gap: 7px;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;
`;

const SwapButton = styled(ButtonPrimary)`
  height: 48px;
  width: 100%;
  font-size: 17px;
  line-height: 24px;
  margin: 20px 0 5px 0;
`;

const StableSwap = () => {
  const [options /*setOptions*/] = useState<string[]>(["US+", "FXD"]);

  const {
    dailyLimit,

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
    swapFee,

    inputError,
    isMobile,

    fxdAvailable,
    usStableAvailable,
  } = useStableSwap(options);

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}
    >
      <Grid container spacing={isMobile ? 1 : 3}>
        <PageHeader
          addPadding={true}
          title={"Stable Swap"}
          description={
            "Buy and sell FXD for US+ at a rate of 1:1 with low fees."
          }
        />
        <Grid item xs={12} sm={6} sx={{ margin: "0 auto" }}>
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
                      <Typography>
                        {inputError}
                      </Typography>
                    </>
                  ) : null
                }
              />
              <StableSwapMaxButton onClick={setMax}>Max</StableSwapMaxButton>
              {approveInputBtn ? (
                <ButtonSecondary
                  onClick={approveInput}
                  sx={{ float: "right", marginTop: "10px" }}
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
                    inputValue as number,
                    outputValue as number
                  )
                }
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
                disabled={true}
              >
                {useMemo(
                  () =>
                    options.map((option) => (
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

            {useMemo(() => {
              return (
                <StableSwapPriceInfoWrapper>
                  <StableSwapPriceInfo>
                    <Box component="span">
                      1 {inputCurrency} ={" "}
                      {outputCurrency === options[0]
                        ? 1 * fxdPrice
                        : fxdPrice
                        ? 1 / fxdPrice
                        : null}{" "}
                      {outputCurrency}
                    </Box>
                    <QuestionMarkButton>
                      <img src={QuestionMarkSrc} alt="question" width={20} />
                    </QuestionMarkButton>
                  </StableSwapPriceInfo>
                </StableSwapPriceInfoWrapper>
              );
            }, [inputCurrency, outputCurrency, fxdPrice, options])}

            <StableSwapInfoContainer>
              <StableSwapInfoWrapper>
                <InfoLabel>Fee</InfoLabel>
                <InfoValue>
                  {formatPercentage(swapFee)} FXD{" "}
                  {inputValue && (
                    <>
                      ({formatPercentage((swapFee / Number(inputValue)) * 100)}
                      %)
                    </>
                  )}
                </InfoValue>
              </StableSwapInfoWrapper>

              <StableSwapInfoWrapper>
                <InfoLabel>Daily Limit</InfoLabel>
                <InfoValue>{formatNumber(dailyLimit!)} FXD </InfoValue>
              </StableSwapInfoWrapper>

              <StableSwapInfoWrapper>
                <InfoLabel>FXD Pool Token Available</InfoLabel>
                <InfoValue>{formatNumber(fxdAvailable!)} FXD </InfoValue>
              </StableSwapInfoWrapper>

              <StableSwapInfoWrapper>
                <InfoLabel>US+ Pool Token Available</InfoLabel>
                <InfoValue>{formatNumber(usStableAvailable!)} US+ </InfoValue>
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
};

export default StableSwap;
