import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { GovernanceIcon, StakingIcon } from "components/Common/MenuIcons";
import {
  NestedRouteContainer,
  NestedRouteLink,
  NestedRouteNav,
} from "components/AppComponents/AppBox/AppBox";
import DexIndexComponent from "apps/dex";

const DexView = () => {
  const location = useLocation();

  const isSwapActive = useMemo(
    () => location.pathname.includes("swap"),
    [location.pathname]
  );

  const isPoolActive = useMemo(
    () => location.pathname.includes("pool"),
    [location.pathname]
  );

  return (
    <>
      <NestedRouteNav>
        <NestedRouteLink className={isSwapActive ? "active" : ""} to="/">
          <StakingIcon isStakingActive={isSwapActive} />
          Swap
        </NestedRouteLink>
        <NestedRouteLink className={isSwapActive ? "active" : ""} to="pool">
          <GovernanceIcon isDAOActive={isPoolActive} />
          Pool
        </NestedRouteLink>
      </NestedRouteNav>
      <NestedRouteContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <DexIndexComponent />
      </NestedRouteContainer>
    </>
  );
};

export default DexView;
