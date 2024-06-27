import { Dispatch, FC, memo, ReactNode, SetStateAction } from "react";
import { Outlet } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import { dexClient as client } from "apollo/client";
import {
  useGlobalData,
  useGlobalChartData,
} from "apps/charts/contexts/GlobalData";
import PinnedData from "apps/charts/components/PinnedData";
import LocalLoader from "apps/charts/components/LocalLoader";
import { useLatestBlocks } from "apps/charts/contexts/Application";

const AppWrapper = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
`;
const ContentWrapper = styled(Box)<{ open: boolean }>`
  display: grid;
  grid-template-columns: ${({ open }) => (open ? "1fr 200px" : "1fr 64px")};
  @media screen and (max-width: 1400px) {
    grid-template-columns: 1fr;
  }
  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 0 10px;
  }
`;

const Right = styled(Box)<{ open: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  width: ${({ open }) => (open ? "220px" : "64px")};
  height: ${({ open }) => (open ? "fit-content" : "100vh")};
  overflow: auto;
  border-left: 1px solid #253656;
  @media screen and (max-width: 1400px) {
    display: none;
  }
`;

const Center = styled(Box)`
  height: 100%;
  z-index: 1;
  transition: width 0.25s ease;
  overflow: hidden;
`;

const WarningWrapper = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const WarningBanner = styled("span")`
  background-color: #ff6871;
  padding: 1.5rem;
  color: white;
  width: 100%;
  text-align: center;
  font-weight: 500;
`;

/**
 * Wrap the component with the header and sidebar-pinned tab
 */

type LayoutWrapperProps = {
  children: ReactNode;
  savedOpen: boolean;
  setSavedOpen: Dispatch<SetStateAction<boolean>>;
};

export const LayoutWrapper: FC<LayoutWrapperProps> = memo(
  ({ children, savedOpen, setSavedOpen }) => {
    return (
      <ContentWrapper open={savedOpen}>
        <Center id="center">{children}</Center>
        <Right open={savedOpen}>
          <PinnedData open={savedOpen} setSavedOpen={setSavedOpen} />
        </Right>
      </ContentWrapper>
    );
  }
);

const BLOCK_DIFFERENCE_THRESHOLD = 30;

const App = () => {
  const globalData = useGlobalData();
  const globalChartData = useGlobalChartData();
  const [latestBlock, headBlock] = useLatestBlocks();

  const showWarning =
    headBlock && latestBlock
      ? Number(headBlock) - Number(latestBlock) > BLOCK_DIFFERENCE_THRESHOLD
      : false;

  return (
    <ApolloProvider client={client}>
      <AppWrapper>
        {showWarning && (
          <WarningWrapper>
            <WarningBanner>
              {`Warning: The data on this site has only synced to XDC block ${latestBlock} (out of ${headBlock}). Please check back soon.`}
            </WarningBanner>
          </WarningWrapper>
        )}
        {globalData &&
        Object.keys(globalData).length > 0 &&
        globalChartData &&
        Object.keys(globalChartData).length > 0 ? (
          <Outlet />
        ) : (
          <LocalLoader fill="true" />
        )}
      </AppWrapper>
    </ApolloProvider>
  );
};

export default App;
