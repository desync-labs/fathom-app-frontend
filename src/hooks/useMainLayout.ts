import { useCallback, useEffect, useState, MouseEvent, useRef } from "react";
import BigNumber from "bignumber.js";
import useConnector from "context/connector";
import { useMediaQuery, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import useWindowSize from "./useWindowResize";
import {
  useAggregateUniBalance,
  useXDCBalances,
} from "apps/dex/state/wallet/hooks";
import { TokenAmount } from "into-the-fathom-swap-sdk";
import usePrevious from "apps/dex/hooks/usePrevious";

const useMainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState<boolean>(!isMobile);
  const [showToggleDrawerBtn, setShowToggleDrawerBtn] = useState<boolean>(true);
  const { disconnect, isActive, account, error, isMetamask, isWalletConnect } =
    useConnector();

  const [openMobile, setOpenMobile] = useState<boolean>(false);
  const [openConnector, setOpenConnector] = useState<boolean>(false);
  const currentPath = useLocation();
  const [scroll, setScroll] = useState<number>(0);
  const [width, height] = useWindowSize();
  const [showFthmBalanceModal, setShowFthmBalanceModal] =
    useState<boolean>(false);

  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance();

  const countUpValue = aggregateBalance?.toFixed(0) ?? "0";
  const countUpValuePrevious = usePrevious(countUpValue) ?? "0";

  const userXDCBalance = useXDCBalances(account ? [account] : [])?.[
    account ?? ""
  ];

  const drawerRef = useRef<HTMLDivElement | null>(null);

  const toggleDrawer = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const scrollHandler = useCallback(() => {
    setScroll(window.scrollY);
  }, [setScroll]);

  useEffect(() => {
    const clientHeight =
      drawerRef?.current?.querySelector(".MuiPaper-root")?.clientHeight;
    if (
      BigNumber(clientHeight as number).isLessThan(580) ||
      isTablet ||
      isMobile
    ) {
      setOpen(false);
      setShowToggleDrawerBtn(false);
    } else {
      setShowToggleDrawerBtn(true);
      setOpen(true);
    }
  }, [isTablet, isMobile, width, height, setOpen, setShowToggleDrawerBtn]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollHandler]);

  useEffect(() => {
    if (isMobile) {
      const inputs = document.querySelectorAll('input[type="number"]');
      for (let i = inputs.length; i--; ) {
        inputs[i].setAttribute("pattern", "\\d*");
      }
    }
  }, [currentPath, isMobile]);

  const mainBlockClickHandler = useCallback(() => {
    if (isMobile && (openMobile || openConnector)) {
      setOpenMobile(false);
      setOpenConnector(false);
    }
  }, [isMobile, openMobile, openConnector, setOpenMobile, setOpenConnector]);

  const openMobileMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();

      setOpenMobile(true);
    },
    [setOpenMobile]
  );

  const openConnectorMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();

      setOpenConnector(true);
    },
    [setOpenConnector]
  );

  return {
    scroll,
    account,
    error,
    isMobile,
    isActive,
    open,
    disconnect,
    isMetamask,
    isWalletConnect,
    toggleDrawer,
    openMobile,
    setOpenMobile,
    openConnector,
    setOpenConnector,
    mainBlockClickHandler,
    openMobileMenu,
    openConnectorMenu,
    drawerRef,
    showToggleDrawerBtn,
    userXDCBalance,
    showFthmBalanceModal,
    setShowFthmBalanceModal,

    aggregateBalance,
    countUpValue,
    countUpValuePrevious,
  };
};

export default useMainLayout;
