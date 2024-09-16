import { Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { styled } from "@mui/material/styles";
import { GovernanceIcon, StakingIcon } from "components/Common/MenuIcons";
import {
  NestedRouteLink,
  NestedRouteNav,
} from "components/AppComponents/AppBox/AppBox";

const DAONestedRouteContainer = styled("div")`
  width: 100%;
  margin: 0;
  padding: 0;
`;

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
      <DAONestedRouteContainer>
        <Outlet />
      </DAONestedRouteContainer>
    </>
  );
};

export default DaoView;
