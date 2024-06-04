import { FC, useEffect, useMemo } from "react";
import { Box, styled, useMediaQuery } from "@mui/material";

import TopTokenList from "apps/charts/components/TokenList";
import { TYPE } from "apps/charts/Theme";
import { useAllTokenData } from "apps/charts/contexts/TokenData";
import { PageWrapper, FullWrapper } from "apps/charts/components";
import { RowBetween } from "apps/charts/components/Row";
import Search from "apps/charts/components/Search";
import { TOKEN_BLACKLIST } from "apps/charts/constants";

const NoTopTokens = styled(Box)`
  background: #131f35;
  border-radius: 8px;
  padding: 0.5rem 1.125rem;
  color: #5977a0;
  text-transform: uppercase;
  font-size: 11px;
`;

const AllTokensPage: FC = () => {
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

  const below600 = useMediaQuery("(max-width: 800px)");

  // const [useTracked, setUseTracked] = useState(true)

  return (
    <PageWrapper minHeight={"70vh"}>
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
};

export default AllTokensPage;
