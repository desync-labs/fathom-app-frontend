import { useCallback, useEffect, useState } from "react";
import useMetaMask from "context/metamask";
import { useStores } from "stores";
import { useMediaQuery, useTheme } from "@mui/material";

const useMainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState<boolean>(!isMobile);
  const { connect, isActive, account, chainId, error, isMetamask } =
    useMetaMask()!;
  const [openMobile, setOpenMobile] = useState(false);

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
    if (isMobile && openMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, openMobile, setOpenMobile])

  return {
    account,
    error,
    isMobile,
    isActive,
    open,
    connect,
    isMetamask,
    toggleDrawer,
    openMobile,
    setOpenMobile,
    mainBlockClickHandler,
  };
};

export default useMainLayout;
