import BigNumber from "bignumber.js";
import { CircularProgress, Container, Grid } from "@mui/material";
import { PageHeader } from "components/Dashboard/PageHeader";
import { StableSwapPaper } from "components/AppComponents/AppPaper/AppPaper";
import useStableSwapManageFees from "hooks/StableSwap/useStableSwapManageFees";
import {
  StableSwapInfoContainer,
  StableSwapInfoWrapper,
  SwapButton,
} from "components/Stableswap/StableSwap";
import { InfoLabel, InfoValue } from "components/AppComponents/AppBox/AppBox";
import { formatPercentage } from "utils/format";
import useSharedContext from "context/shared";
import { memo } from "react";

const StableSwapManageFees = () => {
  const {
    fxdDecimals,
    stableDecimals,
    feesRewardsForFXD,
    feesRewardsForUSDTx,
    claimedFXDFeeReward,
    claimedUSDTFeeReward,
    claimRewardsInProgress,
    withdrawClaimedFeesInProgress,
    claimFeesRewards,
    withdrawClaimedFees,
  } = useStableSwapManageFees();
  const { isMobile } = useSharedContext();

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}
    >
      <Grid container spacing={isMobile ? 1 : 3}>
        <PageHeader
          addPadding={true}
          title={"Manage Fees"}
          description={"Manage Fees for Stable Swap."}
        />
        <Grid item xs={12} sm={10} md={8} lg={6} sx={{ margin: "0 auto" }}>
          <StableSwapPaper>
            <StableSwapInfoContainer>
              <StableSwapInfoWrapper>
                <InfoLabel>Fees FXD Reward</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(feesRewardsForFXD)
                      .dividedBy(BigNumber(10).exponentiatedBy(fxdDecimals))
                      .toNumber()
                  )}{" "}
                  FXD
                </InfoValue>
              </StableSwapInfoWrapper>
              <StableSwapInfoWrapper>
                <InfoLabel>Fees xUSDT Rewards</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(feesRewardsForUSDTx)
                      .dividedBy(BigNumber(10).exponentiatedBy(stableDecimals))
                      .toNumber()
                  )}{" "}
                  xUSDT
                </InfoValue>
              </StableSwapInfoWrapper>
            </StableSwapInfoContainer>
            {BigNumber(feesRewardsForFXD).isGreaterThan(0) ||
            BigNumber(feesRewardsForUSDTx).isGreaterThan(0) ? (
              <SwapButton
                isLoading={claimRewardsInProgress}
                disabled={claimRewardsInProgress}
                onClick={claimFeesRewards}
              >
                {claimRewardsInProgress ? (
                  <CircularProgress size={30} />
                ) : (
                  "Claim Fees Rewards"
                )}
              </SwapButton>
            ) : null}

            <StableSwapInfoContainer>
              <StableSwapInfoWrapper>
                <InfoLabel>Claimed FXD Fee Reward</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(claimedFXDFeeReward)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )}{" "}
                  FXD
                </InfoValue>
              </StableSwapInfoWrapper>
              <StableSwapInfoWrapper>
                <InfoLabel>Claimed xUSDT Fee Reward</InfoLabel>
                <InfoValue>
                  {formatPercentage(
                    BigNumber(claimedUSDTFeeReward)
                      .dividedBy(10 ** 6)
                      .toNumber()
                  )}{" "}
                  xUSDT
                </InfoValue>
              </StableSwapInfoWrapper>
            </StableSwapInfoContainer>

            {BigNumber(claimedFXDFeeReward).isGreaterThan(0) ||
            BigNumber(claimedUSDTFeeReward).isGreaterThan(0) ? (
              <SwapButton
                isLoading={withdrawClaimedFeesInProgress}
                disabled={withdrawClaimedFeesInProgress}
                onClick={withdrawClaimedFees}
              >
                {withdrawClaimedFeesInProgress ? (
                  <CircularProgress size={30} />
                ) : (
                  "Withdraw Claimed Fees"
                )}
              </SwapButton>
            ) : null}
          </StableSwapPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default memo(StableSwapManageFees);
