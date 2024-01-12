import {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
} from "styled-components";
import { DefaultTheme } from "styled-components";
import styled from "styled-components";
import { Text, TextProps } from "rebass";
import { FC, ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return (
    <StyledComponentsThemeProvider theme={theme()}>
      {children}
    </StyledComponentsThemeProvider>
  );
};

export default ThemeProvider;

export const theme = (): DefaultTheme =>
  ({
    textColor: "white",

    panelColor: "rgba(255, 255, 255, 0)",
    backgroundColor: "#0E1D34",

    text1: "#FAFAFA",
    text2: "#C3C5CB",
    text3: "#002F2D",
    text4: "#565A69",
    text5: "#43FFF6",

    // special case text types
    white: "#FFFFFF",

    // backgrounds / greys
    bg1: "#0E1D34",
    bg2: "#2C2F36",
    bg3: "#43FFF6",
    bg4: "#565A69",
    bg5: "565A69",
    bg6: "#000",

    //specialty colors
    modalBG: "rgba(0,0,0,0.85)",
    advancedBG: "#192A42",
    divider: "#131f35",
    headerBackground: "#131f35",
    borderBG: "#253656",
    placeholderColor: "#4F658C",

    //primary colors
    primary1: "#2172E5",
    primary4: "#376bad70",
    primary5: "#153d6f70",

    // color text
    primaryText1: "#6da8ff",
    primaryText2: "#5977A0",

    shadow1: "#000",

    // other
    red1: "#FF6871",
    green1: "#27AE60",
    yellow1: "#FFE270",
    yellow2: "#F3841E",
    link: "#fff",
    blue: "2f80ed",

    background: "#0E1D34",
  } as DefaultTheme);

const TextWrapper = styled(Text)<{ color: string }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`;

export const TYPE = {
  main(props: TextProps) {
    return (
      <TextWrapper fontWeight={500} fontSize={14} color={"text1"} {...props} />
    );
  },

  body(props: TextProps) {
    return (
      <TextWrapper fontWeight={400} fontSize={14} color={"text1"} {...props} />
    );
  },

  green(props: TextProps) {
    return (
      <TextWrapper fontWeight={400} fontSize={14} color={"text3"} {...props} />
    );
  },

  small(props: TextProps) {
    return (
      <TextWrapper fontWeight={500} fontSize={11} color={"text1"} {...props} />
    );
  },

  header(props: TextProps) {
    return <TextWrapper fontWeight={600} color={"text1"} {...props} />;
  },

  largeHeader(props: TextProps) {
    return (
      <TextWrapper fontWeight={500} color={"text1"} fontSize={24} {...props} />
    );
  },

  light(props: TextProps) {
    return (
      <TextWrapper fontWeight={400} color={"text4"} fontSize={14} {...props} />
    );
  },
};

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
  :hover {
    text-decoration: underline;
  }
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`;

export const GlobalStyle = createGlobalStyle`
.three-line-legend {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 8px;
	font-size: 12px;
	color: #20262E;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

.three-line-legend-dark {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 8px;
	font-size: 12px;
	color: white;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

@media screen and (max-width: 800px) {
  .three-line-legend {
    display: none !important;
  }
}

.tv-lightweight-charts{
  width: 100% !important;
  

  & > * {
    width: 100% !important;
  }
}
`;
