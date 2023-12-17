import { useEffect, useMemo, useState } from "react";
import { Box } from "rebass";
import styled from "styled-components";

import { AutoRow, RowBetween } from "apps/charts/components/Row";
import { AutoColumn } from "apps/charts/components/Column";
import PairList from "apps/charts/components/PairList";
import TopTokenList from "apps/charts/components/TokenList";
import TxnList from "apps/charts/components/TxnList";
import GlobalChart from "apps/charts/components/GlobalChart";
import Search from "apps/charts/components/Search";
import GlobalStats from "apps/charts/components/GlobalStats";

import {
  useGlobalData,
  useGlobalTransactions,
} from "apps/charts/contexts/GlobalData";
import { useAllPairData } from "apps/charts/contexts/PairData";
import { useMedia } from "react-use";
import Panel from "apps/charts/components/Panel";
import { useAllTokenData } from "apps/charts/contexts/TokenData";
import { formattedNum, formattedPercent } from "apps/charts/utils";
import { TYPE } from "apps/charts/Theme";
import { CustomLink } from "apps/charts/components/Link";

import { PageWrapper, ContentWrapper } from "apps/charts/components";
import CheckBox from "apps/charts/components/Checkbox";
import QuestionHelper from "apps/charts/components/QuestionHelper";
import { TOKEN_BLACKLIST } from "apps/charts/constants";

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`;

const GridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
`;

function GlobalPage() {
  // get data for lists and totals
  const allPairs = useAllPairData();
  const allTokens = useAllTokenData();
  const transactions = useGlobalTransactions();
  const {
    totalLiquidityUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    liquidityChangeUSD,
  } = useGlobalData();

  // breakpoints
  const below800 = useMedia("(max-width: 800px)");

  // scrolling refs
  useEffect(() => {
    (document.querySelector("body") as HTMLBodyElement).scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);

  // for tracked data on pairs
  const [useTracked, setUseTracked] = useState(true);

  const formattedTokens = useMemo(() => {
    return (
      allTokens &&
      Object.keys(allTokens)
        .filter((key) => {
          return !TOKEN_BLACKLIST.includes(key);
        })
        .map((key) => allTokens[key])
    );
  }, [allTokens]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <div>
          <AutoColumn
            gap="24px"
            style={{ paddingBottom: below800 ? "0" : "24px" }}
          >
            <TYPE.largeHeader>
              {below800 ? "Fathom DEX Analytics" : "Fathom DEX Analytics"}
            </TYPE.largeHeader>
            <Search />
            <GlobalStats />
          </AutoColumn>
          {below800 && ( // mobile card
            <Box mb={20}>
              <Box>
                <AutoColumn gap="36px">
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>Volume (24hrs)</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main
                        fontSize={"1.5rem"}
                        lineHeight={1}
                        fontWeight={600}
                      >
                        {oneDayVolumeUSD
                          ? formattedNum(oneDayVolumeUSD, true)
                          : "-"}
                      </TYPE.main>
                      <TYPE.main fontSize={12}>
                        {volumeChangeUSD
                          ? formattedPercent(volumeChangeUSD)
                          : "-"}
                      </TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>Total Liquidity</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main
                        fontSize={"1.5rem"}
                        lineHeight={1}
                        fontWeight={600}
                      >
                        {totalLiquidityUSD
                          ? formattedNum(totalLiquidityUSD, true)
                          : "-"}
                      </TYPE.main>
                      <TYPE.main fontSize={12}>
                        {liquidityChangeUSD
                          ? formattedPercent(liquidityChangeUSD)
                          : "-"}
                      </TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </AutoColumn>
              </Box>
            </Box>
          )}
          {!below800 && (
            <Box sx={{ marginTop: "2.5rem" }}>
              <GridRow>
                <Box sx={{ position: "relative" }}>
                  <GlobalChart display="liquidity" />
                </Box>
                <Box sx={{ position: "relative" }}>
                  <GlobalChart display="volume" />
                </Box>
              </GridRow>
            </Box>
          )}
          {below800 && (
            <AutoColumn style={{ marginTop: "6px" }} gap="24px">
              <Panel style={{ height: "100%", minHeight: "300px" }}>
                <GlobalChart display="liquidity" />
              </Panel>
            </AutoColumn>
          )}
          {formattedTokens && formattedTokens.length && (
            <>
              <ListOptions
                gap="10px"
                style={{ marginTop: "2rem", marginBottom: ".5rem" }}
              >
                <RowBetween>
                  <TYPE.main
                    fontSize={"1.125rem"}
                    style={{ whiteSpace: "nowrap", marginBottom: "2rem" }}
                  >
                    Top Tokens
                  </TYPE.main>
                  <CustomLink to={"/charts/tokens"}>See All</CustomLink>
                </RowBetween>
              </ListOptions>
              <TopTokenList formattedTokens={formattedTokens} />
            </>
          )}
          <ListOptions
            gap="10px"
            style={{ marginTop: "2rem", marginBottom: ".5rem" }}
          >
            <RowBetween>
              <TYPE.main
                fontSize={"1.125rem"}
                style={{ whiteSpace: "nowrap", marginBottom: "2rem" }}
              >
                Top Pairs
              </TYPE.main>
              <AutoRow gap="4px" width="100%" justifyContent="flex-end">
                <CheckBox
                  checked={useTracked}
                  setChecked={() => setUseTracked(!useTracked)}
                  text={"Hide untracked pairs"}
                />
                <QuestionHelper text="USD amounts may be inaccurate in low liquiidty pairs or pairs without ETH or stablecoins." />
                <CustomLink to={"/charts/pairs"}>See All</CustomLink>
              </AutoRow>
            </RowBetween>
          </ListOptions>
          <PairList pairs={allPairs} useTracked={useTracked} color={"#fff"} />
          <span>
            <TYPE.main
              fontSize={"1.125rem"}
              style={{ marginTop: "2rem", marginBottom: "2rem" }}
            >
              Transactions
            </TYPE.main>
          </span>
          <TxnList transactions={transactions} color={"#fff"} />
        </div>
      </ContentWrapper>
    </PageWrapper>
  );
}

export default GlobalPage;
