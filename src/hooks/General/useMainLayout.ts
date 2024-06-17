import { useCallback, useEffect, useState, MouseEvent, useRef } from "react";
import BigNumber from "bignumber.js";
import useConnector from "context/connector";
import { useLocation } from "react-router-dom";
import useWindowSize from "hooks/General/useWindowResize";
import { useAggregateFTHMBalance } from "apps/dex/state/wallet/hooks";
import { TokenAmount } from "into-the-fathom-swap-sdk";
import usePrevious from "apps/dex/hooks/usePrevious";
import useSharedContext from "context/shared";
import { BigNumber as eBigNumber } from "fathom-ethers";

const useMainLayout = () => {
  const { isMobile, isTablet } = useSharedContext();
  const [open, setOpen] = useState<boolean>(!isMobile);
  const [showToggleDrawerBtn, setShowToggleDrawerBtn] = useState<boolean>(true);
  const {
    chainId,
    library,
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
  const [savedOpen, setSavedOpen] = useState<boolean>(false);

  const aggregateBalance: TokenAmount | undefined = useAggregateFTHMBalance();

  const countUpValue = aggregateBalance?.toFixed(0) ?? "0";
  const countUpValuePrevious = usePrevious(countUpValue) ?? "0";
  const [userBalance, setUserBalance] = useState<null | string>(null);

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
    let timeout: ReturnType<typeof setTimeout>;
    if (chainId) {
      timeout = setTimeout(() => {
        library.getBalance(account).then((balance: eBigNumber) => {
          setUserBalance(
            BigNumber(balance.toString()).dividedBy(1e18).toString()
          );
        });
      }, 100);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [library, account, chainId]);

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
    toggleDrawer,
    openMobile,
    setOpenMobile,
    openConnector,
    setOpenConnector,
    mainBlockClickHandler,
    openMobileMenu,
    drawerRef,
    showToggleDrawerBtn,
    userBalance,
    showFthmBalanceModal,
    setShowFthmBalanceModal,
    aggregateBalance,
    countUpValue,
    countUpValuePrevious,
  };
};

export default useMainLayout;
