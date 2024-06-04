import { useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";

import { TYPE } from "apps/charts/Theme";
import { PageWrapper, FullWrapper } from "apps/charts/components";
import LPList from "apps/charts/components/LPList";
import AccountSearch from "apps/charts/components/AccountSearch";
import { useTopLps } from "apps/charts/contexts/GlobalData";
import LocalLoader from "apps/charts/components/LocalLoader";
import { RowBetween } from "apps/charts/components/Row";
import Search from "apps/charts/components/Search";

const AccountLookup = () => {
  // scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const topLps = useTopLps();

  const below600 = useMediaQuery("(max-width: 600px)");

  return (
    <PageWrapper>
      <FullWrapper>
        <RowBetween>
          <TYPE.largeHeader>Wallet analytics</TYPE.largeHeader>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <Box>
          <AccountSearch />
        </Box>
        {topLps && topLps.length > 0 ? (
          <>
            <TYPE.main fontSize={"1.125rem"} style={{ marginTop: "2rem" }}>
              Top Liquidity Positions
            </TYPE.main>
            <LPList lps={topLps} maxItems={200} />
          </>
        ) : (
          <LocalLoader />
        )}
      </FullWrapper>
    </PageWrapper>
  );
};

export default AccountLookup;
