import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import Header from "apps/dex/components/Header";
import Polling from "apps/dex/components/Header/Polling";
import Popups from "apps/dex/components/Popups";
import ReactGA from "react-ga";

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`;

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
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
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`;

const Marginer = styled.div`
  margin-top: 5rem;
`;

export default function App() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    ReactGA.pageview(`${pathname}${search}`);
  }, [pathname, search]);

  return (
    <Suspense fallback={null}>
      <AppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <Outlet />
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  );
}
