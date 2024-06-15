import { CircularProgress, Container, Grid } from "@mui/material";
import { PageHeader } from "components/Dashboard/PageHeader";
import { StableSwapPaper } from "components/AppComponents/AppPaper/AppPaper";
import {
  StableSwapFormLabel,
  StableSwapInfoContainer,
  StableSwapInfoWrapper,
  StableSwapInputWrapper,
  StableSwapMaxButton,
  StableSwapTextField,
  SwapButton,
} from "components/Stableswap/StableSwap";
import { InfoLabel, InfoValue } from "components/AppComponents/AppBox/AppBox";
import InfoIcon from "@mui/icons-material/Info";
import { formatPercentage } from "utils/format";
import BigNumber from "bignumber.js";
import useStableSwapRemoveLiquidity from "hooks/StableSwap/useStableSwapRemoveLiquidity";
import { styled } from "@mui/material/styles";
import useSharedContext from "context/shared";
import { memo } from "react";

const StableSwapInfoRemoveLiquidityContainer = styled(StableSwapInfoContainer)`
  padding: 0;
`;

const StableSwapRemoveLiquidity = () => {
  const {
    fxdDecimals,
    stableDecimals,
    fxdBalance,
    stableBalance,
    inputError,
    inputValue,
    handleInputValueTextFieldChange,
    setMax,
    handleRemoveLiquidity,
    removeLiquidityPending,
    liquidityPerUserFxd,
    liquidityPerUserStable,
    totalLiquidity,
    removeAmountFxd,
    removeAmountStable,
  } = useStableSwapRemoveLiquidity();
  const { isMobile } = useSharedContext();

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}
    >
      <Grid container spacing={isMobile ? 1 : 3}>
        <PageHeader
          addPadding={true}
          title={"Remove Liquidity"}
          description={"Remove Liquidity from Stable Swap."}
        />
        <Grid item xs={12} sm={10} md={8} lg={6} sx={{ margin: "0 auto" }}>
          <StableSwapPaper>
            <StableSwapInputWrapper>
              <StableSwapFormLabel>Amount</StableSwapFormLabel>
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
                      <span>{inputError}</span>
                    </>
                  ) : null
                }
              />
              <StableSwapMaxButton onClick={setMax}>Max</StableSwapMaxButton>
            </StableSwapInputWrapper>

            <StableSwapInfoRemoveLiquidityContainer sx={{ marginTop: "20px" }}>
              <StableSwapInfoWrapper>
                <InfoLabel>Receive FXD</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(removeAmountFxd)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )}{" "}
                  FXD
                </InfoValue>
              </StableSwapInfoWrapper>
              <StableSwapInfoWrapper>
                <InfoLabel>Receive xUSDT</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(removeAmountStable)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )}{" "}
                  xUSDT
                </InfoValue>
              </StableSwapInfoWrapper>
            </StableSwapInfoRemoveLiquidityContainer>

            <StableSwapInfoRemoveLiquidityContainer>
              <StableSwapInfoWrapper>
                <InfoLabel>FXD Wallet Balance</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(fxdBalance)
                      .dividedBy(BigNumber(10).exponentiatedBy(fxdDecimals))
                      .toNumber()
                  )}{" "}
                  FXD
                </InfoValue>
              </StableSwapInfoWrapper>
              <StableSwapInfoWrapper>
                <InfoLabel>xUSDT Wallet Balance</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(stableBalance)
                      .dividedBy(BigNumber(10).exponentiatedBy(stableDecimals))
                      .toNumber()
                  )}{" "}
                  xUSDT
                </InfoValue>
              </StableSwapInfoWrapper>
            </StableSwapInfoRemoveLiquidityContainer>

            <StableSwapInfoRemoveLiquidityContainer>
              <StableSwapInfoWrapper>
                <InfoLabel>User Liquidity FXD</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(liquidityPerUserFxd)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )}{" "}
                  FXD
                </InfoValue>
              </StableSwapInfoWrapper>
              <StableSwapInfoWrapper>
                <InfoLabel>User Liquidity xUSDT</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(liquidityPerUserStable)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )}{" "}
                  xUSDT
                </InfoValue>
              </StableSwapInfoWrapper>
            </StableSwapInfoRemoveLiquidityContainer>
            <StableSwapInfoRemoveLiquidityContainer>
              <StableSwapInfoWrapper>
                <InfoLabel>Total Liquidity</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(totalLiquidity)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )}
                </InfoValue>
              </StableSwapInfoWrapper>
            </StableSwapInfoRemoveLiquidityContainer>

            <SwapButton
              isLoading={removeLiquidityPending}
              disabled={removeLiquidityPending || !inputValue}
              onClick={handleRemoveLiquidity}
            >
              {removeLiquidityPending ? (
                <CircularProgress size={30} />
              ) : (
                "Remove Liquidity"
              )}
            </SwapButton>
          </StableSwapPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default memo(StableSwapRemoveLiquidity);
