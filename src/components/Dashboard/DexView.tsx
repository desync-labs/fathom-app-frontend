import { useLocation } from "react-router-dom";
import { FC, lazy, MouseEvent, Suspense, useMemo } from "react";
import { SwapIcon, PoolIcon } from "components/Common/MenuIcons";
import {
  NestedRouteContainer,
  NestedRouteLink,
  NestedRouteNav,
} from "components/AppComponents/AppBox/AppBox";
import LocalLoader from "apps/charts/components/LocalLoader";

const DexIndexComponent = lazy(() => import("../../apps/dex/index"));

export type DexViewProps = {
  openConnectorMenu: (event: MouseEvent<HTMLElement>) => void;
};

const DexView: FC<DexViewProps> = ({ openConnectorMenu }) => {
  const location = useLocation();

  const isSwapActive = useMemo(
    () => ["/swap"].includes(location.pathname),
    [location.pathname]
  );

  const isPoolActive = useMemo(
    () =>
      location.pathname.includes("/swap/pool") ||
      location.pathname.includes("/swap/create") ||
      location.pathname.includes("/swap/add") ||
      location.pathname.includes("/swap/find") ||
      location.pathname.includes("/swap/remove"),
    [location.pathname]
  );

  return (
    <>
      <NestedRouteNav>
        <NestedRouteLink className={isSwapActive ? "active" : ""} to="/swap">
          <SwapIcon isactive={isSwapActive ? "true" : ""} />
          Swap
        </NestedRouteLink>
        <NestedRouteLink
          className={isPoolActive ? "active" : ""}
          to="/swap/pool"
        >
          <PoolIcon isactive={isPoolActive ? "active" : ""} />
          Pool
        </NestedRouteLink>
      </NestedRouteNav>
      <NestedRouteContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Suspense fallback={<LocalLoader />}>
          <DexIndexComponent openConnectorMenu={openConnectorMenu} />
        </Suspense>
      </NestedRouteContainer>
    </>
  );
};

export default DexView;
