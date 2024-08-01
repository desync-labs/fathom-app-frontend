import { styled } from "@mui/material/styles";
import {
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  Toolbar,
  Divider,
  IconButton,
} from "@mui/material";
import {
  ArrowForward,
  AccountBalanceWallet as AccountBalanceWalletIcon,
} from "@mui/icons-material";
import truncateEthAddress from "truncate-eth-address";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { AppGlobalStyles } from "components/AppComponents/AppGlobalStyles/AppGlobalStyles";
import Copyright from "components/Footer/Footer";
import AppBar from "components/AppComponents/AppBar/AppBar";
import DashboardContent from "components/Dashboard/Dashboard";

import StableSwap from "components/Stableswap/StableSwap";
import StableSwapAddLiquidity from "components/Stableswap/StableSwapAddLiquidity";
import StableSwapRemoveLiquidity from "components/Stableswap/StableSwapRemoveLiquidity";
import StableSwapManageFees from "components/Stableswap/StableSwapManageFees";

import VaultsView from "components/Vaults/VaultsView";
import Web3Status from "components/Web3Status/Web3Status";

import AllProposalsView from "components/Governance/ViewAllProposals";
import ProposalView from "components/Governance/Proposal";

import StakingView from "components/Staking/StakingView";
import AlertMessages from "components/Common/AlertMessages";
import TransactionStatus from "components/Transaction/TransactionStatus";

import DaoView from "components/Dashboard/DaoView";
import DexView from "components/Dashboard/DexView";
import LendingView from "components/Dashboard/LendingView";
import FXDView from "components/Dashboard/FxdView";

import { Menu } from "components/Dashboard/Menu";
import { ToggleDrawerButton } from "components/AppComponents/AppButton/AppButton";
import { MainBox } from "components/AppComponents/AppBox/AppBox";
import MobileConnector from "components/Dashboard/MobileConnector";
import DesktopConnector from "components/Dashboard/DesktopConnector";
import BottomLinks from "components/Dashboard/BottomLinks";
import MobileMenu from "components/Dashboard/MobileMenu";

import { drawerWidth } from "components/AppComponents/AppBar/AppBar";
import TransactionErc20TokenModal from "components/Transaction/TransactionErc20TokenModal";
import FthmInfoModal from "components/FthmInfo/FthmInfoModal";

/**
 * DEX
 */
import Swap from "apps/dex/pages/Swap";
import {
  RedirectPathToSwapOnly,
  RedirectToSwap,
} from "apps/dex/pages/Swap/redirects";
import PoolFinder from "apps/dex/pages/PoolFinder";
import Pool from "apps/dex/pages/Pool";
import {
  RedirectOldAddLiquidityPathStructure,
  RedirectDuplicateTokenIds,
} from "apps/dex/pages/AddLiquidity/redirects";
import AddLiquidity from "apps/dex/pages/AddLiquidity";
import { RedirectOldRemoveLiquidityPathStructure } from "apps/dex/pages/RemoveLiquidity/redirects";
import RemoveLiquidity from "apps/dex/pages/RemoveLiquidity";
import FathomBalanceContent from "apps/dex/components/Header/FathomBalanceContent";
import { TYPE } from "apps/dex/theme";
import { CountUp } from "use-count-up";
import { CardNoise } from "apps/dex/components/earn/styled";

/**
 * Lending
 */

import Home from "apps/lending/pages/index.page";
import Markets from "apps/lending/pages/markets.page";
import History from "apps/lending/pages/history.page";
import ReserveOverview from "apps/lending/pages/reserve-overview.page";
import Faucet from "apps/lending/pages/faucet.page";

import useMainLayout from "hooks/General/useMainLayout";
import { StakingProvider } from "context/staking";
import { ProposalProvider } from "context/proposal";
import useConnector from "context/connector";
import useAlertAndTransactionContext from "context/alertAndTransaction";

import ChartsView from "components/Dashboard/ChartsView";

import FathomAppLogoSrc from "assets/svg/Fathom-app-logo.svg";
import ExitSrc from "assets/svg/exit.svg";
import MetamaskSrc from "assets/svg/metamask.svg";
import WalletConnectSrc from "assets/svg/wallet-connect.svg";
import FathomLogoMobileSrc from "assets/svg/Fathom-app-logo-mobile.svg";
import MobileMenuIcon from "assets/svg/mobile-menu.svg";
import MobileMenuIconActive from "assets/svg/mobile-menu-active.svg";
import { formatNumber } from "utils/format";

import GlobalPage from "apps/charts/pages/GlobalPage";
import { TokenPageRouterComponent } from "apps/charts/pages/TokenPage";
import { PairPageRouterComponent } from "apps/charts/pages/PairPage";
import { AccountPageRouterComponent } from "apps/charts/pages/AccountPage";
import AllTokensPage from "apps/charts/pages/AllTokensPage";
import AllPairsPage from "apps/charts/pages/AllPairsPage";
import AccountLookup from "apps/charts/pages/AccountLookup";
import { LayoutWrapper } from "apps/charts/App";
import {
  useGlobalChartData,
  useGlobalData,
} from "apps/charts/contexts/GlobalData";
import Transactions from "apps/dex/pages/Transactions";
import { memo, useEffect } from "react";
import ReactGA from "react-ga4";
import VaultListView from "components/Vaults/VaultList/VaultListView";
import VaultTutorial from "components/Vaults/VaultTutorial/VaultTutorial";
import VaultDetailView from "components/Vaults/VaultDetail/VaultDetailView";

import PositionsTransactionList from "components/PositionActivityList/PositionActivityList";
import {
  ChainId,
  DISPLAY_CHARTS,
  DISPLAY_DEX,
  DISPLAY_FXD,
  DISPLAY_GOVERNANCE,
  DISPLAY_LENDING,
  DISPLAY_STABLE_SWAP,
  DISPLAY_VAULTS,
  NETWORK_SETTINGS,
} from "connectors/networks";
import { DEFAULT_CHAIN_ID } from "utils/Constants";
import CookieConsent from "components/Common/CookieConsent";
import MaintenanceModeBanner from "components/Common/MaintenanceBanner";
import { FxdProvider } from "context/fxd";
import useVH from "hooks/General/useVH";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "sticky",
    height: "100vh",
    whiteSpace: "nowrap",
    background: "#132340",
    border: "none",
    borderRadius: 0,
    overflowY: "visible",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "visible",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const MenuWrapper = styled("nav")<{ open: boolean }>`
  padding: ${({ open }) => (open ? "24px 12px" : "20px 8px")};
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-right: 1px solid #2c4066;
`;

const AccountInfoWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
`;

export const AccountElement = styled("div")<{ active: string }>`
  display: flex;
  flex-direction: row;
  align-items: end;
  background-color: #131f35;
  border-radius: 12px;
  white-space: nowrap;
  cursor: pointer;
  color: #fff;
  margin-left: 10px;

  :focus {
    border: 1px solid blue;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: none;
  }
`;

export const FTHMAmount = styled(AccountElement)`
  color: white;
  font-size: 1rem;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  font-weight: 500;
  background-color: #131f35;
`;

export const FTHMWrapper = styled("span")`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`;

const MainToolbar = styled(Toolbar)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 1px;
  background: linear-gradient(180deg, #071126 0%, #050c1a 100%);

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    width: 100px;
    margin-left: 14px;
  }
`;

const MenuLogoWrapper = styled(Box)`
  display: flex;
  width: 105px;
  align-items: center;
  justify-content: space-between;
`;

const MobileMenuWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 7px;
  font-size: 1rem;
`;

const WalletBox = styled(Box)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
  padding: 0 0 0 10px;
`;

const LogoLink = styled(Link)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const MainLayout = () => {
  const {
    savedOpen,
    setSavedOpen,
    scroll,
    disconnect,
    openMobile,
    account,
    error,
    isMobile,
    isActive,
    open,
    isMetamask,
    isWalletConnect,
    toggleDrawer,
    mainBlockClickHandler,
    openMobileMenu,
    drawerRef,
    showToggleDrawerBtn,
    setOpenMobile,
    userBalance,
    showFthmBalanceModal,
    setShowFthmBalanceModal,
    aggregateBalance,
    countUpValue,
    countUpValuePrevious,
  } = useMainLayout();

  const {
    chainId,
    allowStableSwap,
    allowStableSwapInProgress,
    isUserWrapperWhiteListed,
    openConnector,
    setOpenConnector,
    openConnectorMenu,
  } = useConnector();

  /**
   * Load charts data.
   */
  useGlobalData();
  useGlobalChartData();

  useVH();

  /**
   * Google Analytics
   */
  const { pathname, search } = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: `${pathname}${search}` });
  }, [pathname, search]);

  const { erc20TokenModalData } = useAlertAndTransactionContext();
  const isConnected = localStorage.getItem("isConnected");

  return (
    <AppGlobalStyles>
      <Box sx={{ display: "flex" }} onClick={mainBlockClickHandler}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              width: "100%",
              justifyContent: isMobile ? "space-between" : "flex-end",
            }}
          >
            {isMobile && (
              <MenuLogoWrapper>
                <LogoLink to={"/"}>
                  <img
                    src={FathomLogoMobileSrc}
                    alt={"logo"}
                    style={{
                      width: "24px",
                      background: "#80FFF6",
                      height: "24px",
                      borderRadius: "6px",
                      padding: "4px",
                    }}
                  />
                </LogoLink>

                <MobileMenuWrapper
                  onClick={openMobile ? mainBlockClickHandler : openMobileMenu}
                >
                  <img
                    style={{ display: openMobile ? "none" : "block" }}
                    src={MobileMenuIcon}
                    alt={"menu"}
                    width={20}
                    height={20}
                  />
                  <img
                    style={{ display: openMobile ? "block" : "none" }}
                    src={MobileMenuIconActive}
                    alt={"menu"}
                    width={20}
                    height={20}
                  />
                  Apps
                </MobileMenuWrapper>
              </MenuLogoWrapper>
            )}

            <AccountInfoWrapper>
              <Web3Status />

              {isMetamask && <img src={MetamaskSrc} alt={"metamask"} />}
              {isWalletConnect && (
                <img src={WalletConnectSrc} alt={"wallet-connect"} />
              )}
              {(!chainId || DISPLAY_GOVERNANCE.includes(chainId)) &&
                aggregateBalance && (
                  <FTHMWrapper onClick={() => setShowFthmBalanceModal(true)}>
                    <FTHMAmount
                      active={account ? "true" : "false"}
                      style={{ pointerEvents: "auto" }}
                    >
                      {account && (
                        <TYPE.white
                          style={{
                            fontSize: "inherit",
                            paddingRight: ".4rem",
                          }}
                        >
                          <CountUp
                            key={countUpValue}
                            isCounting
                            start={parseFloat(countUpValuePrevious)}
                            end={parseFloat(countUpValue)}
                            thousandsSeparator={","}
                            duration={1}
                          />
                        </TYPE.white>
                      )}
                      FTHM
                    </FTHMAmount>
                    <CardNoise />
                  </FTHMWrapper>
                )}
              <AccountElement
                active={account ? "true" : "false"}
                style={{ pointerEvents: "auto" }}
              >
                {account && userBalance ? (
                  <Box
                    fontSize={"1rem"}
                    sx={{ flexShrink: 0 }}
                    p="0.5rem 0.5rem 0.5rem 0.5rem"
                    fontWeight={500}
                  >
                    {formatNumber(Number(userBalance))}{" "}
                    {NETWORK_SETTINGS[chainId as ChainId]?.nativeCurrency
                      ?.symbol ||
                      NETWORK_SETTINGS[DEFAULT_CHAIN_ID]?.nativeCurrency
                        ?.symbol}
                  </Box>
                ) : null}
              </AccountElement>
              {account && !error && (
                <WalletBox>{truncateEthAddress(account)}</WalletBox>
              )}

              <IconButton
                color="inherit"
                onClick={isActive || error ? disconnect : openConnectorMenu}
              >
                {isActive ? (
                  <img src={ExitSrc} alt={"exit"} />
                ) : (
                  <AccountBalanceWalletIcon />
                )}
              </IconButton>
            </AccountInfoWrapper>
          </Toolbar>
        </AppBar>
        {!isMobile && (
          <Drawer variant="permanent" open={open} ref={drawerRef}>
            <MainToolbar>
              {open && (
                <LogoLink to={"/"}>
                  <img
                    src={FathomAppLogoSrc}
                    alt={"logo"}
                    style={{
                      height: "none",
                      maxWidth: "140px",
                    }}
                  />
                </LogoLink>
              )}
              {showToggleDrawerBtn && (
                <ToggleDrawerButton open={open} onClick={toggleDrawer}>
                  <ArrowForward sx={{ fontSize: "0.9rem" }} />
                </ToggleDrawerButton>
              )}
            </MainToolbar>
            <Divider />
            <MenuWrapper open={open}>
              <Menu open={open} />
              {!isMobile && open && <BottomLinks />}
            </MenuWrapper>
          </Drawer>
        )}
        <MainBox component="main">
          <Box>
            <Toolbar />
            <AlertMessages scroll={scroll} />
            <TransactionStatus scroll={scroll} />
            <FxdProvider>
              <Routes>
                {!chainId || DISPLAY_FXD.includes(chainId) ? (
                  <Route path="/fxd" element={<FXDView />}>
                    <>
                      <Route path="/fxd" element={<DashboardContent />} />
                      {process.env.REACT_APP_FXD_TRANSACTIONS_ENABLED ===
                        "true" &&
                        (account || isConnected) && (
                          <Route
                            path="/fxd/transactions"
                            element={<PositionsTransactionList />}
                          />
                        )}
                      <Route
                        path="*"
                        element={<Navigate to="/fxd" replace />}
                      />
                    </>
                  </Route>
                ) : null}
                {!chainId || DISPLAY_STABLE_SWAP.includes(chainId) ? (
                  <>
                    {allowStableSwap ||
                    isUserWrapperWhiteListed ||
                    allowStableSwapInProgress ? (
                      <Route path="/stable-swap" element={<StableSwap />} />
                    ) : null}
                    {isUserWrapperWhiteListed ? (
                      <>
                        <Route
                          path="/stable-swap/add-liquidity"
                          element={<StableSwapAddLiquidity />}
                        />
                        <Route
                          path="/stable-swap/remove-liquidity"
                          element={<StableSwapRemoveLiquidity />}
                        />
                        <Route
                          path="/stable-swap/manage-fees"
                          element={<StableSwapManageFees />}
                        />
                      </>
                    ) : null}
                  </>
                ) : null}
                {!chainId || DISPLAY_GOVERNANCE.includes(chainId) ? (
                  <Route path="/dao" element={<DaoView />}>
                    <Route
                      index
                      element={
                        <StakingProvider>
                          <StakingView />
                        </StakingProvider>
                      }
                    />
                    <Route
                      path="staking"
                      index
                      element={
                        <StakingProvider>
                          <StakingView />
                        </StakingProvider>
                      }
                    />
                    <Route
                      path="governance"
                      element={<AllProposalsView />}
                    ></Route>
                    <Route
                      path="governance/proposal/:_proposalId"
                      element={
                        <ProposalProvider>
                          <ProposalView />
                        </ProposalProvider>
                      }
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/dao/staking" replace />}
                    />
                  </Route>
                ) : null}
                {!chainId || DISPLAY_DEX.includes(chainId) ? (
                  <Route path="/swap" element={<DexView />}>
                    <Route index element={<Swap />} />
                    <Route
                      path=":outputCurrency"
                      element={<RedirectToSwap />}
                    />
                    <Route path="send" element={<RedirectPathToSwapOnly />} />
                    <Route path="find" element={<PoolFinder />} />
                    <Route path="pool" element={<Pool />} />
                    <Route path="add" element={<AddLiquidity />} />
                    <Route
                      path="add/:currencyIdA"
                      element={<RedirectOldAddLiquidityPathStructure />}
                    />
                    <Route
                      path="add/:currencyIdA/:currencyIdB"
                      element={<RedirectDuplicateTokenIds />}
                    />
                    <Route path="create" element={<AddLiquidity />} />
                    <Route
                      path="create/:currencyIdA"
                      element={<RedirectOldAddLiquidityPathStructure />}
                    />
                    <Route
                      path="create/:currencyIdA/:currencyIdB"
                      element={<RedirectDuplicateTokenIds />}
                    />
                    <Route
                      path="remove/:tokens"
                      element={<RedirectOldRemoveLiquidityPathStructure />}
                    />
                    <Route
                      path="remove/:currencyIdA/:currencyIdB"
                      element={<RemoveLiquidity />}
                    />
                    {localStorage.getItem("isConnected") && (
                      <Route path="transactions" element={<Transactions />} />
                    )}
                    <Route element={<RedirectPathToSwapOnly />} />
                  </Route>
                ) : null}
                {!chainId || DISPLAY_LENDING.includes(chainId) ? (
                  <Route path="/lending" element={<LendingView />}>
                    <Route index element={<Home />} />
                    <Route path="markets" element={<Markets />} />
                    <Route
                      path="reserve-overview"
                      element={<ReserveOverview />}
                    />
                    <Route path="transactions" element={<History />} />
                    <Route path="faucet" element={<Faucet />} />
                    <Route
                      path="*"
                      element={<Navigate to="/lending" replace />}
                    />
                  </Route>
                ) : null}
                {!chainId || DISPLAY_VAULTS.includes(chainId) ? (
                  <Route path="/vaults" element={<VaultsView />}>
                    <Route index element={<VaultListView />} />
                    <Route path="tutorial" index element={<VaultTutorial />} />
                    <Route
                      path=":vaultAddress/*"
                      element={<VaultDetailView />}
                    />
                  </Route>
                ) : null}
                {!chainId || DISPLAY_CHARTS.includes(chainId) ? (
                  <Route path="/charts" element={<ChartsView />}>
                    <Route
                      index
                      element={
                        <LayoutWrapper
                          savedOpen={savedOpen}
                          setSavedOpen={setSavedOpen}
                        >
                          <GlobalPage />
                        </LayoutWrapper>
                      }
                    ></Route>

                    <Route
                      path="token/:tokenAddress"
                      element={
                        <TokenPageRouterComponent
                          savedOpen={savedOpen}
                          setSavedOpen={setSavedOpen}
                        />
                      }
                    />
                    <Route
                      path="pair/:pairAddress"
                      element={
                        <PairPageRouterComponent
                          savedOpen={savedOpen}
                          setSavedOpen={setSavedOpen}
                        />
                      }
                    />
                    <Route
                      path="account/:accountAddress"
                      element={
                        <AccountPageRouterComponent
                          savedOpen={savedOpen}
                          setSavedOpen={setSavedOpen}
                        />
                      }
                    />

                    <Route
                      path="tokens"
                      element={
                        <LayoutWrapper
                          savedOpen={savedOpen}
                          setSavedOpen={setSavedOpen}
                        >
                          <AllTokensPage />
                        </LayoutWrapper>
                      }
                    ></Route>

                    <Route
                      path="pairs"
                      element={
                        <LayoutWrapper
                          savedOpen={savedOpen}
                          setSavedOpen={setSavedOpen}
                        >
                          <AllPairsPage />
                        </LayoutWrapper>
                      }
                    ></Route>

                    <Route
                      path="accounts"
                      element={
                        <LayoutWrapper
                          savedOpen={savedOpen}
                          setSavedOpen={setSavedOpen}
                        >
                          <AccountLookup />
                        </LayoutWrapper>
                      }
                    ></Route>
                  </Route>
                ) : null}
                <Route path="*" element={<Navigate to="/fxd" replace />} />
              </Routes>
            </FxdProvider>
          </Box>
          <Copyright />
        </MainBox>
      </Box>
      {isMobile && openMobile && <MobileMenu setOpenMobile={setOpenMobile} />}
      {isMobile && openConnector && (
        <MobileConnector setOpenMobileConnector={setOpenConnector} />
      )}
      {!isMobile && openConnector && (
        <DesktopConnector onClose={() => setOpenConnector(false)} />
      )}
      {!chainId || [ChainId.AXDC, ChainId.XDC].includes(chainId) ? (
        <FthmInfoModal
          onClose={() => setShowFthmBalanceModal(false)}
          open={showFthmBalanceModal}
        >
          <FathomBalanceContent
            setShowFthmBalanceModal={setShowFthmBalanceModal}
          />
        </FthmInfoModal>
      ) : null}

      {erc20TokenModalData && <TransactionErc20TokenModal />}
      <CookieConsent />
      {process.env.REACT_APP_MAINTENANCE_MODE === "true" && (
        <MaintenanceModeBanner />
      )}
    </AppGlobalStyles>
  );
};

export default memo(MainLayout);
