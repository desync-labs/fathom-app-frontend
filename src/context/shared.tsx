import { createContext, FC, ReactElement, useContext, useMemo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

export type UseSharedContextReturn = {
  isMobile: boolean;
  isTablet: boolean;
  isSmallDesktop: boolean;
  isMediumDesktop: boolean;
  isLargeDesktop: boolean;
};

export const SharedContext = createContext<UseSharedContextReturn>(
  {} as UseSharedContextReturn
);

type SharedProviderType = {
  children: ReactElement;
};

export const SharedProvider: FC<SharedProviderType> = ({ children }) => {
  const theme = useTheme();
  /**
   * Less than 600px
   */
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  /**
   * Less than 900px
   */
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  /**
   * Less than 1200px
   */
  const isSmallDesktop = useMediaQuery(theme.breakpoints.down("lg"));
  /**
   * Less than 1536px
   */
  const isMediumDesktop = useMediaQuery(theme.breakpoints.down("xl"));
  /**
   * Greater than 1536px
   */
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("xl"));

  const values = useMemo(
    () => ({
      isMobile,
      isTablet,
      isSmallDesktop,
      isMediumDesktop,
      isLargeDesktop,
    }),
    [isMobile, isTablet, isSmallDesktop, isMediumDesktop, isLargeDesktop]
  );

  return (
    <SharedContext.Provider value={values}>{children}</SharedContext.Provider>
  );
};

const useSharedContext = () => useContext(SharedContext);

export default useSharedContext;
