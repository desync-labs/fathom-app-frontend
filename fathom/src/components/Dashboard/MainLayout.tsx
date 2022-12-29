import React from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  Toolbar,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Menu as MenuIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
} from "@mui/icons-material";
import truncateEthAddress from "truncate-eth-address";
import { Navigate, Route, Routes } from "react-router-dom";

import Copyright from "components/Footer/Footer";
import AppBar from "components/AppComponents/AppBar/AppBar";
import DashboardContent from "components/Dashboard/Dashboard";
import StableSwap from "components/Stableswap/StableSwap";

import Web3Status from "components/Web3Status/Web3Status";
import AllProposalsView from "components/Governance/ViewAllProposals";
import ProposalView from "components/Governance/Proposal";
import StakingView from "components/Staking/StakingView";
import AlertMessages from "components/Common/AlertMessages";
import TransactionStatus from "components/Transaction/TransactionStatus";
import { Menu } from "components/Dashboard/Menu";
import { ToggleDrawerButton } from "components/AppComponents/AppButton/AppButton";
import { MainBox } from "components/AppComponents/AppBox/AppBox";
import DaoView from "components/Dashboard/DaoView";
import { drawerWidth } from "components/AppComponents/AppBar/AppBar";

import useMainLayout from "hooks/useMainLayout";
import { StakingProvider } from "context/staking";

import FathomAppLogoSrc from "assets/svg/Fathom-app-logo.svg";
import ExitSrc from "assets/svg/exit.svg";
import MetamaskSrc from "assets/svg/metamask.svg";
import FathomLogoMobileSrc from "assets/svg/Fathom-app-logo-mobile.svg";
import MobileMenuIcon from "assets/svg/mobile-menu.svg";
import MobileMenu from "./MobileMenu";
import { ProposalProvider } from "../../context/proposal";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    background: "#101D32",
    border: "none",
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
  padding: ${({ open }) => (open ? "20px 12px" : "20px 8px")};
  margintop: 1rem;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const mdTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00FFF6",
    },
    secondary: {
      main: "#7D91B5",
    },
    info: {
      main: "#5A81FF",
    },
    success: {
      main: "#3DA329",
    },
    error: {
      main: "#DD3C3C",
    },
  },
  typography: {
    fontFamily: ["Inter, sans-serif"].join(","),
  },
});

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
  width: 100px;
  align-items: center;
  justify-content: space-between;
`;

const MobileMenuWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 5px;
`;

const WalletBox = styled(Box)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
  padding: 0 0 0 10px;
`;

const MainLayout = () => {
  const {
    openMobile,
    account,
    error,
    isMobile,
    isActive,
    open,
    connect,
    isMetamask,
    toggleDrawer,
    mainBlockClickHandler,
    setOpenMobile,
  } = useMainLayout();

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }} onClick={mainBlockClickHandler}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            {isMobile && (
              <MenuLogoWrapper>
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
                <MobileMenuWrapper onClick={() => setOpenMobile(true)}>
                  <img
                    src={MobileMenuIcon}
                    alt={"menu"}
                    width={20}
                    height={20}
                  />
                  Apps
                </MobileMenuWrapper>
              </MenuLogoWrapper>
            )}
            {!isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            ></Typography>

            <Web3Status />

            {isMetamask && <img src={MetamaskSrc} alt={"metamask"} />}
            {account && !error && (
              <WalletBox>{truncateEthAddress(account)}</WalletBox>
            )}

            <IconButton color="inherit" onClick={connect}>
              {isActive ? (
                <img src={ExitSrc} alt={"exit"} />
              ) : (
                <AccountBalanceWalletIcon />
              )}
            </IconButton>
          </Toolbar>
        </AppBar>
        {!isMobile && (
          <Drawer variant="permanent" open={open}>
            <MainToolbar>
              {open && (
                <img
                  src={FathomAppLogoSrc}
                  alt={"logo"}
                  style={{
                    height: "none",
                    maxWidth: "140px",
                  }}
                />
              )}

              <ToggleDrawerButton open={open} onClick={toggleDrawer}>
                {open ? (
                  <ArrowBack sx={{ fontSize: "0.9rem" }} />
                ) : (
                  <ArrowForward sx={{ fontSize: "0.9rem", color: "#fff" }} />
                )}
              </ToggleDrawerButton>
            </MainToolbar>
            <Divider />
            <MenuWrapper open={open}>
              <Menu open={open} />
            </MenuWrapper>
          </Drawer>
        )}
        <MainBox component="main">
          <Toolbar />
          <AlertMessages />
          <TransactionStatus />
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/swap" element={<StableSwap />} />
            <Route
              path="/proposal/:_proposalId"
              element={
                <ProposalProvider>
                  <ProposalView />
                </ProposalProvider>
              }
            />
            <Route path="/dao" element={<DaoView />}>
              <Route path="governance" element={<AllProposalsView />} />
              <Route
                path="staking"
                element={
                  <StakingProvider>
                    <StakingView />
                  </StakingProvider>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Copyright />
        </MainBox>
      </Box>
      {isMobile && openMobile && <MobileMenu setOpenMobile={setOpenMobile} />}
    </ThemeProvider>
  );
};

export default MainLayout;
