import { useLocation } from "react-router-dom";
import { FC, useMemo } from "react";
import {
  DashboardIcon,
  MarketsIcon,
  TransactionsIcon,
} from "components/Common/MenuIcons";
import {
  NestedRouteLink,
  NestedRouteNav,
} from "components/AppComponents/AppBox/AppBox";
import useConnector from "context/connector";

import LendingIndexComponent from "apps/lending";
import { styled } from "@mui/material/styles";

const LendingNestedRouteContainer = styled("div")`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const LendingView: FC = () => {
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
          <DashboardIcon isactive={isLendingActive ? "true" : ""} />
          Dashboard
        </NestedRouteLink>
        <NestedRouteLink
          className={isMarketsActive ? "active" : ""}
          to="/lending/markets"
        >
          <MarketsIcon isactive={isMarketsActive ? "active" : ""} />
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
      <LendingNestedRouteContainer>
        <LendingIndexComponent />
      </LendingNestedRouteContainer>
    </>
  );
};

export default LendingView;
