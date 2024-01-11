import { useLocation } from "react-router-dom";
import { FC, MouseEvent, useMemo } from "react";
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
import useConnector from "context/connector";

import LendingIndexComponent from "apps/lending";

export type LendingViewProps = {
  openConnectorMenu: (event: MouseEvent<HTMLElement>) => void;
};

const LendingView: FC<LendingViewProps> = ({ openConnectorMenu }) => {
  const location = useLocation();
  const { account } = useConnector();

  const isLendingActive = useMemo(
    () => ["/lending"].includes(location.pathname),
    [location.pathname]
  );

  const isMarketsActive = useMemo(
    () => location.pathname.includes("/lending/markets"),
    [location.pathname]
  );

  const isTransactionsActive = useMemo(() => {
    return location.pathname.includes("/lending/transactions");
  }, [location.pathname]);

  return (
    <>
      <NestedRouteNav>
        <NestedRouteLink
          className={isLendingActive ? "active" : ""}
          to="/lending"
        >
          <SwapIcon isactive={isLendingActive ? "true" : ""} />
          Dashboard
        </NestedRouteLink>
        <NestedRouteLink
          className={isMarketsActive ? "active" : ""}
          to="/lending/markets"
        >
          <PoolIcon isactive={isMarketsActive ? "active" : ""} />
          Markets
        </NestedRouteLink>
        {account && (
          <NestedRouteLink
            span={2}
            className={isTransactionsActive ? "active" : ""}
            to="/lending/transactions"
          >
            <TransactionsIcon isactive={isTransactionsActive ? "active" : ""} />
            Transactions
          </NestedRouteLink>
        )}
      </NestedRouteNav>
      <NestedRouteContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LendingIndexComponent openConnectorMenu={openConnectorMenu} />
      </NestedRouteContainer>
    </>
  );
};

export default LendingView;
