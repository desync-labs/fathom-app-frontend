import { createContext, FC, ReactElement, useContext, useMemo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

export type UseSharedContextReturn = {
  isMobile: boolean;
  isTablet: boolean;
};

export const SharedContext = createContext<UseSharedContextReturn>(
  {} as UseSharedContextReturn
);

type SharedProviderType = {
  children: ReactElement;
};

export const SharedProvider: FC<SharedProviderType> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const values = useMemo(
    () => ({
      isMobile,
      isTablet,
    }),
    [isMobile, isTablet]
  );

  return (
    <SharedContext.Provider value={values}>{children}</SharedContext.Provider>
  );
};

const useSharedContext = () => useContext(SharedContext);

export default useSharedContext;
