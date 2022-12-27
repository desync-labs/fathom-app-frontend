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

  console.log(isMobile);

  return {
    account,
    error,
    isMobile,
    isActive,
    open,
    connect,
    isMetamask,
    toggleDrawer,
  };
};

export default useMainLayout;
