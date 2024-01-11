import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { createContext, ReactNode, useMemo } from "react";

import { getDesignTokens, getThemedComponents } from "apps/lending/utils/theme";

export const ColorModeContext = createContext({});

/**
 * Main Layout component which wrapps around the whole app
 * @param param0
 * @returns
 */
export function AppGlobalStyles({ children }: { children: ReactNode }) {
  const theme = useMemo(() => {
    const themeCreate = createTheme(getDesignTokens("dark"));
    return deepmerge(themeCreate, getThemedComponents(themeCreate));
  }, []);

  return (
    <ColorModeContext.Provider value={"dark"}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />

        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
