import { useLocation } from "react-router-dom";
import { FC, Suspense, useMemo } from "react";
import { styled } from "@mui/material/styles";
import {
  DashboardIcon,
  TokensIcon,
  PairsIcon,
  AccountsIcon,
} from "components/Common/MenuIcons";
import {
  NestedRouteLink,
  NestedRouteNav,
} from "components/AppComponents/AppBox/AppBox";
import LocalLoader from "apps/charts/components/LocalLoader";
import App from "apps/charts/App";

const ChartsNestedRouteContainer = styled("div")`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const ChartsView: FC = () => {
  const location = useLocation();

  const isOverviewActive = useMemo(
    () => location.pathname === "/charts",
    [location.pathname]
  );

  const isTokenActive = useMemo(
    () =>
      location.pathname.includes("/charts/tokens") ||
      location.pathname.includes("/charts/token"),
    [location.pathname]
  );

  const isPairActive = useMemo(
    () =>
      location.pathname.includes("/charts/pairs") ||
      location.pathname.includes("/charts/pair"),
    [location.pathname]
  );

  const isAccountActive = useMemo(() => {
    return (
      location.pathname.includes("/charts/accounts") ||
      location.pathname.includes("/charts/account")
    );
  }, [location.pathname]);

  return (
    <>
      <NestedRouteNav>
        <NestedRouteLink
          className={isOverviewActive ? "active" : ""}
          to="/charts"
        >
          <DashboardIcon isactive={isOverviewActive ? "true" : ""} />
          Overview
        </NestedRouteLink>
        <NestedRouteLink
          className={isTokenActive ? "active" : ""}
          to="/charts/tokens"
        >
          <TokensIcon isactive={isTokenActive ? "active" : ""} />
          Tokens
        </NestedRouteLink>
        <NestedRouteLink
          className={isPairActive ? "active" : ""}
          to="/charts/pairs"
        >
          <PairsIcon isactive={isPairActive ? "active" : ""} />
          Pairs
        </NestedRouteLink>
        <NestedRouteLink
          className={isAccountActive ? "active" : ""}
          to="/charts/accounts"
        >
          <AccountsIcon isactive={isAccountActive ? "active" : ""} />
          Accounts
        </NestedRouteLink>
      </NestedRouteNav>
      <ChartsNestedRouteContainer>
        <Suspense fallback={<LocalLoader />}>
          <App />
        </Suspense>
      </ChartsNestedRouteContainer>
    </>
  );
};

export default ChartsView;
