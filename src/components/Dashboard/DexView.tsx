import { useLocation } from "react-router-dom";
import { FC, Suspense, useMemo } from "react";
import {
  SwapIcon,
  PoolIcon,
  TransactionsIcon,
} from "components/Common/MenuIcons";
import {
  NestedRouteContainer,
  NestedRouteLink,
  NestedRouteNav,
} from "components/AppComponents/AppBox/AppBox";
import LocalLoader from "apps/charts/components/LocalLoader";

import DexIndexComponent from "apps/dex/index";

const DexView: FC = () => {
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

  const isTransactionsActive = useMemo(() => {
    return location.pathname.includes("/swap/transactions");
  }, [location.pathname]);

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
        {localStorage.getItem("isConnected") && (
          <NestedRouteLink
            span={2}
            className={isTransactionsActive ? "active" : ""}
            to="/swap/transactions"
          >
            <TransactionsIcon isactive={isTransactionsActive ? "active" : ""} />
            Transactions
          </NestedRouteLink>
        )}
      </NestedRouteNav>
      <NestedRouteContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Suspense fallback={<LocalLoader />}>
          <DexIndexComponent />
        </Suspense>
      </NestedRouteContainer>
    </>
  );
};

export default DexView;
