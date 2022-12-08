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
import Copyright from "components/Footer/Footer";
import AppBar from "components/AppComponents/AppBar/AppBar";
import { observer } from "mobx-react";
import DashboardContent from "components/Dashboard/Dashboard";
import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import StableSwap from "components/Stableswap/StableSwap";

import FathomAppLogoSrc from "assets/svg/Fathom-app-logo.svg";
import ExitSrc from "assets/svg/exit.svg";
import MetamaskSrc from "assets/svg/metamask.svg";

import { Web3Status } from "components/Web3Status/Web3Status";
import AllProposalsView from "components/Governance/ViewAllProposals";
import ProposalView from "components/Governance/Proposal";
import StakingView from "components/Staking/StakingView";
import AlertMessages from "components/Common/AlertMessages";
import TransactionStatus from "components/Transaction/TransactionStatus";
import truncateEthAddress from "truncate-eth-address";
import { Menu } from "components/Dashboard/Menu";
import { ToggleDrawerButton } from "components/AppComponents/AppButton/AppButton";
import { MainBox } from "components/AppComponents/AppBox/AppBox";
import DaoView from "components/Dashboard/DaoView";
import { drawerWidth } from "components/AppComponents/AppBar/AppBar";
import useMainLayout from "hooks/useMainLayout";
import { StakingProvider } from "context/staking";

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

const MenuWrapper = styled("nav")<{ open: boolean; isMobile: boolean }>`
  padding: ${({ open, isMobile }) =>
    open && !isMobile ? "20px 12px" : "20px 8px"};
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
`;

const WalletBox = styled(Box)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
  padding: 0 0 0 10px;
`;

const MainLayout = observer(() => {
  const {
    account,
    error,
    isMobile,
    isActive,
    open,
    connect,
    isMetamask,
    toggleDrawer,
  } = useMainLayout()

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
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
        <Drawer variant="permanent" open={open}>
          <MainToolbar>
            {open && !isMobile && (
              <img
                src={FathomAppLogoSrc}
                alt={'logo'}
                style={{
                  height: "none",
                  maxWidth: "140px",
                }}
              />
            )}
            {!isMobile && (
              <ToggleDrawerButton open={open} onClick={toggleDrawer}>
                {open ? (
                  <ArrowBack sx={{ fontSize: "0.9rem" }} />
                ) : (
                  <ArrowForward sx={{ fontSize: "0.9rem", color: "#fff" }} />
                )}
              </ToggleDrawerButton>
            )}
          </MainToolbar>
          <Divider />
          <MenuWrapper open={open} isMobile={isMobile}>
            <Menu open={open} isMobile={isMobile} />
          </MenuWrapper>
        </Drawer>
        <MainBox component="main">
          <Toolbar />
          <AlertMessages />
          <TransactionStatus />
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/swap" element={<StableSwap />} />
            <Route path="proposal/:_proposalId" element={<ProposalView />} />
            <Route path="/dao" element={<DaoView />}>
              <Route path="governance" element={<AllProposalsView />} />
              <Route path="staking" element={
                <StakingProvider>
                  <StakingView />
                </StakingProvider>
              } />
            </Route>
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
          <Copyright />
        </MainBox>
      </Box>
    </ThemeProvider>
  );
});

export default MainLayout;
