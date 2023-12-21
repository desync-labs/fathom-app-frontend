import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import Polling from "apps/dex/components/Header/Polling";
import Popups from "apps/dex/components/Popups";
import ReactGA from "react-ga";

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px 0;
    padding-top: 2rem;
  `};
`;

const Marginer = styled.div`
  margin-top: 5rem;
`;

const App = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    ReactGA.pageview(`${pathname}${search}`);
  }, [pathname, search]);

  return (
    <Suspense fallback={null}>
      <AppWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <Outlet />
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  );
};

export default App;
