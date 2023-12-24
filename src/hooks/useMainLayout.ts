import { useCallback, useEffect, useState, MouseEvent, useRef } from "react";
import BigNumber from "bignumber.js";
import useConnector from "context/connector";
import { useLocation } from "react-router-dom";
import useWindowSize from "./useWindowResize";
import {
  useAggregateUniBalance,
  useXDCBalances,
} from "apps/dex/state/wallet/hooks";
import { TokenAmount } from "into-the-fathom-swap-sdk";
import usePrevious from "apps/dex/hooks/usePrevious";
import useSharedContext from "context/shared";

const useMainLayout = () => {
  const { isMobile, isTablet } = useSharedContext();
  const [open, setOpen] = useState<boolean>(!isMobile);
  const [showToggleDrawerBtn, setShowToggleDrawerBtn] = useState<boolean>(true);
  const {
    disconnect,
    isActive,
    account,
    error,
    isMetamask,
    isWalletConnect,
    openConnector,
    setOpenConnector,
  } = useConnector();

  const [openMobile, setOpenMobile] = useState<boolean>(false);
  const currentPath = useLocation();
  const [scroll, setScroll] = useState<number>(0);
  const [width, height] = useWindowSize();
  const [showFthmBalanceModal, setShowFthmBalanceModal] =
    useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] =
    useState<boolean>(false);
  const [savedOpen, setSavedOpen] = useState<boolean>(false);

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
    if (isMobile && isMobileFiltersOpen) {
      setIsMobileFiltersOpen(false);
    }
  }, [
    isMobile,
    openMobile,
    openConnector,
    isMobileFiltersOpen,
    setOpenMobile,
    setOpenConnector,
    setIsMobileFiltersOpen,
  ]);

  const openMobileMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();

      setOpenMobile(true);
    },
    [setOpenMobile]
  );

  const openMobileFilterMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();

      setIsMobileFiltersOpen(!isMobileFiltersOpen);
    },
    [setIsMobileFiltersOpen, isMobileFiltersOpen]
  );

  return {
    savedOpen,
    setSavedOpen,
    scroll,
    account,
    error,
    isMobile,
    isActive,
    open,
    disconnect,
    isMetamask,
    isWalletConnect,
    isMobileFiltersOpen,
    toggleDrawer,
    openMobile,
    setOpenMobile,
    openConnector,
    setOpenConnector,
    mainBlockClickHandler,
    openMobileMenu,
    openMobileFilterMenu,
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
