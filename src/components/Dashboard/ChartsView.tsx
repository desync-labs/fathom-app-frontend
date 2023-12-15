import { useLocation } from "react-router-dom";
import { FC, useMemo } from "react";
import { GovernanceIcon, StakingIcon } from "components/Common/MenuIcons";
import {
  NestedRouteContainer,
  NestedRouteLink,
  NestedRouteNav,
} from "components/AppComponents/AppBox/AppBox";
import ChartsIndexComponent from "apps/charts";

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
          <StakingIcon isStakingActive={isOverviewActive} />
          Overview
        </NestedRouteLink>
        <NestedRouteLink
          className={isTokenActive ? "active" : ""}
          to="/charts/tokens"
        >
          <GovernanceIcon isDAOActive={isTokenActive} />
          Tokens
        </NestedRouteLink>
        <NestedRouteLink
          className={isPairActive ? "active" : ""}
          to="/charts/pairs"
        >
          <GovernanceIcon isDAOActive={isPairActive} />
          Pairs
        </NestedRouteLink>
        <NestedRouteLink
          className={isAccountActive ? "active" : ""}
          to="/charts/accounts"
        >
          <GovernanceIcon isDAOActive={isAccountActive} />
          Accounts
        </NestedRouteLink>
      </NestedRouteNav>
      <NestedRouteContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <ChartsIndexComponent />
      </NestedRouteContainer>
    </>
  );
};

export default ChartsView;
