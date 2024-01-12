import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { createContext, FC, ReactNode, useMemo } from "react";

import { getDesignTokens, getThemedComponents } from "apps/lending/utils/theme";

export const ColorModeContext = createContext({});

/**
 * Main Layout component which wrapps around the whole app
 * @param param0
 * @returns
 */
export const AppGlobalStyles: FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useMemo(() => {
    const themeCreate = createTheme(getDesignTokens("dark"));
    return deepmerge(themeCreate, getThemedComponents(themeCreate));
  }, []);

  return (
    <ColorModeContext.Provider value={"dark"}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
