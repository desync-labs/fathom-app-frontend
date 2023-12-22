import { Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { GovernanceIcon, StakingIcon } from "components/Common/MenuIcons";
import {
  NestedRouteContainer,
  NestedRouteLink,
  NestedRouteNav,
} from "components/AppComponents/AppBox/AppBox";

const DaoView = () => {
  const location = useLocation();

  const isStakingActive = useMemo(
    () => location.pathname.includes("staking"),
    [location.pathname]
  );

  const isGovernmentActive = useMemo(
    () => location.pathname.includes("governance"),
    [location.pathname]
  );

  return (
    <>
      <NestedRouteNav>
        <NestedRouteLink
          className={isStakingActive ? "active" : ""}
          to="staking"
        >
          <StakingIcon isactive={isStakingActive ? "true" : ""} />
          Staking
        </NestedRouteLink>
        <NestedRouteLink
          className={isGovernmentActive ? "active" : ""}
          to="governance"
        >
          <GovernanceIcon isactive={isGovernmentActive ? "true" : ""} />
          Governance
        </NestedRouteLink>
      </NestedRouteNav>
      <NestedRouteContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </NestedRouteContainer>
    </>
  );
};

export default DaoView;
