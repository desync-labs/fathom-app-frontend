import { useState, memo, useMemo } from "react";
import BigNumber from "bignumber.js";
import { Grid, Box as MuiBox, Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { StableSwapPaper } from "components/AppComponents/AppPaper/AppPaper";
import { PageHeader } from "components/Dashboard/PageHeader";
import {
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import useStableSwap from "hooks/StableSwap/useStableSwap";

import { formatNumber, formatPercentage } from "utils/format";

import {
  InfoLabel,
  InfoValue,
  InfoWrapper,
  WalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ButtonSecondary,
  MaxButton,
} from "components/AppComponents/AppButton/AppButton";

import useConnector from "context/connector";
import StableSwapForm, {
  StableSwapFormProps,
} from "components/Stableswap/StableSwapForm";
import useSharedContext from "context/shared";
import BasePageContainer from "components/Base/PageContainer";

export const StableSwapInputWrapper = styled(MuiBox)`
  position: relative;
  padding: 20px 24px 44px;
  background: #1e2f4c;
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
  color: #43fff1;
`;

export const StableSwapMaxButton = styled(MaxButton)`
  top: 43px;
  right: 32px;
  color: #a5baff;
`;

export const StableSwapInfoWrapper = styled(InfoWrapper)`
  width: 100%;
`;

export const StableSwapInfoContainer = styled(Box)`
  padding-top: 15px;
  width: 100%;
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
  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    button {
      height: auto;
      padding: 5px;
    }
  }
`;

const StableSwapApproveBtn = styled(ButtonSecondary)`
  height: 48px;
  width: 100%;
  font-size: 17px;
  line-height: 24px;
  margin: 20px 0 5px 0;
`;

const StableSwap = () => {
  const [options /*setOptions*/] = useState<string[]>(["xUSDT", "FXD"]);

  const data = useStableSwap(options);
  const {
    inputCurrency,
    depositTracker,
    totalLocked,
    dailyLimit,
    oneTimeSwapLimit,
    isDecentralizedState,
    isUserWhiteListed,
    inputValue,
    outputValue,
    handleSwap,
    swapPending,
    swapFee,
    fxdAvailable,
    usStableAvailable,
    navigate,
    outputCurrency,
    fxdPrice,
    inputError,
    approveInputBtn,
    approveOutputBtn,
    approveInput,
    approveOutput,
    approvalPending,
  } = data;

  const { allowStableSwap, isUserWrapperWhiteListed } = useConnector();
  const { isMobile } = useSharedContext();

  return (
    <BasePageContainer>
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
            {allowStableSwap && (
              <StableSwapForm
                {...({
                  ...data,
                  options,
                  isUserWrapperWhiteListed,
                } as unknown as StableSwapFormProps)}
              />
            )}

            {useMemo(
              () =>
                approveInputBtn ? (
                  <StableSwapApproveBtn
                    onClick={approveInput}
                    disabled={approvalPending === "input"}
                  >
                    {approvalPending === "input" ? (
                      <CircularProgress size={30} />
                    ) : (
                      `Approve ${inputCurrency}`
                    )}
                  </StableSwapApproveBtn>
                ) : approveOutputBtn ? (
                  <StableSwapApproveBtn
                    onClick={approveOutput}
                    disabled={approvalPending === "output"}
                  >
                    {approvalPending === "output" ? (
                      <CircularProgress size={30} />
                    ) : (
                      `Approve ${outputCurrency}`
                    )}
                  </StableSwapApproveBtn>
                ) : (
                  allowStableSwap && (
                    <SwapButton
                      isLoading={swapPending}
                      disabled={
                        !inputValue ||
                        BigNumber(inputValue).isLessThanOrEqualTo(0) ||
                        !outputValue ||
                        swapPending ||
                        !!inputError ||
                        approveInputBtn
                      }
                      onClick={handleSwap}
                    >
                      {swapPending ? <CircularProgress size={30} /> : "Swap"}
                    </SwapButton>
                  )
                ),
              [
                isUserWhiteListed,
                inputValue,
                outputValue,
                swapPending,
                inputError,
                approvalPending,
                approveInputBtn,
                approveOutputBtn,
                allowStableSwap,
                inputCurrency,
                outputCurrency,
                approveInput,
                approveOutput,
                handleSwap,
              ]
            )}

            {isUserWrapperWhiteListed && (
              <AddRemoveLiquidity>
                <ButtonSecondary
                  onClick={() => navigate("/stable-swap/add-liquidity")}
                >
                  Add Liquidity
                </ButtonSecondary>
                <ButtonSecondary
                  onClick={() => navigate("/stable-swap/remove-liquidity")}
                >
                  Remove Liquidity
                </ButtonSecondary>
                <ButtonSecondary
                  onClick={() => navigate("/stable-swap/manage-fees")}
                >
                  Manage Fees
                </ButtonSecondary>
              </AddRemoveLiquidity>
            )}

            <StableSwapInfoContainer>
              {allowStableSwap && (
                <StableSwapInfoWrapper sx={{ mb: 1 }}>
                  <InfoLabel>Fee</InfoLabel>
                  <InfoValue>
                    {formatPercentage(swapFee)} {inputCurrency}{" "}
                    {inputValue && (
                      <>
                        (
                        {formatPercentage(
                          BigNumber(swapFee)
                            .dividedBy(inputValue)
                            .multipliedBy(100)
                            .toNumber()
                        )}
                        %)
                      </>
                    )}
                  </InfoValue>
                </StableSwapInfoWrapper>
              )}
              {(isDecentralizedState || allowStableSwap) && (
                <>
                  {BigNumber(dailyLimit).isGreaterThan(0) && (
                    <StableSwapInfoWrapper>
                      <InfoLabel>Daily Limit</InfoLabel>
                      <InfoValue>
                        {formatPercentage(Number(dailyLimit))}
                      </InfoValue>
                    </StableSwapInfoWrapper>
                  )}
                  {BigNumber(oneTimeSwapLimit).isGreaterThan(0) && (
                    <StableSwapInfoWrapper sx={{ mb: 1 }}>
                      <InfoLabel>One time Limit</InfoLabel>
                      <InfoValue>
                        {formatPercentage(Number(oneTimeSwapLimit))}
                      </InfoValue>
                    </StableSwapInfoWrapper>
                  )}
                </>
              )}

              <StableSwapInfoWrapper>
                <InfoLabel>FXD Pool Token Available</InfoLabel>
                <InfoValue>
                  {formatPercentage(Number(fxdAvailable))} FXD{" "}
                </InfoValue>
              </StableSwapInfoWrapper>

              <StableSwapInfoWrapper sx={{ mb: 1 }}>
                <InfoLabel>xUSDT Pool Token Available</InfoLabel>
                <InfoValue>
                  {formatPercentage(Number(usStableAvailable))} xUSDT
                </InfoValue>
              </StableSwapInfoWrapper>

              <StableSwapInfoWrapper>
                <InfoLabel>Current DEX exchange rate</InfoLabel>
                <InfoValue>
                  1 {inputCurrency} ={" "}
                  {outputCurrency === options[0]
                    ? formatPercentage(fxdPrice)
                    : fxdPrice
                    ? formatPercentage(1 / fxdPrice)
                    : null}{" "}
                  {outputCurrency}
                </InfoValue>
              </StableSwapInfoWrapper>

              {isUserWrapperWhiteListed && (
                <StableSwapInfoWrapper>
                  <InfoLabel>Provided Liquidity</InfoLabel>
                  <InfoValue>
                    {formatNumber(
                      BigNumber(depositTracker)
                        .dividedBy(totalLocked)
                        .multipliedBy(100)
                        .toNumber()
                    )}{" "}
                    %
                  </InfoValue>
                </StableSwapInfoWrapper>
              )}
            </StableSwapInfoContainer>
          </StableSwapPaper>
        </Grid>
      </Grid>
    </BasePageContainer>
  );
};

export default memo(StableSwap);
