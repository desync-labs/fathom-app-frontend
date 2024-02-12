import { ReactNode, useMemo } from "react";
import styled, {
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider,
} from "styled-components";
import { Text, TextProps } from "rebass";
import { Colors } from "apps/dex/theme/styled";

export * from "apps/dex/theme/components";

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 986,
  upToLarge: 1280,
  upToExtraLarge: 1500,
};

export const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css;
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  (accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {}) as any;

const white = "#FFFFFF";
const black = "#000000";

export function colors(): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: white,
    text2: "#4F658C",
    text3: "#00332F",
    text4: "#565A69",
    text5: "#2C2F36",
    text6: "#0E0F15",

    // backgrounds / greys
    bg1: "#131F35",

    // main background
    bg2: "#061023",
    bg3: "#43FFF6",
    bg4: "#565A69",
    bg5: "#6C7284",

    // header background
    bg6: "#0E0F15",
    bg7: "#00FFF9",

    modalBG: "rgba(0,0,0,.425)",
    modalContentBG: "#1D2D49",
    //specialty colors
    advancedBG: "rgba(0,0,0,0.1)",

    //primary colors
    primary1: "#253656",
    primary2: "#3680E7",
    primary3: "#4D8FEA",
    primary4: "#376bad70",
    primary5: "#22354F",

    // color text
    primaryText1: "#43FFF6",

    // other
    red1: "#FD4040",
    red2: "#F82D3A",
    red3: "#D60000",
    green1: "#27AE60",
    yellow1: "#FFE270",
    yellow2: "#F3841E",
    blue1: "#2172E5",
  };
}

export function theme(): DefaultTheme {
  return {
    ...colors(),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: "#000",

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  } as DefaultTheme;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const themeObject = useMemo(() => theme(), []);
  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {children}
    </StyledComponentsThemeProvider>
  );
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`;

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"text2"} {...props} />;
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"primary1"} {...props} />;
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"text6"} {...props} />;
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"white"} {...props} />;
  },
  body(props: TextProps) {
    return (
      <TextWrapper fontWeight={400} fontSize={16} color={"text1"} {...props} />
    );
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />;
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />;
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />;
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />;
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"blue1"} {...props} />;
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"bg3"} {...props} />;
  },
  italic(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={500}
        fontSize={12}
        fontStyle={"italic"}
        color={"text2"}
        {...props}
      />
    );
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return (
      <TextWrapper
        fontWeight={500}
        color={error ? "red1" : "text2"}
        {...props}
      />
    );
  },
};
