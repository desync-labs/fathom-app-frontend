import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import styled from "styled-components";
import { ApolloProvider } from "@apollo/client";
import { client } from "apps/charts/apollo/client";
import { Route, Switch, HashRouter, Redirect } from "react-router-dom";
import GlobalPage from "apps/charts/pages/GlobalPage";
import TokenPage from "apps/charts/pages/TokenPage";
import PairPage from "apps/charts/pages/PairPage";
import {
  useGlobalData,
  useGlobalChartData,
} from "apps/charts/contexts/GlobalData";
import { isAddress } from "apps/charts/utils";
import AccountPage from "apps/charts/pages/AccountPage";
import AllTokensPage from "apps/charts/pages/AllTokensPage";
import AllPairsPage from "apps/charts/pages/AllPairsPage";
import PinnedData from "apps/charts/components/PinnedData";

import SideNav from "apps/charts/components/SideNav";
import AccountLookup from "apps/charts/pages/AccountLookup";
import LocalLoader from "apps/charts/components/LocalLoader";
import { useLatestBlocks } from "apps/charts/contexts/Application";
import GoogleAnalyticsReporter from "apps/charts/components/analytics/GoogleAnalyticsReporter";
import { PAIR_BLACKLIST, TOKEN_BLACKLIST } from "apps/charts/constants";

const AppWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const ContentWrapper = styled.div<{ open: boolean }>`
  display: grid;
  grid-template-columns: ${({ open }) =>
    open ? "220px 1fr 200px" : "220px 1fr 64px"};

  @media screen and (max-width: 1400px) {
    grid-template-columns: 220px 1fr;
  }

  @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr;
    max-width: 100vw;
    overflow: hidden;
    grid-gap: 0;
  }
`;

const Right = styled.div<{ open: boolean }>`
  position: fixed;
  right: 0;
  bottom: 0rem;
  z-index: 99;
  width: ${({ open }) => (open ? "220px" : "64px")};
  height: ${({ open }) => (open ? "fit-content" : "64px")};
  overflow: auto;
  background-color: ${({ theme }) => theme.bg1};
  @media screen and (max-width: 1400px) {
    display: none;
  }
`;

const Center = styled.div`
  height: 100%;
  z-index: 9999;
  transition: width 0.25s ease;
  background: linear-gradient(180deg, #000817 7.88%, #0d1725 113.25%);
  overflow: hidden;
`;

const WarningWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const WarningBanner = styled.div`
  background-color: #ff6871;
  padding: 1.5rem;
  color: white;
  width: 100%;
  text-align: center;
  font-weight: 500;
`;

/**
 * Wrap the component with the header and sidebar pinned tab
 */

type LayoutWrapperProps = {
  children: ReactNode;
  savedOpen: boolean;
  setSavedOpen: Dispatch<SetStateAction<boolean>>;
};

const LayoutWrapper: FC<LayoutWrapperProps> = ({
  children,
  savedOpen,
  setSavedOpen,
}) => {
  return (
    <>
      <ContentWrapper open={savedOpen}>
        <SideNav />
        <Center id="center">{children}</Center>
        <Right open={savedOpen}>
          <PinnedData open={savedOpen} setSavedOpen={setSavedOpen} />
        </Right>
      </ContentWrapper>
    </>
  );
};

const BLOCK_DIFFERENCE_THRESHOLD = 30;

function App() {
  const [savedOpen, setSavedOpen] = useState(false);
  const globalData = useGlobalData();
  const globalChartData = useGlobalChartData();
  const [latestBlock, headBlock] = useLatestBlocks();

  // show warning

  const showWarning =
    headBlock && latestBlock
      ? // @ts-ignore
        headBlock - latestBlock > BLOCK_DIFFERENCE_THRESHOLD
      : false;

  return (
    <ApolloProvider client={client}>
      <AppWrapper>
        {showWarning && (
          <WarningWrapper>
            <WarningBanner>
              {`Warning: The data on this site has only synced to Ethereum block ${latestBlock} (out of ${headBlock}). Please check back soon.`}
            </WarningBanner>
          </WarningWrapper>
        )}
        {globalData &&
        Object.keys(globalData).length > 0 &&
        globalChartData &&
        Object.keys(globalChartData).length > 0 ? (
          <HashRouter>
            <Route element={<GoogleAnalyticsReporter />} />
            <Switch>
              <Route
                path="/charts/token/:tokenAddress"
                render={({ match }) => {
                  if (
                    isAddress(match.params.tokenAddress.toLowerCase()) &&
                    !Object.keys(TOKEN_BLACKLIST).includes(
                      match.params.tokenAddress.toLowerCase()
                    )
                  ) {
                    return (
                      <LayoutWrapper
                        savedOpen={savedOpen}
                        setSavedOpen={setSavedOpen}
                      >
                        <TokenPage
                          address={match.params.tokenAddress.toLowerCase()}
                        />
                      </LayoutWrapper>
                    );
                  } else {
                    return <Redirect to="/home" />;
                  }
                }}
              />
              <Route
                exacts
                strict
                path="/pair/:pairAddress"
                render={({ match }) => {
                  if (
                    isAddress(match.params.pairAddress.toLowerCase()) &&
                    !Object.keys(PAIR_BLACKLIST).includes(
                      match.params.pairAddress.toLowerCase()
                    )
                  ) {
                    return (
                      <LayoutWrapper
                        savedOpen={savedOpen}
                        setSavedOpen={setSavedOpen}
                      >
                        <PairPage
                          pairAddress={match.params.pairAddress.toLowerCase()}
                        />
                      </LayoutWrapper>
                    );
                  } else {
                    return <Redirect to="/home" />;
                  }
                }}
              />
              <Route
                exacts
                strict
                path="/account/:accountAddress"
                render={({ match }) => {
                  if (isAddress(match.params.accountAddress.toLowerCase())) {
                    return (
                      <LayoutWrapper
                        savedOpen={savedOpen}
                        setSavedOpen={setSavedOpen}
                      >
                        <AccountPage
                          account={match.params.accountAddress.toLowerCase()}
                        />
                      </LayoutWrapper>
                    );
                  } else {
                    return <Redirect to="/home" />;
                  }
                }}
              />

              <Route path="/home">
                <LayoutWrapper
                  savedOpen={savedOpen}
                  setSavedOpen={setSavedOpen}
                >
                  <GlobalPage />
                </LayoutWrapper>
              </Route>

              <Route path="/tokens">
                <LayoutWrapper
                  savedOpen={savedOpen}
                  setSavedOpen={setSavedOpen}
                >
                  <AllTokensPage />
                </LayoutWrapper>
              </Route>

              <Route path="/pairs">
                <LayoutWrapper
                  savedOpen={savedOpen}
                  setSavedOpen={setSavedOpen}
                >
                  <AllPairsPage />
                </LayoutWrapper>
              </Route>

              <Route path="/accounts">
                <LayoutWrapper
                  savedOpen={savedOpen}
                  setSavedOpen={setSavedOpen}
                >
                  <AccountLookup />
                </LayoutWrapper>
              </Route>

              <Redirect to="/home" />
            </Switch>
          </HashRouter>
        ) : (
          <LocalLoader fill="true" />
        )}
      </AppWrapper>
    </ApolloProvider>
  );
}

export default App;
