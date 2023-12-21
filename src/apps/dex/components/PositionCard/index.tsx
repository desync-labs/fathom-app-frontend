import { JSBI, Pair, Percent, TokenAmount } from "into-the-fathom-swap-sdk";
import { FC, useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { Link } from "react-router-dom";
import { Text } from "rebass";
import styled from "styled-components";
import { useTotalSupply } from "apps/dex/data/TotalSupply";

import { useActiveWeb3React } from "apps/dex/hooks";
import { useTokenBalance } from "apps/dex/state/wallet/hooks";
import { ExternalLink, TYPE } from "apps/dex/theme";
import { currencyId } from "apps/dex/utils/currencyId";
import { unwrappedToken } from "apps/dex/utils/wrappedCurrency";
import { ButtonSecondary, ButtonEmpty } from "apps/dex/components/Button";
import { CardNoise } from "apps/dex/components/earn/styled";

import { useColor } from "apps/dex/hooks/useColor";

import { GreyCard, LightCard } from "apps/dex/components/Card";
import { AutoColumn } from "apps/dex/components/Column";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import DoubleCurrencyLogo from "apps/dex/components/DoubleLogo";
import { RowBetween, RowFixed, AutoRow } from "apps/dex/components/Row";
import { Dots } from "apps/dex/components/swap/styleds";
import { BIG_INT_ZERO } from "apps/dex/constants";

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`;

const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: none;
  background-color: ${({ theme }) => theme.bg1};
  position: relative;
  overflow: hidden;
`;

interface PositionCardProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
  stakedBalance?: TokenAmount; // optional balance to indicate that liquidity is deposited in mining pool
}

export const MinimalPositionCard: FC<PositionCardProps> = ({
  pair,
  showUnwrapped = false,
  border,
}) => {
  const { account } = useActiveWeb3React();

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  );
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
        ]
      : [undefined, undefined];

  return (
    <>
      {userPoolBalance &&
      JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo
                  currency0={currency0}
                  currency1={currency1}
                  margin={true}
                  size={20}
                />
                <Text fontWeight={500} fontSize={20}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : "-"}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  Your pool share:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {poolTokenPercentage
                    ? poolTokenPercentage.toFixed(6) + "%"
                    : "-"}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency0.symbol}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={"6px"}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  "-"
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency1.symbol}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={"6px"}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  "-"
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      ) : (
        <LightCard>
          <TYPE.subHeader style={{ textAlign: "center" }}>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{" "}
            By adding liquidity you&apos;ll earn 0.3% of all trades on this pair
            proportional to your share of the pool. Fees are added to the pool,
            accrue in real time and can be claimed by withdrawing your
            liquidity.
          </TYPE.subHeader>
        </LightCard>
      )}
    </>
  );
};

const FullPositionCard: FC<PositionCardProps> = ({ pair, border }) => {
  const { account } = useActiveWeb3React();

  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState<boolean>(false);

  const userDefaultPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  );
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = userDefaultPoolBalance;

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
        ]
      : [undefined, undefined];

  const backgroundColor = useColor(pair?.token0);

  return (
    <StyledPositionCard sx={{ border }} bgColor={backgroundColor}>
      <CardNoise />
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <AutoRow gap="8px">
            <DoubleCurrencyLogo
              currency0={currency0}
              currency1={currency1}
              size={20}
            />
            <Text fontWeight={500} fontSize={20}>
              {!currency0 || !currency1 ? (
                <Dots>Loading</Dots>
              ) : (
                `${currency0.symbol}/${currency1.symbol}`
              )}
            </Text>
          </AutoRow>
          <RowFixed gap="8px">
            <ButtonEmpty
              padding="6px 8px"
              borderRadius="12px"
              width="fit-content"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? (
                <>
                  Manage
                  <ChevronUp
                    stroke={"white"}
                    size="20"
                    style={{ marginLeft: "10px" }}
                  />
                </>
              ) : (
                <>
                  Manage
                  <ChevronDown
                    stroke={"white"}
                    size="20"
                    style={{ marginLeft: "10px" }}
                  />
                </>
              )}
            </ButtonEmpty>
          </RowFixed>
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                Your total pool tokens:
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : "-"}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  Pooled {currency0.symbol}:
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={"6px"}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo
                    size="20px"
                    style={{ marginLeft: "8px" }}
                    currency={currency0}
                  />
                </RowFixed>
              ) : (
                "-"
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  Pooled {currency1.symbol}:
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={"6px"}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo
                    size="20px"
                    style={{ marginLeft: "8px" }}
                    currency={currency1}
                  />
                </RowFixed>
              ) : (
                "-"
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                Your pool share:
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === "0.00"
                      ? "<0.01"
                      : poolTokenPercentage.toFixed(2)) + "%"
                  : "-"}
              </Text>
            </FixedHeightRow>

            <ButtonSecondary padding="8px" borderRadius="8px">
              <ExternalLink
                style={{ width: "100%", textAlign: "center" }}
                href={`https://charts.fathom.fi/#/account/${account}`}
              >
                View accrued fees and analytics
                <span style={{ fontSize: "11px" }}>↗</span>
              </ExternalLink>
            </ButtonSecondary>
            {userDefaultPoolBalance &&
              JSBI.greaterThan(userDefaultPoolBalance.raw, BIG_INT_ZERO) && (
                <RowBetween marginTop="10px">
                  <ButtonSecondary
                    padding="8px"
                    borderRadius="8px"
                    as={Link}
                    to={`/swap/add/${currencyId(currency0)}/${currencyId(
                      currency1
                    )}`}
                    width="48%"
                  >
                    Add
                  </ButtonSecondary>
                  <ButtonSecondary
                    padding="8px"
                    borderRadius="8px"
                    as={Link}
                    width="48%"
                    to={`/swap/remove/${currencyId(currency0)}/${currencyId(
                      currency1
                    )}`}
                  >
                    Remove
                  </ButtonSecondary>
                </RowBetween>
              )}
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  );
};

export default FullPositionCard;
