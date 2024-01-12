import { createTheme } from "@mui/material/styles";

export const themeObject = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00FFF6",
    },
    secondary: {
      main: "#7D91B5",
    },
    info: {
      main: "#5A81FF",
    },
    success: {
      main: "#3DA329",
    },
    error: {
      main: "#DD3C3C",
    },
    background: {
      default: "#050c1a",
    },
  },
  // @ts-ignore
  typography: {
    fontFamily: ["Inter, sans-serif"].join(","),
  },
});
