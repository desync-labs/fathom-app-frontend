import {
  useCallback,
  useEffect,
  useState,
  MouseEvent,
  useRef
} from "react";
import useConnector from "context/connector";
import { useStores } from "stores";
import {
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useLocation } from "react-router-dom";
import useWindowSize from "./useWindowResize";

const useMainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState<boolean>(!isMobile);
  const [showToggleDrawerBtn, setShowToggleDrawerBtn] = useState<boolean>(true);
  const {
    disconnect,
    isActive,
    account,
    chainId,
    error,
    isMetamask,
    isXdcPay,
    isWalletConnect
  } = useConnector()!;

  const [openMobile, setOpenMobile] = useState(false);
  const [openConnector, setOpenConnector] = useState(false);
  const currentPath = useLocation();
  const [scroll, setScroll] = useState<number>(0);
  const  [width, height] = useWindowSize();

  const drawerRef = useRef<HTMLDivElement|null>(null);

  const toggleDrawer = useCallback(() => {
    console.log('toggleDrawer')
    setOpen(!open);
  }, [open, setOpen]);

  const rootStore = useStores();

  const scrollHandler = useCallback((event: Event) => {
    setScroll(window.scrollY);
  }, [setScroll]);


  useEffect(() => {
    if (chainId) {
      rootStore.setChainId(chainId!);
    }
  }, [chainId, rootStore]);

  useEffect(() => {
    if (drawerRef.current?.querySelector(".MuiPaper-root")!.clientHeight! < 580 || isTablet || isMobile) {
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
      const inputs = document.querySelectorAll("input[type=\"number\"]");
      for (let i = inputs.length; i--;) {
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
    isXdcPay,
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
    showToggleDrawerBtn
  };
};

export default useMainLayout;
