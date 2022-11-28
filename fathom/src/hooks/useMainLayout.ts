import { useCallback, useEffect, useState } from "react";
import useMetaMask from "hooks/metamask";
import { useStores } from "stores";

const useMainLayout = () => {
  const [open, setOpen] = useState<boolean>(true);
  const { connect, isActive, account, chainId, error, isMetamask } =
    useMetaMask()!;
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const toggleDrawer = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const rootStore = useStores();

  useEffect(() => {
    if (chainId) {
      rootStore.setChainId(chainId!);
    }
  }, [chainId, rootStore]);

  const resizeHandler = useCallback(() => {
    const isMobile = Math.min(window.screen.width, window.screen.height) < 768;
    setIsMobile(isMobile);

    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [setIsMobile, setOpen]);

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    resizeHandler();
    return () => window.removeEventListener("resize", resizeHandler);
  }, [resizeHandler]);

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
