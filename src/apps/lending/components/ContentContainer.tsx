import { FC, ReactNode } from "react";
import { Container } from "@mui/material";

interface ContentContainerProps {
  children: ReactNode;
}

export const lendingContainerProps = {
  sx: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    pb: "39px",
    px: {
      xs: 2,
      xsm: 2.5,
      sm: 6,
      md: 2.5,
      lg: 2,
      xl: "60px",
      xxl: 2,
    },
    maxWidth: {
      xs: "unset",
      lg: "1240px",
      xl: "unset",
      xxl: "1440px",
    },
  },
};

export const ContentContainer: FC<ContentContainerProps> = ({ children }) => {
  return <Container {...lendingContainerProps}>{children}</Container>;
};
