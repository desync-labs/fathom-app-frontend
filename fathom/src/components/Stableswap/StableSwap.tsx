import React, {
  useState
} from "react";
import BigNumber from "bignumber.js";
import {
  Grid,
  Box as MuiBox,
  Box,
  CircularProgress,
  Container
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { StableSwapPaper } from "components/AppComponents/AppPaper/AppPaper";
import { PageHeader } from "components/Dashboard/PageHeader";
import {
  AppFormLabel,
  AppTextField
} from "components/AppComponents/AppForm/AppForm";
import useStableSwap from "hooks/useStableSwap";

import {
  formatNumber,
  formatPercentage
} from "utils/format";

import {
  InfoLabel,
  InfoValue,
  InfoWrapper,
  WalletBalance
} from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ButtonSecondary,
  MaxButton
} from "components/AppComponents/AppButton/AppButton";

import useConnector from "context/connector";
import StableSwapForm from "components/Stableswap/StableSwapForm";

export const StableSwapInputWrapper = styled(MuiBox)`
  position: relative;
  padding: 20px 24px 44px;
  background: #1d2d49;
  border-radius: 12px;
  width: 100%;
`;

export const StableSwapTextField = styled(AppTextField)`
  input {
    font-size: 20px;
    color: #4f658c;
    padding: 0 50px 0 130px;

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

export const StableSwapFormLabel = styled(AppFormLabel)`
  color: #9fadc6;
`;

export const StableSwapWalletBalance = styled(WalletBalance)`
  color: #5a81ff;
`;

export const StableSwapMaxButton = styled(MaxButton)`
  top: 43px;
  right: 32px;
  color: #a5baff;
`;

export const StableSwapPriceInfoWrapper = styled(InfoWrapper)`
  width: 100%;
  padding: 0 0 10px;
  border-bottom: 1px solid #253656;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StableSwapInfoWrapper = styled(InfoWrapper)`
  width: 100%;
`;

export const StableSwapInfoContainer = styled(Box)`
  padding-top: 15px;
  width: 100%;
`;

export const StableSwapPriceInfo = styled(InfoLabel)`
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

export const SwapButton = styled(ButtonPrimary)`
  height: 48px;
  width: 100%;
  font-size: 17px;
  line-height: 24px;
  margin: 20px 0 5px 0;
`;

const AddRemoveLiquidity = styled(Box)`
  border-bottom: 1px solid #253656;
  border-top: 1px solid #253656;
  display: flex;
  width: 100%;
  padding-bottom: 10px;
  padding-top: 10px;
  justify-content: right;
  gap: 7px;
`;

const StableSwap = () => {
  const [options /*setOptions*/] = useState<string[]>(["xUSDT", "FXD"]);

  const data = useStableSwap(options);
  const {
    inputCurrency,
    depositTracker,
    totalLocked,
    dailyLimit,
    isDecentralizedState,
    isUserWhiteListed,
    inputValue,
    outputValue,
    handleSwap,
    swapPending,
    swapFee,
    isMobile,
    fxdAvailable,
    usStableAvailable,
    navigate,
    outputCurrency,
    fxdPrice
  } = data;

  const { allowStableSwap, isUserWrapperWhiteListed } = useConnector();

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
            "Buy and sell FXD for xUSDT at a rate of 1:1 with low fees. (only for allowed addresses on mainnet)"
          }
        />
        <Grid item xs={12} sm={10} md={8} lg={6} sx={{ margin: "0 auto" }}>
          <StableSwapPaper>
            {allowStableSwap && <StableSwapForm {...{ ...data, options }} />}

            {allowStableSwap && <SwapButton
              isLoading={swapPending}
              disabled={!inputValue || !outputValue || swapPending || isUserWhiteListed === false}
              onClick={handleSwap}
            >
              {swapPending ? <CircularProgress size={30} /> : "Swap"}
            </SwapButton>}

            {isUserWrapperWhiteListed && <AddRemoveLiquidity>
              <ButtonSecondary onClick={() => navigate("/swap/add-liquidity")}>Add Liquidity</ButtonSecondary>
              <ButtonSecondary onClick={() => navigate("/swap/remove-liquidity")}>Remove Liquidity</ButtonSecondary>
              <ButtonSecondary onClick={() => navigate("/swap/manage-fees")}>Manage Fees</ButtonSecondary>
            </AddRemoveLiquidity>}

            <StableSwapInfoContainer>
              {allowStableSwap && <StableSwapInfoWrapper>
                <InfoLabel>Fee</InfoLabel>
                <InfoValue>
                  {formatPercentage(swapFee)} {inputCurrency}{" "}
                  {inputValue && (
                    <>
                      ({formatPercentage(BigNumber(swapFee).dividedBy(inputValue).multipliedBy(100).toNumber())}%)
                    </>
                  )}
                </InfoValue>
              </StableSwapInfoWrapper>}
              {isDecentralizedState && allowStableSwap && <StableSwapInfoWrapper>
                <InfoLabel>Daily Limit</InfoLabel>
                <InfoValue>{formatNumber(dailyLimit!)} FXD </InfoValue>
              </StableSwapInfoWrapper>}

              <StableSwapInfoWrapper>
                <InfoLabel>FXD Pool Token Available</InfoLabel>
                <InfoValue>{formatNumber(fxdAvailable!)} FXD </InfoValue>
              </StableSwapInfoWrapper>

              <StableSwapInfoWrapper>
                <InfoLabel>xUSDT Pool Token Available</InfoLabel>
                <InfoValue>{formatNumber(usStableAvailable!)} xUSDT</InfoValue>
              </StableSwapInfoWrapper>

              <StableSwapInfoWrapper>
                <InfoLabel>Current DEX exchange rate</InfoLabel>
                <InfoValue>
                  1 {inputCurrency} ={" "}
                  {outputCurrency === options[0] ? formatPercentage(fxdPrice) : fxdPrice ? formatPercentage(1 / fxdPrice)  : null}{" "}
                  {outputCurrency}
                </InfoValue>
              </StableSwapInfoWrapper>
            </StableSwapInfoContainer>

            {isUserWrapperWhiteListed && <StableSwapInfoContainer>
              <StableSwapInfoWrapper>
                <InfoLabel>Provided Liquidity</InfoLabel>
                <InfoValue>{formatNumber(
                  BigNumber(depositTracker).dividedBy(totalLocked).multipliedBy(100).toNumber()
                )} %</InfoValue>
              </StableSwapInfoWrapper>
            </StableSwapInfoContainer>}
          </StableSwapPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StableSwap;
