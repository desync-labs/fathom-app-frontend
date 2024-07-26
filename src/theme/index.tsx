import { SvgIcon, Theme, ThemeOptions } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { CSSProperties } from "react";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// @ts-ignore
import { ColorPartial } from "@mui/material/styles/createPalette";

const theme = createTheme();
const {
  typography: { pxToRem },
} = theme;

const FONT = "Inter, sans-serif";

declare module "@mui/material/styles/createPalette" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PaletteColor extends ColorPartial {}

  interface TypeText {
    muted: string;
    light: string;
  }

  interface TypeBackground {
    default: string;
    paper: string;
    surface: string;
    surface2: string;
    header: string;
    disabled: string;
  }

  interface Palette {
    gradients?: {
      fathomMainGradient: string;
      newGradient: string;
      fathomGradient: string;
      fathomlightGradient: string;
    };
    other: {
      standardInputLine: string;
      fathomAccent: string;
      fathomAccentLight: string;
      fathomAccentMute: string;
      fathomLink: string;
    };
  }

  interface PaletteOptions {
    gradients?: {
      fathomMainGradient: string;
      newGradient: string;
      fathomGradient: string;
      fathomlightGradient: string;
    };
  }
}

interface TypographyCustomVariants {
  display1: CSSProperties;
  subheader1: CSSProperties;
  subheader2: CSSProperties;
  description: CSSProperties;
  buttonL: CSSProperties;
  buttonM: CSSProperties;
  buttonS: CSSProperties;
  helperText: CSSProperties;
  tooltip: CSSProperties;
  main21: CSSProperties;
  secondary21: CSSProperties;
  main16: CSSProperties;
  secondary16: CSSProperties;
  main14: CSSProperties;
  secondary14: CSSProperties;
  main12: CSSProperties;
  secondary12: CSSProperties;
}

declare module "@mui/material/styles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TypographyVariants extends TypographyCustomVariants {}

  // allow configuration using `createTheme`
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TypographyVariantsOptions extends TypographyCustomVariants {}

  interface BreakpointOverrides {
    xsm: true;
    xxl: true;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    display1: true;
    subheader1: true;
    subheader2: true;
    description: true;
    buttonL: true;
    buttonM: true;
    buttonS: true;
    helperText: true;
    tooltip: true;
    main21: true;
    secondary21: true;
    main16: true;
    secondary16: true;
    main14: true;
    secondary14: true;
    main12: true;
    secondary12: true;
    h5: true;
    h6: true;
    subtitle1: true;
    subtitle2: true;
    body1: true;
    body2: true;
    button: false;
    overline: false;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    surface: true;
    gradient: true;
  }
}

export const getDesignTokens = () => {
  return {
    breakpoints: {
      keys: ["xs", "xsm", "sm", "md", "lg", "xl", "xxl"],
      values: {
        xs: 0,
        xsm: 480,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        xxl: 1800,
      },
    },
    palette: {
      mode: "dark",
      primary: {
        main: "#00FFF6",
        light: "#b0c5e7",
        dark: "#D2D4DC",
      },
      secondary: {
        main: "#7D91B5",
        light: "#F6A5C0",
        dark: "#AA647B",
      },
      error: {
        main: "#F44336",
        light: "#E57373",
        dark: "#D32F2F",
        "100": "#FBB4AF", // for alert text
        "200": "#2E0C0A", // for alert background
        "300": "#5a0000", // for alert border
      },
      warning: {
        main: "#f7b06e",
        light: "#FFB74D",
        dark: "#F57C00",
        "100": "#f7b06e", // for alert text
        "200": "#452508", // for alert background
        "300": "#5c310a", // for alert border
      },
      info: {
        main: "#29B6F6",
        light: "#4FC3F7",
        dark: "#0288D1",
        "100": "#A9E2FB", // for alert text
        "200": "#071F2E", // for alert background
      },
      success: {
        main: "#3DA329",
        light: "#90FF95",
        dark: "#388E3C",
        "100": "#C2E4C3", // for alert text
        "200": "#0A130B", // for alert background
      },
      text: {
        primary: "#fff",
        secondary: "#6379a1",
        light: "#c5d7f2",
        disabled: "#62677B",
        muted: "#5977a0",
        highlight: "#00fff6",
      },
      background: {
        default: "#071028",
        paper: "#132340",
        surface: "#1d2d49",
        surface2: "#1d2d49",
        header: "#101d32",
        disabled: "#EBEBEF14",
      },
      divider: "#2c4066",
      action: {
        active: "#EBEBEF8F",
        hover: "#2a3e5a",
        selected: "#2a3e5a",
        disabled: "#EBEBEF4D",
        disabledBackground: "#EBEBEF1F",
        focus: "#EBEBEF1F",
      },
      other: {
        standardInputLine: "#EBEBEF6B",
        fathomAccent: "#00FFF6",
        fathomAccentLight: "#B3FFF9",
        fathomAccentMute: "#2696a0",
        fathomLink: "#5a81ff",
      },
      gradients: {
        fathomMainGradient:
          "linear-gradient(104.04deg, rgb(179, 255, 249) 0%, rgb(0, 219, 203) 100%)",
        newGradient: "linear-gradient(79.67deg, #8C3EBC 0%, #007782 95.82%)",
        fathomGradient: "linear-gradient(180deg, #071126 0%, #050c1a 100%)",
        fathomlightGradient:
          "linear-gradient(104.04deg, rgb(179, 255, 249) 0%, rgb(0, 219, 203) 100%)",
      },
    },
    spacing: 8,
    typography: {
      fontFamily: FONT,
      h5: undefined,
      h6: undefined,
      subtitle1: undefined,
      subtitle2: undefined,
      body1: undefined,
      body2: undefined,
      button: undefined,
      overline: undefined,
      display1: {
        fontFamily: FONT,
        fontWeight: 700,
        letterSpacing: pxToRem(0.25),
        lineHeight: "123.5%",
        fontSize: pxToRem(32),
      },
      h1: {
        fontFamily: FONT,
        fontWeight: 700,
        letterSpacing: pxToRem(0.25),
        lineHeight: "123.5%",
        fontSize: pxToRem(28),
      },
      h2: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: "unset",
        lineHeight: "133.4%",
        fontSize: pxToRem(20),
      },
      h3: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: "160%",
        fontSize: pxToRem(18),
      },
      h4: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      subheader1: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: pxToRem(14),
      },
      subheader2: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      description: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: "143%",
        fontSize: pxToRem(14),
      },
      caption: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      buttonL: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.46),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      buttonM: {
        fontFamily: FONT,
        fontWeight: 500,
        lineHeight: pxToRem(24),
        fontSize: pxToRem(14),
      },
      buttonS: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.46),
        lineHeight: pxToRem(20),
        textTransform: "uppercase",
        fontSize: pxToRem(10),
      },
      helperText: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.4),
        lineHeight: pxToRem(12),
        fontSize: pxToRem(10),
      },
      tooltip: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      main21: {
        fontFamily: FONT,
        fontWeight: 600,
        lineHeight: "133.4%",
        fontSize: pxToRem(21),
      },
      secondary21: {
        fontFamily: FONT,
        fontWeight: 500,
        lineHeight: "133.4%",
        fontSize: pxToRem(21),
      },
      main16: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      secondary16: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      main14: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: pxToRem(14),
      },
      secondary14: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: "14px",
      },
      main12: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      secondary12: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
    },
  } as ThemeOptions;
};

export function getThemedComponents(theme: Theme) {
  return {
    components: {
      MuiSkeleton: {
        styleOverrides: {
          root: {
            transform: "unset",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "6px",
            borderColor: theme.palette.divider,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            color: theme.palette.text.primary,
            "&::placeholder": {
              color: theme.palette.text.muted,
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            "& .MuiSlider-thumb": {
              color: "#00fff6",
            },
            "& .MuiSlider-track": {
              color: "#00fff6",
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: "8px",
          },
          sizeLarge: {
            ...theme.typography.buttonL,
            padding: "10px 24px",
          },
          sizeMedium: {
            ...theme.typography.buttonM,
            padding: "8px 12px",
            height: "32px",
          },
          sizeSmall: {
            ...theme.typography.buttonS,
            padding: "0 6px",
          },
        },
        variants: [
          {
            props: { variant: "surface" },
            style: {
              color: theme.palette.common.white,
              backgroundColor: "#253656",
              "&:hover, &.Mui-focusVisible": {
                backgroundColor: theme.palette.background.header,
              },
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
          {
            props: { variant: "gradient" },
            style: {
              color: theme.palette.common.black,
              background: theme.palette.gradients?.fathomlightGradient,
              boxSizing: "border-box",
              border: "1px solid transparent",
              "&:hover, &.Mui-focusVisible": {
                background: "transparent",
                color: theme.palette.other.fathomAccentLight,
                border: "1px solid " + theme.palette.other.fathomAccentLight,
              },
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
          {
            props: { color: "primary", variant: "outlined" },
            style: {
              background: theme.palette.background.surface,
              borderColor: theme.palette.divider,
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              color: theme.palette.other.fathomAccent,
              background: "transparent",
              border: "1px solid " + theme.palette.other.fathomAccent,
              "&:hover, &.Mui-focusVisible": {
                background: "transparent",
                color: theme.palette.other.fathomAccentLight,
                border: "1px solid " + theme.palette.other.fathomAccentLight,
              },
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
        ],
      },
      MuiTypography: {
        defaultProps: {
          variant: "description",
          variantMapping: {
            display1: "h1",
            h1: "h1",
            h2: "h2",
            h3: "h3",
            h4: "h4",
            h5: "h5",
            h6: "h6",
            subheader1: "p",
            subheader2: "p",
            caption: "p",
            description: "p",
            buttonL: "p",
            buttonM: "p",
            buttonS: "p",
            main12: "p",
            main14: "p",
            main16: "p",
            main21: "p",
            secondary12: "p",
            secondary14: "p",
            secondary16: "p",
            secondary21: "p",
            helperText: "div",
            tooltip: "div",
          },
        },
      },
      MuiLink: {
        defaultProps: {
          variant: "description",
        },
      },
      MuiMenu: {
        defaultProps: {
          PaperProps: {
            elevation: 0,
            variant: "outlined",
            style: {
              minWidth: 240,
              marginTop: "4px",
            },
          },
        },
      },
      MuiList: {
        styleOverrides: {
          padding: {
            paddingTop: "4px",
            paddingBottom: "4px",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            padding: "8px 16px",
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            ...theme.typography.description,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: theme.palette.primary.light,
            minWidth: "unset !important",
            marginRight: "12px",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            marginTop: 0,
            marginBottom: 0,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
          },
        },
        variants: [
          {
            props: { variant: "outlined" },
            style: {
              border: `1px solid ${theme.palette.divider}`,
              background: theme.palette.background.paper,
            },
          },
          {
            props: { variant: "elevation" },
            style: {
              boxShadow:
                "0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)",
              ...(theme.palette.mode === "dark"
                ? { backgroundImage: "none" }
                : {}),
            },
          },
        ],
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: "#fff",
            color: "#000c24",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "8px 12px",
            ...theme.typography.tooltip,
          },
          arrow: {
            color: theme.palette.background.paper,
            "&:before": {
              boxShadow:
                "0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: theme.palette.text.secondary,
            "&.Mui-checked": {
              color: theme.palette.text.primary,
            },
            "&.Mui-disabled": {
              color: theme.palette.action.disabled,
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            "&.Mui-checked": {
              color: theme.palette.other.fathomAccent,
              "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.other.fathomAccent,
                opacity: 0.5,
              },
            },
            "&.Mui-disabled": {
              opacity: theme.palette.mode === "dark" ? 0.3 : 0.7,
            },
          },
        },
      },
      MuiIcon: {
        variants: [
          {
            props: { fontSize: "large" },
            style: {
              fontSize: pxToRem(32),
            },
          },
        ],
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: theme.palette.divider,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            ...theme.typography.caption,
            boxShadow: "none",
            alignItems: "flex-start",
            "&.MuiAlert-root": {
              padding: "4px 16px",
              marginTop: "12px",
              marginBottom: "12px",
            },
          },
        },
        defaultProps: {
          iconMapping: {
            error: (
              <SvgIcon color="inherit">
                <ErrorOutlineOutlinedIcon />
              </SvgIcon>
            ),
            info: (
              <SvgIcon color="inherit">
                <InfoOutlinedIcon />
              </SvgIcon>
            ),
            success: (
              <SvgIcon color="inherit">
                <CheckCircleOutlineOutlinedIcon />
              </SvgIcon>
            ),
            warning: (
              <SvgIcon color="inherit">
                <ErrorOutlineOutlinedIcon />
              </SvgIcon>
            ),
          },
        },
        variants: [
          {
            props: { severity: "error" },
            style: {
              color: theme.palette.error["100"],
              background: theme.palette.error["200"],
              border: `1px solid ${theme.palette.error["300"]}`,
              a: {
                color: theme.palette.error["100"],
              },
              ".MuiButton-text": {
                padding: 0,
                color: theme.palette.error["100"],
              },
            },
          },
          {
            props: { severity: "info" },
            style: {
              color: theme.palette.info["100"],
              background: theme.palette.info["200"],
              border: `1px solid ${theme.palette.divider}`,
              a: {
                color: theme.palette.info["100"],
              },
              ".MuiButton-text": {
                padding: 0,
                color: theme.palette.info["100"],
              },
            },
          },
          {
            props: { severity: "success" },
            style: {
              color: theme.palette.success["100"],
              background: theme.palette.success["200"],
              a: {
                color: theme.palette.success["100"],
              },
              ".MuiButton-text": {
                padding: 0,
                color: theme.palette.success["100"],
              },
            },
          },
          {
            props: { severity: "warning" },
            style: {
              color: theme.palette.warning["100"],
              background: theme.palette.warning["200"],
              border: "1px solid" + theme.palette.warning["300"],
              a: {
                textDecoration: "none",
                color: theme.palette.other.fathomLink,
                "&:hover": {
                  textDecoration: "underline",
                },
              },
              ".MuiButton-text": {
                padding: 0,
                color: theme.palette.warning["100"],
              },
            },
          },
        ],
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: pxToRem(14),
            lineHeight: 1.5,
            minWidth: "375px",
            color: "#fff",
            background: "#050c1a",
            "> div:first-of-type": {
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            },
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          colorPrimary: {
            color: theme.palette.primary.light,
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          IconComponent: (props) => (
            <KeyboardArrowDownRoundedIcon
              sx={{ fontSize: "22px" }}
              {...props}
            />
          ),
        },
        styleOverrides: {
          root: {
            "&.Mui-focused, &:hover": {
              ".MuiOutlinedInput-notchedOutline": {
                border: "1px solid #5a81ff",
                boxShadow: "0 0 8px #003cff",
              },
            },
            "&.Mui-disabled:hover": {
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#EBEBEF4D",
                boxShadow: "none",
              },
            },
          },
          outlined: {
            backgroundColor: theme.palette.background.surface,
            ...theme.typography.buttonM,
            padding: "6px 12px",
            color: theme.palette.primary.light,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          bar1Indeterminate: {
            background: theme.palette.gradients?.fathomMainGradient,
          },
          bar2Indeterminate: {
            background: theme.palette.gradients?.fathomMainGradient,
          },
        },
      },
      MuiModal: {
        styleOverrides: {
          root: {
            [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
              "&.LendingModal": {
                "&>.MuiPaper-root": {
                  position: "relative",
                  height: "100dvh",
                  width: "100%",
                  maxHeight: "unset",
                  maxWidth: "unset",
                  borderRadius: "0",
                  margin: "0",
                },
              },
              ".TxActionsWrapper": {
                position: "absolute",
                bottom: 50,
                left: 20,
                right: 20,
              },
            },
          },
        },
      },
    },
  } as ThemeOptions;
}
