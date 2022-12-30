import { useCallback, useEffect, useState, MouseEvent } from "react";
import useConnector from "context/connector";
import { useStores } from "stores";
import { useMediaQuery, useTheme } from "@mui/material";

const useMainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState<boolean>(!isMobile);
  const {
    disconnect,
    isActive,
    account,
    chainId,
    error,
    isMetamask,
    isWalletConnect,
  } = useConnector()!;

  const [openMobile, setOpenMobile] = useState(false);
  const [openMobileConnector, setOpenMobileConnector] = useState(false);

  const toggleDrawer = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const rootStore = useStores();

  useEffect(() => {
    if (chainId) {
      rootStore.setChainId(chainId!);
    }
  }, [chainId, rootStore]);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile, setOpen]);

  const mainBlockClickHandler = useCallback(() => {
    if (isMobile && (openMobile || openMobileConnector)) {
      setOpenMobile(false);
      setOpenMobileConnector(false);
    }
  }, [isMobile, openMobile, openMobileConnector, setOpenMobile, setOpenMobileConnector]);

  const openMobileMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();

    setOpenMobile(true)
  }, [setOpenMobile])

  const openConnectorMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();

    setOpenMobileConnector(true)
  }, [setOpenMobileConnector])

  return {
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
    openMobileConnector,
    setOpenMobile,
    setOpenMobileConnector,
    mainBlockClickHandler,
    openMobileMenu,
    openConnectorMenu,
  };
};

export default useMainLayout;
