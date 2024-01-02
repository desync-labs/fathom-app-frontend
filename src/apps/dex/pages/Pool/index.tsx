import { useMemo } from "react";
import styled from "styled-components";
import { Pair } from "into-the-fathom-swap-sdk";
import { Link } from "react-router-dom";
import { SwapPoolTabs } from "apps/dex/components/NavigationTabs";

import FullPositionCard from "apps/dex/components/PositionCard";
import { useTokenBalancesWithLoadingIndicator } from "apps/dex/state/wallet/hooks";
import { StyledInternalLink, TYPE, HideSmall } from "apps/dex/theme";
import { Text } from "rebass";
import Card from "apps/dex/components/Card";
import { RowBetween, RowFixed } from "apps/dex/components/Row";
import { ButtonPrimary, ButtonSecondary } from "apps/dex/components/Button";
import { AutoColumn } from "apps/dex/components/Column";

import { useActiveWeb3React } from "apps/dex/hooks";
import { usePairs } from "apps/dex/data/Reserves";
import {
  toV2LiquidityToken,
  useTrackedTokenPairs,
} from "apps/dex/state/user/hooks";
import { Dots } from "apps/dex/components/swap/styleds";
import {
  CardSection,
  DataCard,
  CardNoise,
  CardBGImage,
} from "apps/dex/components/earn/styled";

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`;

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => theme.bg7};
  overflow: hidden;
`;

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`;

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`;

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`;

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`;

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Pool = () => {
  const { account } = useActiveWeb3React();

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs();
  // console.log(trackedTokenPairs)

  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs]
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  );
  const [v2PairsBalances, fetchingV2PairBalances] =
    useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens);

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan("0")
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  );

  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens)
  );
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity;

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs />
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.black fontWeight={600}>
                  Liquidity provider rewards
                </TYPE.black>
              </RowBetween>
              <RowBetween>
                <TYPE.black fontSize={14}>
                  {`Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.`}
                </TYPE.black>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: "100%" }}>
            <TitleRow style={{ marginTop: "1rem" }} padding={"0"}>
              <HideSmall>
                <TYPE.mediumHeader
                  style={{ marginTop: "0.5rem", justifySelf: "flex-start" }}
                >
                  Your liquidity
                </TYPE.mediumHeader>
              </HideSmall>
              <ButtonRow>
                <ResponsiveButtonSecondary
                  as={Link}
                  padding="6px 8px"
                  to={"/swap/create/XDC"}
                >
                  Create a pair
                </ResponsiveButtonSecondary>
                <ResponsiveButtonPrimary
                  id="join-pool-button"
                  as={Link}
                  padding="6px 8px"
                  borderRadius="12px"
                  to={"/swap/add/XDC"}
                >
                  <Text fontWeight={500} fontSize={16}>
                    Add Liquidity
                  </Text>
                </ResponsiveButtonPrimary>
              </ButtonRow>
            </TitleRow>

            {!account ? (
              <Card padding="40px">
                <TYPE.body textAlign="center">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
              </Card>
            ) : v2IsLoading ? (
              <EmptyProposals>
                <TYPE.body textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : allV2PairsWithLiquidity?.length > 0 ? (
              <>
                <ButtonSecondary>
                  <RowBetween>
                    <StyledInternalLink to={"/charts/account/" + account}>
                      Account analytics and accrued fees
                    </StyledInternalLink>
                    <span> ↗</span>
                  </RowBetween>
                </ButtonSecondary>
                {v2PairsWithoutStakedAmount.map((v2Pair) => (
                  <FullPositionCard
                    key={v2Pair.liquidityToken.address}
                    pair={v2Pair}
                  />
                ))}
              </>
            ) : (
              <EmptyProposals>
                <TYPE.body textAlign="center">No liquidity found.</TYPE.body>
              </EmptyProposals>
            )}

            <AutoColumn justify={"center"} gap="md">
              {"Don't see a pool you joined?"}{" "}
              <StyledInternalLink id="import-pool-link" to={"/swap/find"}>
                {"Import it."}
              </StyledInternalLink>
            </AutoColumn>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  );
};

export default Pool;
