import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Box, styled } from "@mui/material";
import Polling from "apps/dex/components/Header/Polling";
import Popups from "apps/dex/components/Popups";

const AppWrapper = styled(Box)`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`;

const BodyWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 40px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 2rem 0 0;
  }
`;

const App = () => {
  return (
    <Suspense fallback={null}>
      <AppWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <Outlet />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  );
};

export default App;
