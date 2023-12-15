import { useEffect, useMemo } from "react";
import "feather-icons";

import TopTokenList from "apps/charts/components/TokenList";
import { TYPE } from "apps/charts/Theme";
import { useAllTokenData } from "apps/charts/contexts/TokenData";
import { PageWrapper, FullWrapper } from "apps/charts/components";
import { RowBetween } from "apps/charts/components/Row";
import Search from "apps/charts/components/Search";
import { useMedia } from "react-use";
import { TOKEN_BLACKLIST } from "apps/charts/constants";

import styled from "styled-components";

const NoTopTokens = styled.div`
  background: #131f35;
  border-radius: 8px;
  padding: 0px 1.125rem 1rem;
  color: #5977a0;
  text-transform: uppercase;
  font-size: 11px;
`;

function AllTokensPage() {
  const allTokens = useAllTokenData();

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const below600 = useMedia("(max-width: 800px)");

  // const [useTracked, setUseTracked] = useState(true)

  return (
    <PageWrapper>
      <FullWrapper>
        <RowBetween>
          <TYPE.largeHeader>Top Tokens</TYPE.largeHeader>
          {!below600 && <Search small={true} />}
        </RowBetween>
        {formattedTokens && formattedTokens.length ? (
          <TopTokenList formattedTokens={formattedTokens} itemMax={50} />
        ) : (
          <NoTopTokens>No Top tokens</NoTopTokens>
        )}
      </FullWrapper>
    </PageWrapper>
  );
}

export default AllTokensPage;
