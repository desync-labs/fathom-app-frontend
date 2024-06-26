import BigNumber from "bignumber.js";
import { CircularProgress, Container, Grid } from "@mui/material";
import useStableSwapAddLiquidity from "hooks/StableSwap/useStableSwapAddLiquidity";
import { PageHeader } from "components/Dashboard/PageHeader";

import { StableSwapPaper } from "components/AppComponents/AppPaper/AppPaper";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
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
import useSharedContext from "context/shared";
import { memo } from "react";

const StableSwapAddLiquidity = () => {
  const {
    totalLiquidity,
    fxdDecimals,
    stableDecimals,
    fxdBalance,
    stableBalance,
    inputError,
    inputValue,
    handleInputValueTextFieldChange,
    setMax,
    approveInputBtn,
    approvalPending,
    addLiquidityPending,
    approve,
    handleAddLiquidity,
  } = useStableSwapAddLiquidity();
  const { isMobile } = useSharedContext();

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}
    >
      <Grid container spacing={isMobile ? 1 : 3}>
        <PageHeader
          addPadding={true}
          title={"Add Liquidity"}
          description={"Add Liquidity to Stable Swap."}
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
              {approveInputBtn ? (
                <ButtonPrimary
                  onClick={approve}
                  disabled={approvalPending}
                  sx={{ float: "right", mt: "10px" }}
                >
                  {approvalPending ? (
                    <CircularProgress
                      size={20}
                      sx={{ color: "#43fff1 !important" }}
                    />
                  ) : (
                    "Approve Tokens for Add Liquidity"
                  )}
                </ButtonPrimary>
              ) : null}
            </StableSwapInputWrapper>

            <StableSwapInfoContainer>
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
                <InfoLabel>Total Liquidity</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(totalLiquidity)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )}
                </InfoValue>
              </StableSwapInfoWrapper>
            </StableSwapInfoContainer>

            <SwapButton
              isLoading={addLiquidityPending}
              disabled={addLiquidityPending || !inputValue || approveInputBtn}
              onClick={handleAddLiquidity}
            >
              {addLiquidityPending ? (
                <CircularProgress size={30} />
              ) : (
                "Add Liquidity"
              )}
            </SwapButton>
          </StableSwapPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default memo(StableSwapAddLiquidity);
