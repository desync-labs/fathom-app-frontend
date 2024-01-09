import { useLocation } from "react-router-dom";
import { FC, MouseEvent, Suspense, useMemo } from "react";
import loadable from "@loadable/component";
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
import useConnector from "context/connector";

const DexIndexComponent = loadable(() => import("../../apps/dex/index"));

export type DexViewProps = {
  openConnectorMenu: (event: MouseEvent<HTMLElement>) => void;
};

const DexView: FC<DexViewProps> = ({ openConnectorMenu }) => {
  const location = useLocation();
  const { account } = useConnector();

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
        {account && (
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
          <DexIndexComponent openConnectorMenu={openConnectorMenu} />
        </Suspense>
      </NestedRouteContainer>
    </>
  );
};

export default DexView;
