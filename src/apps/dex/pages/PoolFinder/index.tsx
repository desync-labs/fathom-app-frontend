import { useCallback, useEffect, useState } from "react";
import { Currency, JSBI, TokenAmount, XDC } from "into-the-fathom-swap-sdk";
import { Box, styled, Typography } from "@mui/material";

import { ButtonDropdownLight } from "apps/dex/components/Button";
import { LightCard } from "apps/dex/components/Card";
import { AutoColumn, ColumnCenter } from "apps/dex/components/Column";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import { FindPoolTabs } from "apps/dex/components/NavigationTabs";
import { MinimalPositionCard } from "apps/dex/components/PositionCard";
import Row from "apps/dex/components/Row";
import CurrencySearchModal from "apps/dex/components/SearchModal/CurrencySearchModal";
import { PairState, usePair } from "apps/dex/data/Reserves";
import { useActiveWeb3React } from "apps/dex/hooks";
import { usePairAdder } from "apps/dex/state/user/hooks";
import { useTokenBalance } from "apps/dex/state/wallet/hooks";
import { StyledInternalLink } from "apps/dex/theme";
import { currencyId } from "apps/dex/utils/currencyId";
import AppBody from "apps/dex/pages/AppBody";
import { Dots } from "apps/dex/pages/Pool/styleds";
import { BlueCard } from "apps/dex/components/Card";
import { TYPE } from "apps/dex/theme";

import AddIcon from "@mui/icons-material/Add";

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const PlusWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const IconWrapper = styled(Box)`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6379a1;
  border-radius: 15px;
`;

const PoolFinder = () => {
  const { account } = useActiveWeb3React();

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);

  const [currency0, setCurrency0] = useState<Currency | null>(XDC);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = usePair(
    currency0 ?? undefined,
    currency1 ?? undefined
  );
  const addPair = usePairAdder();
  useEffect(() => {
    if (pair) {
      addPair(pair);
    }
  }, [pair, addPair]);

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    );

  const position: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    pair?.liquidityToken
  );
  const hasPosition = Boolean(
    position && JSBI.greaterThan(position.raw, JSBI.BigInt(0))
  );

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency);
      } else {
        setCurrency1(currency);
      }
    },
    [activeField]
  );

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false);
  }, [setShowSearch]);

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <Typography textAlign="center">
        {!account
          ? "Connect to a wallet to find pools"
          : "Select a token to find your liquidity."}
      </Typography>
    </LightCard>
  );

  return (
    <AppBody>
      <FindPoolTabs />
      <AutoColumn style={{ padding: "1rem" }} gap="md">
        <BlueCard>
          <AutoColumn gap="10px">
            <TYPE.link fontWeight={400} color={"#ffffff"}>
              <b>Tip:</b> Use this tool to find pairs that don&apos;t
              automatically appear in the interface.
            </TYPE.link>
          </AutoColumn>
        </BlueCard>
        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true);
            setActiveField(Fields.TOKEN0);
          }}
        >
          {currency0 ? (
            <Row>
              <CurrencyLogo currency={currency0} />
              <Typography fontWeight={500} fontSize={20} marginLeft={"12px"}>
                {currency0.symbol}
              </Typography>
            </Row>
          ) : (
            <Typography fontWeight={500} fontSize={20} marginLeft={"12px"}>
              Select a Token
            </Typography>
          )}
        </ButtonDropdownLight>

        <PlusWrapper>
          <ColumnCenter>
            <IconWrapper>
              <AddIcon
                sx={{ width: "20px", height: "20px", color: "#061023" }}
              />
            </IconWrapper>
          </ColumnCenter>
        </PlusWrapper>

        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true);
            setActiveField(Fields.TOKEN1);
          }}
        >
          {currency1 ? (
            <Row>
              <CurrencyLogo currency={currency1} />
              <Typography fontWeight={500} fontSize={20} marginLeft={"12px"}>
                {currency1.symbol}
              </Typography>
            </Row>
          ) : (
            <Typography fontWeight={500} fontSize={20} marginLeft={"12px"}>
              Select a Token
            </Typography>
          )}
        </ButtonDropdownLight>

        {hasPosition && (
          <ColumnCenter
            style={{
              justifyItems: "center",
              backgroundColor: "",
              padding: "12px 0px",
              borderRadius: "12px",
            }}
          >
            <Typography textAlign="center" fontWeight={500}>
              Pool Found!
            </Typography>
            <StyledInternalLink to={`/swap/pool`}>
              <Typography textAlign="center">Manage this pool.</Typography>
            </StyledInternalLink>
          </ColumnCenter>
        )}

        {currency0 && currency1 ? (
          pairState === PairState.EXISTS ? (
            hasPosition && pair ? (
              <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
            ) : (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Typography textAlign="center">
                    You don’t have liquidity in this pool yet.
                  </Typography>
                  <StyledInternalLink
                    to={`/swap/add/${currencyId(currency0)}/${currencyId(
                      currency1
                    )}`}
                  >
                    <Typography textAlign="center">Add liquidity.</Typography>
                  </StyledInternalLink>
                </AutoColumn>
              </LightCard>
            )
          ) : validPairNoLiquidity ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Typography textAlign="center">No pool found.</Typography>
                <StyledInternalLink
                  to={`/swap/add/${currencyId(currency0)}/${currencyId(
                    currency1
                  )}`}
                >
                  Create pool.
                </StyledInternalLink>
              </AutoColumn>
            </LightCard>
          ) : pairState === PairState.INVALID ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Typography textAlign="center" fontWeight={500}>
                  Invalid pair.
                </Typography>
              </AutoColumn>
            </LightCard>
          ) : pairState === PairState.LOADING ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Typography textAlign="center">
                  Loading
                  <Dots />
                </Typography>
              </AutoColumn>
            </LightCard>
          ) : null
        ) : (
          prerequisiteMessage
        )}
      </AutoColumn>

      <CurrencySearchModal
        isOpen={showSearch}
        onCurrencySelect={handleCurrencySelect}
        onDismiss={handleSearchDismiss}
        showCommonBases
        selectedCurrency={
          (activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined
        }
      />
    </AppBody>
  );
};

export default PoolFinder;
